const { ApolloError } = require('apollo-server-errors');

const { schemaValidation } = require('../../../common/schema-validation');
const { NOT_FOUND } = require('../../../common/errors');
const {
  createTypologySchema,
  editTypologySchema,
} = require('./establishment-typology.validators');
const establishmentTypologyQueries = require('./establishment-typology.queries');
const establishmentCategoryQueries = require('../establishment-categories/establishment-category.queries');

const resolvers = {
  Query: {
    async establishmentTypologies(parent, { getTypologyInput }, { knex }) {
      // eslint-disable-next-line max-len,no-return-await
      return await establishmentTypologyQueries.findAllActiveInTheCategories(knex, getTypologyInput);
    },
  },

  Mutation: {
    async createTypology(parent, { createTypologyInput }, { knex }) {
      const validatedArgs = schemaValidation(createTypologySchema, createTypologyInput);

      await establishmentTypologyQueries.insert(knex, validatedArgs);

      return { success: true };
    },

    async editTypology(parent, { editTypologyInput }, { knex }) {
      const validatedArgs = schemaValidation(editTypologySchema, editTypologyInput);

      const currentTypology = await establishmentTypologyQueries
        .findOneById(knex, validatedArgs.id);

      if (!currentTypology) {
        throw new ApolloError(
          'typology not found',
          NOT_FOUND.code,
        );
      }

      if (validatedArgs.categoryId) {
        const newCategory = await establishmentCategoryQueries.findOneById(
          knex, validatedArgs.categoryId,
        );

        if (!newCategory) {
          throw new ApolloError(
            'category not found',
            NOT_FOUND.code,
          );
        }
      }

      await establishmentTypologyQueries.update(
        knex,
        editTypologyInput.id,
        validatedArgs,
      );

      const updatedFacility = await establishmentTypologyQueries.findOneById(
        knex, editTypologyInput.id,
      );

      return updatedFacility;
    },

    async disableTypology(parent, { typologyId }, { knex }) {
      await establishmentTypologyQueries.disable(knex, typologyId);

      return { success: true };
    },
  },
};

module.exports = { resolvers };
