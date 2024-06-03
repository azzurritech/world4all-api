const DataLoader = require('dataloader');
const _ = require('lodash');

const favoritesQueries = require('./favorites.queries');
const { mapEstablishmentDbRowToEstablishmentType } = require('../establishments/establishment.utils');

const createFavoriteLoader = (knex) => new DataLoader(
  async (keys) => {
    const { userId } = keys[0];

    const establishmentIds = keys.map((key) => key.establishmentId);

    const favorites = await favoritesQueries
      .findAllByUserIdAndEstablishmentId(knex, userId, establishmentIds);

    const favoritesSet = new Set(favorites.map((favorite) => favorite.establishmentId));

    return keys.map(({ establishmentId }) => favoritesSet.has(establishmentId));
  },
  { cache: false },
);

const createFavoriteEstablishmentLoader = (knex) => new DataLoader(
  async (userIds) => {
    const userFavorites = await favoritesQueries.findAllByUserIds(
      knex,
      userIds,
    );

    const groupedFavorites = _.groupBy(userFavorites, 'userId');

    return userIds
      .map((userId) => {
        if (groupedFavorites[userId]) {
          return groupedFavorites[userId]
            .map((favorite) => mapEstablishmentDbRowToEstablishmentType(favorite));
        }

        return [];
      });
  },
  { cache: false },
);

module.exports = {
  createFavoriteLoader,
  createFavoriteEstablishmentLoader,
};
