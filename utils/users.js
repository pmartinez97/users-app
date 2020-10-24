const { User } = require("../models/User");
const jwt = require("jsonwebtoken");
const auth = require("./auth");

require("dotenv").config();
// Environment vars
const JWT_KEY = process.env.JWT_PRIVATE_KEY;

const createUser = (args) => {
  console.log(args);
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

module.exports = {
  createUser,
  findUsers,
  loginUser,
};
