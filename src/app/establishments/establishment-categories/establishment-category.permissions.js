const {
  isAny,
  isAdmin,
} = require('../../../permissions/predicates');

module.exports = {
  Query: {
    establishmentCategories: isAny,
  },

  Mutation: {
    createCategory: isAdmin,
    editCategory: isAdmin,
    disableCategory: isAdmin,
  },
};
