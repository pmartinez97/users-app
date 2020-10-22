// Dependencies
const express = require("express");
const router = require("./routes/index");
const isAuth = require("./middleware/is-auth");
const app = express();
require("dotenv").config();

// Apollo dependencies
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

// Environment vars
const port = process.env.PORT || 4000;

// Database connection
require("./database");

// Middleware
app.use(isAuth);

// Routes
app.use(express.json());
app.use("/", router);

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });

app.listen(port, () => console.log(`Listening on port ${port}...`));
