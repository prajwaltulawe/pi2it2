const fetch = require('node-fetch');
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const nodemailer = require("nodemailer");

const {redisClient} = require('../db');
redisClient.on('error', err => console.log('Redis Client Error', err));
redisClient.connect().then(() => {
    console.log('Connected to Redis...');
});

const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const fetchUser = require("../middleware/fetchUser");
let success = false;

router.post("/getOAuthUserData", async function (req, res) {
  const access_token = req.body.access_token;
  try {
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`)
    const data = await response.json();
    const {name, email} = data;
    
    // CHECK WHETHER USER EXISTS OR NOT
    let user = await User.findOne({ email: email });
    if (user) {
      success = false;
      return res
        .status(409)
        .json({ success, error: "Email id already registered..! Please use different email id or login with same" });
    }

    if(email.endsWith("students.isquareit.edu.in")){
      await redisClient.setEx(email, 300, "true");
      success = true;
      res.json({ success, data: {name, email} });
    }else{  
      success = false;
      return res
        .status(409)
        .json({ success, error: "Email id is not associated with I SQUARE IT Organization!" });
    }
  } catch (error) {
    res.status(500).json( {success, error: `${error}`});
  }
})

// CREATE A USER USING POST "API/AUTH/CREATEUSER"
router.post(
  "/createUser",
  [
    body("name", "Name length must be more than 2 characters").isLength({
      min: 2,
    }),
    body("email", "Invalid EmaIl").isEmail().contains("students.isquareit.edu.in"),
    body("password", "Password must be atleast 3 characters").isLength({
      min: 3,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(406).json({ success, error: errors.array()[0].msg });
    }

    try {
      
      // CHECK IF VISITED THROUGH OAUTH, IN REDIS
      const redisUser = await redisClient.get(req.body.email, (err, data) => {
        if (err) throw err;
        if (data !== null) {
          success=false;
          return res.status(400).json({ success, error: "Invalid Request !" });
        }
      });
      redisClient.del(req.body.email) ? redisUser : "" 

      // CHECK WHETHER USER EXISTS OR NOT
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        success = false;
        return res
          .status(409)
          .json({ success, error: "Email id already registered..! Please use different email id or login with same" });
      }

      const salt = await bycrypt.genSalt(10);
      const secPass = await bycrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
      success = false;
    } catch (error) {
      res.status(500).json( {success, error: `${error}`});
    }
  }
);

// PASSWORD RESET LINK USING POST "API/AUTH/GETRESETPASSWORDLINK"
router.post(
  "/getResetPasswordLink",
  [
    body("email", "Invalid EmaIl").isEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      success = false;
      return res.status(406).json({ success, error: errors.array()[0].msg });
    }

    const { email } = req.body;
    // CHECK WHETHER USER EXISTS OR NOT
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res.status(400).json({ success, error: "Email Id not registered !" });
      }
    
      // CREATE ONE TIME LINK FOR USER
      const secret = JWT_SECRET + user.password;
      const payload = {
        email: user.email,
        id: user.id,
      };
      const token = jwt.sign(payload, secret, { expiresIn: '15m' });
      const redirectUrl = process.env.RESET_PASSWORD_URL + user.id + "/" + token;

      const auth = nodemailer.createTransport({
        service: "gmail",
        secure : true,
        port : 465,
        auth: {
            user: "prajwalt_td2106@students.isquareit.edu.in",
            pass: "hosa uzkf bgew fblo "

        }
      });

      const receiver = {
          from : "prajwalt_td2106@students.isquareit.edu.in",
          to : user.email,
          subject : "Password reset link!",
          text : `Dear ${user.name},
          
We have received a request to reset your password for your account associated with email. Please click the link below to reset your password:
          
${redirectUrl}
          
If you did not request a password reset, please ignore this email. Your password will remain unchanged.
          
Important Notice:
This email is sent from an address associated with I SQUARE IT; however, it is related to ${user.name} and not affiliated with or endorsed by I SQUARE IT in any way.
          
Thank you,
Prajwal Tulawe
Alumni 2023-24
https://portfolio-prajwaltulawe.vercel.app/
          
If you need further assistance, feel free to reach out to us.`
      };

      auth.sendMail(receiver, (error, emailResponse) => {
          if(error){
            throw error;
          }
          success = true;
          res.json({ success });
      });

    } catch (error) {
      res.status(500).json( {success, error: "Some Error Occoured"});
    }
  }
);

// PASSWORD RESET LINK USING POST "API/AUTH/RESETPASSWORD"
router.post(
  "/resetPassword",
  async (req, res) => {

    const { id, token, password } = req.body;
    console.log( id, token, password)

    // CHECK WHETHER USER EXISTS OR NOT
    try {
      let user = await User.findById(id)
      if (!user) {
        success = false;
        return res.status(400).json({ success, error: "Invalid token !" });
      }
      console.log(user)
      const secret = JWT_SECRET + user.password;
      const payload = jwt.verify(token, secret);
      console.log(payload)
    } catch (error) {
      res.status(500).json( {success, error: "Some Error Occoured"});
    }
  }
);

// LOGIN A USER USING POST "API/AUTH/LOGIN"
router.post(
  "/login",
  [
    body("email", "Invalid EmaIl").isEmail().contains("students.isquareit.edu.in"),
    body("password", "Password cannot be blank !").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      success = false;
      return res.status(406).json({ success, error: errors.array()[0].msg });
    }

    const { email, password } = req.body;
    // CHECK WHETHER USER EXISTS OR NOT
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res.status(400).json({ success, error: "Incorrect credentials !" });
      }

      const passCompare = await bycrypt.compare(password, user.password);
      if (!passCompare) {
        success = false;
        return res.status(400).json({ success, error: "Incorrect credentials !" });
      }
      const payLoad = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(payLoad, JWT_SECRET);
      success = true;
      res.json({ success, authToken, userName: user.name });
    } catch (error) {
      res.status(500).json( {success, error: "Some Error Occoured"});
    }
  }
);

// GET LOGEDIN USER DETAILS "API/AUTH/GETUSER"
/*router.post("/getUser", fetchUser, async (req, res) => {
  try {
    var userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    res.status(500).send("Some Error Occoured");
  }
});
 */
module.exports = router;