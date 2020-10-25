const { User } = require("../models/User");
const jwt = require("jsonwebtoken");
const auth = require("./auth");
const bcrypt = require("bcrypt");

require("dotenv").config();
// Environment vars
const BCRYPT_SALT_ROUNDS = process.env.BCRYP_ROUNDS;
const JWT_KEY = process.env.JWT_PRIVATE_KEY;

const createUser = (args) => {
  return new Promise(async (resolve, reject) => {
    let user = await User.findOne({ email: args.email });
    if (user) reject(err);

    const hashedPass = await auth.encryptPassword(args.password);

    user = new User({
      name: args.name,
      lastname: args.lastname,
      email: args.email,
      age: args.age,
      password: hashedPass,
    });

    try {
      const userSaved = await user.save();
      resolve(userSaved);
    } catch (err) {
      reject(err);
    }
  });
};

const findUsers = (args) => {
  let filters = [];

  if (args.name) filters.push({ name: { $regex: args.name } });
  if (args.email) filters.push({ email: { $regex: args.email } });
  if (args.lastname) filters.push({ lastname: { $regex: args.lastname } });
  if (args.age) filters.push({ age: args.age });

  let query = {};
  if (filters.length > 0) {
    query = { $and: filters };
  }

  return new Promise((resolve, reject) => {
    User.find(query)
      .then((users) => resolve(users))
      .catch((err) => reject(err));
  });
};

const loginUser = async (args) => {
  const user = await User.findOne({ email: args.email });

  if (!user) {
    throw new Error("User does not exist");
  }

  const match = auth.authenticate(args.password, user.password);

  if (!match) {
    throw new Error("Incorrect password");
  }

  // Auth successful
  const token = jwt.sign(
    {
      email: user.email,
      userId: user._id,
    },
    JWT_KEY
  );

  return token;
};

const deleteUser = (userId) => {
  return new Promise((resolve, reject) => {
    User.deleteOne({ _id: userId })
      .then((op) => resolve(op))
      .catch((err) => reject(err));
  });
};

const updateUser = async (args) => {
  let params = {};
  for (let prop in args)
    if (args[prop] && prop != "id") params[prop] = args[prop];

  if (typeof args.email !== "undefined" && args.email.length > 0) {
    let user = await User.findOne({ email: args.email });

    if (user) {
      throw new Error("The email is invalid or already taken!");
    }
  }

  if (typeof args.password !== "undefined" && args.password.length > 0) {
    try {
      let salt = await bcrypt.genSalt(parseInt(BCRYPT_SALT_ROUNDS));
      params.password = await bcrypt.hash(args.password, salt);
    } catch (err) {
      throw new Error(`Error! ${err.message}`);
    }
  }

  return User.findByIdAndUpdate(args.id, params, {
    omitUndefined: true,
    new: true,
  });
};

module.exports = {
  createUser,
  findUsers,
  loginUser,
  deleteUser,
  updateUser,
};
