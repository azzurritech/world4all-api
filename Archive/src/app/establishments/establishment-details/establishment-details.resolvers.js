const datesResolver = require('graphql-iso-date');
const { ApolloError } = require('apollo-server-errors');

const establishmentDetailsQueries = require('./establishment-details.queries');
const pictureQueries = require('../../pictures/picture.queries');
const { schemaValidation } = require('../../../common/schema-validation');
const { addEstablishmentDetailsSchema } = require('./establishment-details.validators');

const { NOT_FOUND } = require('../../../common/errors');

const resolvers = {
  ...datesResolver,
  Query: {
    async establishmentDetails(parent, { establishmentId }, { knex }) {
      const establishmentDetails = await establishmentDetailsQueries
        .findAllWithPicturesByEstablishmentId(
          knex, establishmentId,
        );

      return establishmentDetails;
    },
  },

  Mutation: {
    async addEstablishmentDetails(parent, { addDetailsInput }, { knex }) {
      const {
        establishmentId,
        details,
      } = addDetailsInput;
      const validatedDetails = schemaValidation(addEstablishmentDetailsSchema, details);
      if (details.imageId) {
        const currentPicture = await pictureQueries.findById(knex, details.imageId);

        // Здесь можно явно не падать - всё равно будет ошибка констрейнта
        if (!currentPicture) {
          throw new ApolloError(
            'establishment detail picture not found',
            NOT_FOUND.code,
          );
        }
      }

      await establishmentDetailsQueries.insert(knex, establishmentId, validatedDetails);

      return { success: true };
    },

    async dropEstablishmentDetail(parent, { dropDetailInput }, { knex }) {
      const {
        detailId,
        establishmentId,
      } = dropDetailInput;

      const detail = await establishmentDetailsQueries
        .findByDetailIdAndEstablishmentId(knex, detailId, establishmentId);

      if (!detail) {
        throw new ApolloError(
          'establishment detail not found',
          NOT_FOUND.code,
        );
      }

      await establishmentDetailsQueries.deleteOneDetail(knex, detailId, establishmentId);

      return { success: true };
    },
  },
};

module.exports = { resolvers };
