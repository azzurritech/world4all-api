const DataLoader = require('dataloader');
const _ = require('lodash');

const disabilitiesToUsersQueries = require('./disabilities-to-users.queries');
const disabilitiesToEstablishmentsQueries = require('./disabilities-to-establishments.queries');

const createUserDisabilityLoader = (knex) => new DataLoader(
  async (userIds) => {
    const disabilities = await disabilitiesToUsersQueries.findDisabilitiesWithUsers(knex, userIds);

    const groupedDisabilities = _.groupBy(disabilities, 'userId');

    return userIds.map((userId) => groupedDisabilities[userId] || []);
  },
  { cache: false },
);

const createEstablishmentDisabilityLoader = (knex) => new DataLoader(
  async (establishmentIds) => {
    const disabilities = await disabilitiesToEstablishmentsQueries
      .findDisabilitiesWithEstablishments(knex, establishmentIds);

    const groupedDisabilities = _.groupBy(disabilities, 'establishmentId');

    return establishmentIds.map((establishmentId) => groupedDisabilities[establishmentId] || []);
  },
  { cache: false },
);

module.exports = {
  createUserDisabilityLoader,
  createEstablishmentDisabilityLoader,
};
