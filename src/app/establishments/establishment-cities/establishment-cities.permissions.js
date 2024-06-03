const {
  isAny,
  isAdmin,
} = require('../../../permissions/predicates');

module.exports = {
  Query: {
    establishmentCities: isAny,
  },

  // Mutation: {
  //   createCategory: isAdmin,
  //   editCategory: isAdmin,
  //   disableCategory: isAdmin,
  // },
};
