// Dependencies
const express = require("express");
const router = require("./routes/index");
const isAuth = require("./middleware/is-auth");
const { auth } = require("./utils/");
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

// Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    return error.message;
  },
  context: async ({ req, connection }) => {
    if (connection) {
      // check connection for metadata
      return connection.context;
    } else {
      // get the user id from the headers
      const userId = req.userId || "";

      // try to retrieve a user with the token
      const user = userId ? await auth.getUser(userId) : null;

      // add the user to the context
      return { authScope: user };
    }
  },
});

server.applyMiddleware({ app });

app.listen(port, () => console.log(`Listening on port ${port}...`));
