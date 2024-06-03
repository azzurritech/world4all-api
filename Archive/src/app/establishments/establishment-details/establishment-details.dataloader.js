const DataLoader = require('dataloader');
const _ = require('lodash');

const establishmentDetailsQueries = require('./establishment-details.queries');
const { mapEstablishmentDetailsDbRowToEstablishmentDetailsType } = require('./establishment-details.utils');

const createEstablishmentDetailsDataLoader = (knex) => new DataLoader(
  async (establishmentIds) => {
    const establishmentDetails = await establishmentDetailsQueries
      .findAllWithPicturesByEstablishmentIds(
        knex,
        establishmentIds,
      );

    const groupedDetails = _.groupBy(establishmentDetails, 'establishmentId');

    return establishmentIds
      .map((establishmentId) => {
        if (groupedDetails[establishmentId]) {
          // TODO: прочекать на кейсе, когда к одному заведению привязано много деталей
          // По идее здесь нужно промапать вначале groupedDetails[establishmentId]
          return mapEstablishmentDetailsDbRowToEstablishmentDetailsType(
            groupedDetails[establishmentId],
          );
        }
        return [];
      });
  }, { cache: false },
);

module.exports = { createEstablishmentDetailsDataLoader };
