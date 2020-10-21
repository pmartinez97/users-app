// Dependencies
const express = require("express");
const router = require("./routes/index");
const isAuth = require("./middleware/is-auth");
const app = express();
require("dotenv").config();

// Database connection
require("./database");

// Middleware
app.use(isAuth);

// Routes
app.use(express.json());
app.use("/", router);

// Environment vars
const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Listening on port ${port}...`));
