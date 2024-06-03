const DataLoader = require('dataloader');
const _ = require('lodash');

const establishmentTypologiesToEstablishmentsQueries = require('./establishment-typologies-to-establishment.queries');
const establishmentCategoryQueries = require('../establishment-categories/establishment-category.queries');

const createEstablishmentTypologiesWithCategoriesLoader = (knex) => new DataLoader(
  async (establishmentIds) => {
    const typologiesWithEstablishments = await establishmentTypologiesToEstablishmentsQueries
      .findTypologiesWithEstablishments(knex, establishmentIds);

    // TODO: можно это сделать join'ом в БД
    const promises = typologiesWithEstablishments
      .map(async (typologiesWithEstablishment) => {
        const category = await establishmentCategoryQueries
          .findOneById(knex, typologiesWithEstablishment.categoryId);

        return {
          typologyId: typologiesWithEstablishment.id,
          name: typologiesWithEstablishment.name,
          establishmentId: typologiesWithEstablishment.establishmentId,
          isDisabled: typologiesWithEstablishment.isDisabled,
          category,
        };
      });

    const typologiesWithCategoryAndEstablishments = await Promise.all(promises);

    const groupedTypologiesAndCategories = _.groupBy(typologiesWithCategoryAndEstablishments, 'establishmentId');

    return establishmentIds
      .map((establishmentId) => groupedTypologiesAndCategories[establishmentId] || []);
  },
  { cache: false },
);

module.exports = { createEstablishmentTypologiesWithCategoriesLoader };
