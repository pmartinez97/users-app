// Test dependencies
const request = require("supertest");

// app dependencies
const express = require("express");
const router = require("./routes/index");
const isAuth = require("./middleware/is-auth");
const app = express();

// Database connection
const mongoose = require("./database");

// Middleware
app.use(isAuth);

// Routes
app.use(express.json());
app.use("/", router);

const testUser = {
  email: "test@test.com",
  password: "hi",
  name: "test",
};

beforeAll(async (done) => {
  done();
});

test("Create test user", async () => {
  await request(app).post("/users/create").send(testUser).expect(200);
});

test("Sign up as test user", async () => {
  await request(app).post("/users/login").send(testUser).expect(200);
});

afterAll((done) => {
  // Closing the DB connection allows Jest to exit successfully.
  mongoose.connection.close();
  done();
});
