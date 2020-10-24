const { User } = require("../models/User");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const { auth, users } = require("../utils/");

require("dotenv").config();

// Environment vars
const BCRYPT_SALT_ROUNDS = process.env.BCRYP_ROUNDS;

const createUser = async (req, res) => {
  const validationErrors = validationResult(req).array();
  if (validationErrors.length > 0) {
    return res.status(400).send(validationErrors);
  }

  users
    .createUser({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      lastname: req.body.lastname,
      age: req.body.age,
    })
    .then((usr) => {
      res.send(usr);
    })
    .catch((err) => {
      return res
        .status(400)
        .send({
          message: "The email is invalid or already taken!",
          error: err,
        });
    });
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
      return res.status(400).send(`Error! ${err.message}`);
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
      return res.status(400).send(`Update failed with error: ${err.message}`);
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

  users
    .findUsers({ name, email, lastname, age })
    .then((users) => res.send(users))
    .catch((err) =>
      res.status(400).send(`Find user failed with error: ${err.message}`)
    );
};

const loginUser = async (req, res) => {
  const validationErrors = validationResult(req).array();
  if (validationErrors.length > 0) {
    return res.status(400).send(validationErrors);
  }

  users
    .loginUser({ email: req.body.email, password: req.body.password })
    .then((token) => {
      return res.status(200).send({
        message: "Auth successful",
        token: token,
      });
    })
    .catch((err) => {
      return res.status(500).send({ message: "error", error: err.message });
    });
};

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  findUser,
  loginUser,
};
