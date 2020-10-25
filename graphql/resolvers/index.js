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
      return await users.createUser(args);
    },

    deleteUser: async (root, { id }, { authScope }) => {
      if (authScope === null || id != authScope._id) {
        throw new Error("You cannot delete this user account!");
      }

      users
        .deleteUser(id)
        .then(() => {
          return "User deleted succesfully!";
        })
        .catch((err) => {
          return `Delete failed with error: ${err}`;
        });
    },

    updateUser: async (root, args, { authScope }) => {
      if (authScope === null || args.id != authScope._id) {
        throw new Error("You cannot delete this user account!");
      }

      let user = await users.updateUser(args);

      return user;
    },
  },
};

module.exports = Resolvers;
