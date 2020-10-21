const userController = require("../controller/users");
const checkAuth = require("../utils/checkAuth");
const { check, oneOf } = require("express-validator");
const express = require("express");
const router = express.Router();

// login
router.post(
  "/users/login",
  [
    check("email").exists().isEmail().withMessage("email field is required"),
    check("password")
      .exists()
      .isString()
      .withMessage("password field is required"),
  ],
  userController.loginUser
);

// create user
router.post(
  "/users/create",
  [
    check("name").exists().isString().withMessage("name field is required"),
    check("password")
      .exists()
      .isString()
      .withMessage("password field is required"),
    check("email").exists().withMessage("email field is required").isEmail(),
  ],
  userController.createUser
);

// update user
router.put(
  "/users/update/:id",
  checkAuth,
  oneOf([
    check("name").exists().isString(),
    check("password").exists().isString(),
    check("email").exists().isEmail(),
    check("age").exists().isInt(),
    check("lastname").exists().isString(),
  ]),
  userController.updateUser
);

// delete user
router.delete("/users/delete/:id", checkAuth, userController.deleteUser);

// list users
router.get("/users/userlist", userController.findUser);

module.exports = router;
