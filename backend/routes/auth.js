const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "qwert";

const fetchUser = require("../middleware/fetchUser");
let success = false;

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

    // CHECK WHETHER USER EXISTS OR NOT
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(409)
          .json({ success, error: "Email id already registered..!" });
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
