const {
  isAny,
  isAdmin,
} = require('../../../permissions/predicates');

module.exports = {
  Query: {
    GetAllTrovera: isAny,
  },

  Mutation: {
    createTrovera: isAny,
    editTrovera: isAny,
    deleteTrovera: isAny,
  },
};
