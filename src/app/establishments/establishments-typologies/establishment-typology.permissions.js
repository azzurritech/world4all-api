const {
  isAny,
  isAdmin,
} = require('../../../permissions/predicates');

module.exports = {
  Query: {
    establishmentTypologies: isAny,
  },

  Mutation: {
    createTypology: isAdmin,
    editTypology: isAdmin,
    disableTypology: isAdmin,
  },
};
