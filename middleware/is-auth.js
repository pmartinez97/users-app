const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_KEY = process.env.JWT_PRIVATE_KEY;

module.exports = (req, res, next) => {
  const token = req.get("Authorization");

  if (!token || token === "") {
    req.isAuth = false;
    return next();
  }

  const cleanToken = token.split(" ")[1];

  let decodedToken;
  try {
    decodedToken = jwt.verify(cleanToken, JWT_KEY);
  } catch (err) {
    req.isAuth = false;
    return next();
  }

  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }

  req.isAuth = true;
  req.userId = decodedToken.userId;
  next();
};
