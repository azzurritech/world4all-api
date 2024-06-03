const { gql } = require('apollo-server');

const types = gql`
  type EstablishmentAddress {
    id: Int!
    country: String!
    city: String!
    street: String!
    buildingNumber: String!
    apartment: String
    lat: Float
    lng: Float
  }
`;

module.exports = { types };
