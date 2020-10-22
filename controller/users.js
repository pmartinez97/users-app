const { User } = require("../models/User");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

require("dotenv").config();

// Environment vars
const BCRYPT_SALT_ROUNDS = process.env.BCRYP_ROUNDS;
const JWT_KEY = process.env.JWT_PRIVATE_KEY;

const createUser = async (req, res) => {
  const validationErrors = validationResult(req).array();
  if (validationErrors.length > 0) {
    return res.status(400).send(validationErrors);
  }

  let user = await User.findOne({ email: req.body.email });

  if (user) {
    return res.status(400).send("The email is invalid or already taken!");
  } else {
    let hashedPass;

    try {
      let salt = await bcrypt.genSalt(parseInt(BCRYPT_SALT_ROUNDS));
      hashedPass = await bcrypt.hash(req.body.password, salt);
    } catch (err) {
      return res.status(400).send(`Error! ${err}`);
    }

    user = new User({
      name: req.body.name,
      lastname: req.body.lastname,
      email: req.body.email,
      age: req.body.age,
      password: hashedPass,
    });

    await user.save();
    res.send(user);
  }
};

const updateUser = async (req, res) => {
  const validationErrors = validationResult(req).array();
  if (validationErrors.length > 0) {
    return res
      .status(400)
      .send(
        "At least 1 field is required (name, age, lastname, email, password)"
      );
  }
  const { name, email, age, lastname, password } = req.body;

  if (typeof email !== "undefined" && email.length > 0) {
    let user = await User.findOne({ email: email });

    if (user) {
      return res.status(400).send("The email is invalid or already taken!");
    }
  }

  let newPass = undefined;

  if (typeof password !== "undefined" && password.length > 0) {
    try {
      let salt = await bcrypt.genSalt(parseInt(BCRYPT_SALT_ROUNDS));
      newPass = await bcrypt.hash(password, salt);
    } catch (err) {
      return res.status(400).send(`Error! ${err}`);
    }
  }

  User.findByIdAndUpdate(
    req.params.id,
    { name, email, age, lastname, password: newPass },
    { omitUndefined: true }
  )
    .then(() => {
      return res.send(`User updated succesfully!`);
    })
    .catch((err) => {
      return res.status(400).send(`Update failed with error: ${err}`);
    });
};

const deleteUser = async (req, res) => {
  User.deleteOne({ _id: req.params.id })
    .then(() => {
      return res.send(`User deleted.`);
    })
    .catch((err) => {
      return res.status(400).send(`Delete failed with error: ${err}`);
    });
};

const findUser = async (req, res) => {
  const { name, email, lastname, age } = req.query;
  let filters = [];

  if (name) filters.push({ name: { $regex: name } });
  if (email) filters.push({ email: { $regex: email } });
  if (lastname) filters.push({ lastname: { $regex: lastname } });
  if (age) filters.push({ age: age });

  let query = {};
  if (filters.length > 0) {
    query = { $and: filters };
  }

  User.find(query)
    .then((result) => {
      return res.send(result);
    })
    .catch((err) => {
      return res.status(400).send(`Find user failed with error: ${err}`);
    });
};

const loginUser = async (req, res) => {
  const validationErrors = validationResult(req).array();
  if (validationErrors.length > 0) {
    return res.status(400).send(validationErrors);
  }

  User.findOne({ email: req.body.email })
    .then(async (user) => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }

      const match = await bcrypt.compare(req.body.password, user.password);

      if (!match) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }

      // Auth successful
      const token = jwt.sign(
        {
          email: user.email,
          userId: user._id,
        },
        JWT_KEY
      );

      return res.status(200).send({
        message: "Auth successful",
        token: token,
      });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  findUser,
  loginUser,
};
