const DataLoader = require('dataloader');
const _ = require('lodash');

const facilitiesToUsersQueries = require('./facilities-to-users.queries');
const facilitiesToEstablishmentsQueries = require('./facilities-to-establishments.queries');

const createUserFacilityLoader = (knex) => new DataLoader(
  async (userIds) => {
    const facilities = await facilitiesToUsersQueries.findFacilitiesWithUsers(knex, userIds);

    const groupedFacilities = _.groupBy(facilities, 'userId');

    return userIds.map((userId) => groupedFacilities[userId] || []);
  },
  { cache: false },
);

const createEstablishmentFacilityLoader = (knex) => new DataLoader(
  async (establishmentIds) => {
    const facilities = await facilitiesToEstablishmentsQueries
      .findFacilitiesWithEstablishments(knex, establishmentIds);

    const groupedFacilities = _.groupBy(facilities, 'establishmentId');

    return establishmentIds.map((establishmentId) => groupedFacilities[establishmentId] || []);
  },
  { cache: false },
);

module.exports = {
  createUserFacilityLoader,
  createEstablishmentFacilityLoader,
};
