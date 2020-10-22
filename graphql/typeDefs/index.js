const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    users: [User!]!
    user(id: ID!): User
  }

  type User {
    id: ID!
    email: String!
    name: String!
    lastname: String
    password: String!
  }
`;

module.exports = typeDefs;
