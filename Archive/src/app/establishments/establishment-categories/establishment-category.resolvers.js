const { ApolloError } = require('apollo-server-errors');

const { schemaValidation } = require('../../../common/schema-validation');
const { NOT_FOUND } = require('../../../common/errors');
const establishmentCategoryQueries = require('./establishment-category.queries');
const {
  createCategorySchema,
  editCategorySchema,
} = require('./establishment-category.validators');

const resolvers = {
  Query: {
    async establishmentCategories(parent, args, { knex }) {
      const establishmentCategories = await establishmentCategoryQueries.findAllActive(knex);

      return establishmentCategories;
    },
  },

  Mutation: {
    async createCategory(parent, { name }, { knex }) {
      const validatedArgs = schemaValidation(createCategorySchema, { name });

      await establishmentCategoryQueries.insert(knex, validatedArgs.name);

      return { success: true };
    },

    async editCategory(parent, { editCategoryInput }, { knex }) {
      const validatedArgs = schemaValidation(editCategorySchema, editCategoryInput);
      const currentDisability = await establishmentCategoryQueries
        .findOneById(knex, validatedArgs.id);

      if (!currentDisability) {
        throw new ApolloError(
          'category not found',
          NOT_FOUND.code,
        );
      }

      await establishmentCategoryQueries.update(
        knex,
        editCategoryInput.id,
        validatedArgs,
      );

      const updatedFacility = await establishmentCategoryQueries.findOneById(
        knex, editCategoryInput.id,
      );

      return updatedFacility;
    },

    async disableCategory(parent, { categoryId }, { knex }) {
      await establishmentCategoryQueries.disable(knex, categoryId);

      return { success: true };
    },
  },
};

module.exports = { resolvers };
