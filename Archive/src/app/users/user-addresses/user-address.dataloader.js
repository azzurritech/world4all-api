const DataLoader = require('dataloader');

const userAddressQueries = require('./user-address.queries');
const { mapUserAddressDbRowToUserType } = require('./user-address.utils');

const createUserAddressDataLoader = (knex) => new DataLoader(
  async (userIds) => {
    const userAddresses = await userAddressQueries.findByUserIds(knex, userIds);

    const userAddressMap = new Map();
    userAddresses.forEach((userAddress) => {
      userAddressMap.set(userAddress.userId, userAddress);
    });

    const sortedInIdsOrder = userIds.map((userId) => userAddressMap.get(userId));

    return sortedInIdsOrder.map(mapUserAddressDbRowToUserType);
  }, { cache: false },
);

module.exports = { createUserAddressDataLoader };
