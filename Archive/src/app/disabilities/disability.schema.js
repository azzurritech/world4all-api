const { gql } = require('apollo-server');

const types = gql`
  type Disability {
    id: Int!
    name: String!
    isDisabled: Boolean!
    url: String
  }

  input EditDisabilityInput {
    id: Int!
    name: String
    isDisabled: Boolean
    image_id: Int
  }
`;

const api = gql`
  type Mutation {
    createDisability(name: String!): SuccessResult!

    editDisability(editDisabilityInput: EditDisabilityInput!): Disability!

    disableDisability(disabilityId: Int!): SuccessResult!
  }

  type Query {
    disabilities: [Disability!]!
  }
`;

module.exports = { types, api };
