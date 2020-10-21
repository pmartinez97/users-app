const mongoose = require("mongoose");
const { Schema } = mongoose;

const SchemaUser = new Schema({
  name: String,
  lastname: String,
  age: Number,
  email: String,
  password: String,
});

const User = mongoose.model("User", SchemaUser);

exports.User = User;
