const { gql } = require('apollo-server');

const types = gql`
  type Facility {
    id: Int!
    name: String!
    isDisabled: Boolean!
    url: String
  }

  input EditFacilityInput {
    id: Int!
    name: String
    isDisabled: Boolean
    image_id: Int
  }
`;

const api = gql`
  type Mutation {
    createFacility(name: String!): SuccessResult!

    editFacility(editFacilityInput: EditFacilityInput!): Facility!

    disableFacility(facilityId: Int!): SuccessResult!
  }

  type Query {
    facilities: [Facility!]!
  }
`;

module.exports = { types, api };
