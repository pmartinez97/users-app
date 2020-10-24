const { User } = require("../../models/User");
const { UserInputError } = require("apollo-server-express");
const mongoose = require("mongoose");
const { users } = require("../../utils/");

const Resolvers = {
  Query: {
    users: async (root, args) => {
      return await users.findUsers(args);
    },

    user: async (root, { id }) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new UserInputError(`${id} is not a valid user ID.`);
      }

      return User.findById(id);
    },

    login: async (root, { email, password }) => {
      const token = await users.loginUser({ email, password });

      return {
        token: token,
        message: "Logged in successfully",
      };
    },
  },

  Mutation: {
    create: async (root, args) => {
      console.log(args);
      return await users.createUser(args);
    },
  },
};

module.exports = Resolvers;
