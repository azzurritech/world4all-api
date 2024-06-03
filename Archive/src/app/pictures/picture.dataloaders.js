const DataLoader = require('dataloader');
const _ = require('lodash');

const picturesAndEstablishmentsQueries = require('./pictures-to-establishments.queries');

const createEstablishmentPictureLoader = (knex) => new DataLoader(
  async (establishmentsIds) => {
    const pictures = await picturesAndEstablishmentsQueries.findPicturesWithEstablishments(
      knex, establishmentsIds,
    );

    const groupedPictures = _.groupBy(pictures, 'establishmentId');

    return establishmentsIds.map((establishmentId) => groupedPictures[establishmentId] || []);
  },
  { cache: false },
);

module.exports = { createEstablishmentPictureLoader };
