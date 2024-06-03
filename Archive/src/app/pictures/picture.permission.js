const {
  isAuthenticated,
} = require('../../permissions/predicates');

module.exports = {
  Mutation: {
    uploadPicture: isAuthenticated,
    deletePicture: isAuthenticated,
  },
  Query: {},
};
