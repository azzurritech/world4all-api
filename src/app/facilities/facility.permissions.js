const {
  isAny,
  isAdmin,
} = require('../../permissions/predicates');

module.exports = {
  Query: {
    facilities: isAny,
  },
  Mutation: {
    createFacility: isAdmin,
    editFacility: isAdmin,
    disableFacility: isAdmin,
  },
};
