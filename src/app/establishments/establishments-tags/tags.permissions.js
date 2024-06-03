const {
  isAny,
  isAdmin,
} = require('../../../permissions/predicates');

module.exports = {
  Query: {
    GetAllTagsAndFields: isAny,
  },

  Mutation: {
    createTag: isAny,
    editTagEstablishment: isAny,
    deleteTag: isAny,
  },
};
