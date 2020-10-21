const mongoose = require("mongoose");
require("dotenv").config();

const DB_URI = process.env.DB_URI;

mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Now connected to Database MongoDB"))
  .catch((err) => console.log(err));

module.exports = mongoose;
