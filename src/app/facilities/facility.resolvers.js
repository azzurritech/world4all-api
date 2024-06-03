const { ApolloError } = require('apollo-server-errors');

const {
  createFacilitySchema,
  editFacilitySchema,
} = require('./facility.validators');
const { schemaValidation } = require('../../common/schema-validation');
const { NOT_FOUND } = require('../../common/errors');
const facilityQueries = require('./facility.queries');

const resolvers = {
  Query: {
    async facilities(parent, args, { knex }) {
      const facilities = await facilityQueries.findAllActive(knex);

      return facilities;
    },
  },

  Mutation: {
    async createFacility(parent, { name }, { knex }) {
      const validatedArgs = schemaValidation(createFacilitySchema, { name });

      await facilityQueries.insert(knex, validatedArgs.name);

      return { success: true };
    },

    async editFacility(parent, { editFacilityInput }, { knex }) {
      const validatedArgs = schemaValidation(editFacilitySchema, editFacilityInput);

      const currentFacility = await facilityQueries.findOneById(knex, validatedArgs.id);

      if (!currentFacility) {
        throw new ApolloError(
          'facility not found',
          NOT_FOUND.code,
        );
      }

      await facilityQueries.update(
        knex,
        editFacilityInput.id,
        validatedArgs,
      );

      const updatedFacility = await facilityQueries.findOneById(knex, editFacilityInput.id);

      return updatedFacility;
    },

    async disableFacility(parent, { facilityId }, { knex }) {
      await facilityQueries.disable(knex, facilityId);

      return { success: true };
    },
  },
};

module.exports = { resolvers };
