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

const api = gql`
  type Mutation {
    createaddress(name: String!): SuccessResult!
  }

  type Query {
    establishmentaddress: [EstablishmentAddress!]!
  }
`;

module.exports = { types };
