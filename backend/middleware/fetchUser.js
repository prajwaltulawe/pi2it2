const jwt = require("jsonwebtoken");
const JWT_SECRET = "qwert";

const fetchUser = async (req, res, next) => {
  // GET USER FROM JWT TOKEN AND ADD ID TO REQ OBJECT
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "Plese authenticate using a valid token " });
  }
  try {
    const data = await jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Plese authenticate using a valid token " });
  }
};

module.exports = fetchUser;