const datesResolver = require('graphql-iso-date');
const { ApolloError } = require('apollo-server-errors');

const userQueries = require('../users/user.queries');
const establishmentQueries = require('../establishments/establishment.queries');
const favoritesQueries = require('./favorites.queries');

const { favoriteListSchema } = require('./favorites.validators');
const { schemaValidation } = require('../../common/schema-validation');
const { NOT_FOUND } = require('../../common/errors');
const { mapEstablishmentDbRowToEstablishmentType } = require('../establishments/establishment.utils');

const resolvers = {
	...datesResolver,
	Query: {
		// Add this query if you need
		// async favorite(parent, { establishmentId }, { knex }) {

		// },

		async favoritesList(parent, { favoriteListInput }, { knex, user }) {
			const validatedArgs = schemaValidation(favoriteListSchema, favoriteListInput);

			const favoritesList = await favoritesQueries.findAllByUserId(
				knex,
				user.userId,
				validatedArgs.limit, validatedArgs.offset,
			);

			return favoritesList.map((establishment) => {
				if (!establishment) {
					throw new ApolloError(
						'establishment not found',
						NOT_FOUND.code,
					);
				}

				return mapEstablishmentDbRowToEstablishmentType(establishment);
			});
		},
	},

	Mutation: {
		async markAsFavorite(parent, { establishmentId }, { knex, user }) {
			const currentUser = await userQueries.findById(knex, user.userId);

			if (!currentUser) {
				throw new ApolloError(
					'user not found',
					NOT_FOUND.code,
				);
			}

			const establishment = await establishmentQueries.findById(
				knex,
				establishmentId,
			);

			if (!establishment) {
				throw new ApolloError(
					'establishment not found',
					NOT_FOUND.code,
				);
			}

			await favoritesQueries.insert(knex, user.userId, establishmentId);

			return { success: true, establishmentId };
		},

		async unmarkFavorite(parent, { establishmentId }, { knex, user }) {
			await favoritesQueries.drop(knex, user.userId, establishmentId);

			return { success: true, establishmentId };
		},
	},
};

module.exports = { resolvers };
