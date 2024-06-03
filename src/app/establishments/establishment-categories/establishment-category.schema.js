const { gql } = require('apollo-server');

const types = gql`
  type EstablishmentCategory {
    id: Int!
    name: String!
    isDisabled: Boolean!
    url: String
  }

  input EditCategoryInput {
    id: Int!
    name: String!
    isDisabled: Boolean
    image_id: Int
  }
`;

const api = gql`
  type Mutation {
    createCategory(name: String!): SuccessResult!

    editCategory(editCategoryInput: EditCategoryInput!): EstablishmentCategory!

    disableCategory(categoryId: Int!): SuccessResult!
  }

  type Query {
    establishmentCategories: [EstablishmentCategory!]!
  }
`;

module.exports = { types, api };
