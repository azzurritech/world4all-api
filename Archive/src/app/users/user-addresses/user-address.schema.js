const { gql } = require('apollo-server');

const types = gql`
  type UserAddress {
    id: Int!
    country: String!
    city: String!
    street: String!
    buildingNumber: String!
    apartment: String
  }
`;

module.exports = { types };
