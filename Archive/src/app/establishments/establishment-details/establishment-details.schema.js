const { gql } = require('apollo-server');

const types = gql`
  enum DetailsCode {
    # Update it if you need
    ENTRATA
    WC
    ALTEZZA_TAVOLO
    LETTI
  }

  type Details {
    id: Int!
    code: DetailsCode!
    description: String
    title: String
    image: PictureType!
  }

  input DropDetailInput {
    establishmentId: Int!
    detailId: Int!
  }

  input AddDetails {
    code: DetailsCode!
    # Make it required if you need
    title: String
    description: String
    imageId: Int!
  }

  input AddDetailsInput {
    establishmentId: Int!
    details: [AddDetails!]!
  }
`;

const api = gql`
  type Mutation {
    addEstablishmentDetails(addDetailsInput: AddDetailsInput!): SuccessResult!
    dropEstablishmentDetail(dropDetailInput: DropDetailInput!): SuccessResult!
  }

  type Query {
    establishmentDetails(establishmentId: Int!): [Details!]!
  }

`;
module.exports = { types, api };
