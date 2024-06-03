const { isAuthenticated } = require('../../permissions/predicates');

module.exports = {
  Mutation: {
    markAsFavorite: isAuthenticated,
    unmarkFavorite: isAuthenticated,
  },
  Query: {
    // Add it if you need
    // favorite: isAuthenticated,
    favoritesList: isAuthenticated,
  },
};
