const { isAdmin } = require('../../../permissions/predicates');

module.exports = {
  Mutation: {
    addEstablishmentDetails: isAdmin,
    dropEstablishmentDetail: isAdmin,
  },
  Query: {
    establishmentDetails: isAdmin,
  },
};
