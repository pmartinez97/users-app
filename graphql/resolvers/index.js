const { User } = require("../../models/User");
const { UserInputError } = require("apollo-server-express");
const mongoose = require("mongoose");
const checkAuth = require("../../middleware/checkAuth");

const Resolvers = {
  Query: {
    users: () => User.find(),
    user: (root, { id }, { req }, info) => {
      // TODO AUTH
      console.log(checkAuth(req));

      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new UserInputError(`${id} is not a valid user ID.`);
      }

      return User.findById(id);
    },
  },
};

module.exports = Resolvers;
