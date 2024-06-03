const DataLoader = require('dataloader');

const establishmentAddressQueries = require('./establishment-address.queries');

const createEstablishmentAddressDataLoader = (knex) => new DataLoader(
  async (establishmentIds) => {
    const establishmentAddresses = await establishmentAddressQueries.findByIds(
      knex,
      establishmentIds,
    );

    const establishmentAddressMap = new Map();
    establishmentAddresses.forEach((establishmentAddress) => establishmentAddressMap.set(
      establishmentAddress.establishmentId,
      establishmentAddress,
    ));

    const sortedInIdsOrder = establishmentIds
      .map((establishmentId) => establishmentAddressMap.get(establishmentId));

    return sortedInIdsOrder;
  }, { cache: false },
);

module.exports = { createEstablishmentAddressDataLoader };
