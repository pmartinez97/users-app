const { User } = require("../models/User");
const bcrypt = require("bcrypt");

require("dotenv").config();
// Environment vars
const BCRYPT_SALT_ROUNDS = process.env.BCRYP_ROUNDS;

const authenticate = (plainTextPass, password) => {
  if (!plainTextPass) return false;
  return bcrypt.compareSync(plainTextPass, password);
};

const encryptPassword = async (password) => {
  let salt = await bcrypt.genSalt(parseInt(BCRYPT_SALT_ROUNDS));
  hashedPass = await bcrypt.hash(password, salt);

  return hashedPass;
};

const getUser = async (userId) => {
  const user = await User.findById(userId);
  return user;
};

module.exports = {
  encryptPassword,
  authenticate,
  getUser,
};
