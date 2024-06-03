const {
  isAny,
  isAdmin,
} = require('../../permissions/predicates');

module.exports = {
  Query: {
    disabilities: isAny,
  },

  Mutation: {
    createDisability: isAdmin,
    editDisability: isAdmin,
    disableDisability: isAdmin,
  },
};
