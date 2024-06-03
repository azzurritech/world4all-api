const { gql } = require('apollo-server');

const types = gql`
  input MarkOrUnmarkEstablishmentAsFavoriteInput {
    establishmentId: Int!
  }

  type FavoriteResult {
    success: Boolean!
		establishmentId: Int!
  }

  input FavoriteListInput {
    # TODO: add some filters if you need
    limit: Int!
    offset: Int!
  }
`;

const api = gql`
  type Mutation {
    markAsFavorite(establishmentId: Int!): FavoriteResult!
    unmarkFavorite(establishmentId: Int!): FavoriteResult!
  }

  type Query {
    favoritesList(favoriteListInput: FavoriteListInput!): [Establishment!]!
  }
`;

module.exports = { types, api };
