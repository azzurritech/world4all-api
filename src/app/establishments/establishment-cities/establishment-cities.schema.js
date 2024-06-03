const { gql } = require('apollo-server');

const types = gql`
  type EstablishmentCities {
    lat: Float
    lng: Float
  }

  input EditCitiesInput {
    lat: Float
    lng: Float
  }
`;

const api = gql`
  type Mutation {
    createCities(name: String!): SuccessResult!
  }

  type Query {
    establishmentCities(city: String!): [EstablishmentCities!]!
  }
`;

module.exports = { types, api };
