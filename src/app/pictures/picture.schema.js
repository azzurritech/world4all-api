const { gql } = require('apollo-server');

const types = gql`
  scalar Upload

  type Image {
    id: Int!
    url: String!
    title: String
    description: String
  }
  
  type uploadPicture {
    uploadPicture: [Image!]!
  }
  
  type PictureType {
    id: Int!
    url: String!
    title: String
    description: String
  }
`;

const api = gql`
  type Mutation {
    uploadPicture(picture: [Upload!]!): uploadPicture!
    deletePicture(pictureId: Int!): SuccessResult!
  }

  type Query {
    _empty: Int
  }
`;

module.exports = { types, api };
