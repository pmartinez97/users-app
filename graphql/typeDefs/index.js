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

  type UserConnection {
    count: Int
    users: [User]
  }

  type Mutation {
    create(
      name: String
      lastname: String
      age: Int
      email: String!
      password: String!
    ): User
    deleteUser(id: Int!): UserConnection
    updateUser(id: Int!, name: String!): User
  }
`;

module.exports = typeDefs;
