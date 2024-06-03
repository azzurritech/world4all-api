const { ApolloError } = require('apollo-server-errors');

const disabilityQueries = require('./disability.queries');
const {
  createDisabilitySchema,
  editDisabilitySchema,
} = require('./disability.validators');
const { schemaValidation } = require('../../common/schema-validation');
const { NOT_FOUND } = require('../../common/errors');

const resolvers = {
  Query: {
    async disabilities(parent, args, { knex }) {
      const disabilities = await disabilityQueries.findAllActive(knex);

      return disabilities;
    },
  },

  Mutation: {
    async createDisability(parent, { name }, { knex }) {
      const validatedArgs = schemaValidation(createDisabilitySchema, { name });

      await disabilityQueries.insert(knex, validatedArgs.name);

      return { success: true };
    },

    async editDisability(parent, { editDisabilityInput }, { knex }) {
      const validatedArgs = schemaValidation(editDisabilitySchema, editDisabilityInput);

      const currentDisability = await disabilityQueries.findOneById(knex, validatedArgs.id);

      if (!currentDisability) {
        throw new ApolloError(
          'disability not found',
          NOT_FOUND.code,
        );
      }

      await disabilityQueries.update(
        knex,
        editDisabilityInput.id,
        validatedArgs,
      );

      const updatedDisability = await disabilityQueries.findOneById(knex, editDisabilityInput.id);

      return updatedDisability;
    },

    async disableDisability(parent, { disabilityId }, { knex }) {
      await disabilityQueries.disable(knex, disabilityId);

      return { success: true };
    },
  },
};

module.exports = { resolvers };
