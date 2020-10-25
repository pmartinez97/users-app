const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    id: ID
    email: String
    name: String
    lastname: String
    password: String
    age: Int
  }

  type UserAuth {
    message: String
    token: String
  }

  type Query {
    users(name: String, lastname: String, age: Int, email: String): [User!]!
    user(id: ID!): User
    login(email: String!, password: String!): UserAuth
  }

  type Mutation {
    create(
      name: String
      lastname: String
      age: Int
      email: String!
      password: String!
    ): User
    deleteUser(id: ID!): String
    updateUser(
      id: ID!
      name: String
      age: Int
      email: String
      password: String
    ): User
  }
`;

module.exports = typeDefs;
