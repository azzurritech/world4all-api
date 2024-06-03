const { gql } = require('apollo-server');

const types = gql`
  type EstablishmentTypology {
    id: Int!
    name: String!
    categoryId: Int!
    isDisabled: Boolean!
  }

  input EditTypologyInput {
    id: Int!
    name: String
    categoryId: Int
    isDisabled: Boolean
  }

  input CreateTypologyInput {
    categoryId: Int!
    name: String!
  }
  
  input GetTypologyInput {
    categoryIds: [Int!]
  }
`;

const api = gql`
  type Mutation {
    createTypology(createTypologyInput: CreateTypologyInput!): SuccessResult!

    editTypology(editTypologyInput: EditTypologyInput!): EstablishmentTypology!

    disableTypology(typologyId: Int!): SuccessResult!
  }

  type Query {
    establishmentTypologies(getTypologyInput: GetTypologyInput): [EstablishmentTypology!]!
  }
`;

module.exports = { types, api };
