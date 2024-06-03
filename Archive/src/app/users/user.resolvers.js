const datesResolver = require('graphql-iso-date');
const { ApolloError } = require('apollo-server-errors');
const userQueries = require('./user.queries');
const userAddressQueries = require('./user-addresses/user-address.queries');
const disabilitiesToUsersQueries = require('../disabilities/disabilities-to-users.queries');
const facilitiesToUsersQueries = require('../facilities/facilities-to-users.queries');
const favoritesQueries = require('../favorites/favorites.queries');
const pictureQueries = require('../pictures/picture.queries');
const { mapUserDbRowToUserType } = require('./user.utils');
const { schemaValidation } = require('../../common/schema-validation');
const {
	usersListSchema,
	editUserSchema,
	editUserByAdminSchema,
} = require('./user.validators');
const { NOT_FOUND } = require('../../common/errors');

const typeResolvers = {
	User: {
		address: (user, _, { dataloaders }) => {
			const { userAddresses } = dataloaders;

			return userAddresses.load(user.id);
		},

		disabilities: (user, _, { dataloaders }) => {
			const { userDisabilities } = dataloaders;

			return userDisabilities.load(user.id);
		},

		facilities: (user, _, { dataloaders }) => {
			const { userFacilities } = dataloaders;

			return userFacilities.load(user.id);
		},
	},

	UserDataForAdmin: {
		address: (user, _, { dataloaders }) => {
			const { userAddresses } = dataloaders;

			return userAddresses.load(user.id);
		},

		disabilities: (user, _, { dataloaders }) => {
			const { userDisabilities } = dataloaders;

			return userDisabilities.load(user.id);
		},

		facilities: (user, _, { dataloaders }) => {
			const { userFacilities } = dataloaders;

			return userFacilities.load(user.id);
		},

		favoriteList: (user, _, { dataloaders }) => {
			const { favoriteList } = dataloaders;

			return favoriteList.load(user.id);
		},
	},
};

const resolvers = {
	...datesResolver,
	...typeResolvers,
	Query: {
		async me(parent, args, { knex, user }) {
			const me = await userQueries.findUserWithAvatar(knex, user.userId);
			if (!me) {
				throw new ApolloError(
					'user not found',
					NOT_FOUND.code,
				);
			}

			return mapUserDbRowToUserType(me);
		},

		async getUser(parent, { userId }, { knex }) {
			const currentUser = await userQueries.findById(knex, userId);
			if (!currentUser) {
				throw new ApolloError(
					'user not found',
					NOT_FOUND.code,
				);
			}

			return mapUserDbRowToUserType(currentUser);
		},

		async activeUsersList(parent, { activeUsersListInput }, { knex }) {
			const validatedArgs = schemaValidation(usersListSchema, activeUsersListInput);

			const activeUsers = await userQueries.getActives(
				knex, validatedArgs.limit, validatedArgs.offset,
			);

			return activeUsers.map((activeUser) => {
				if (!activeUser) {
					throw new ApolloError(
						'active user not found',
						NOT_FOUND.code,
					);
				}

				return mapUserDbRowToUserType(activeUser);
			});
		},

		async allUsers(parent, { usersListInput }, { knex }) {
			const validatedArgs = schemaValidation(usersListSchema, usersListInput);

			const allUsers = await userQueries.findAll(
				knex, validatedArgs.limit, validatedArgs.offset,
			);

			return allUsers.map((user) => {
				if (!user) {
					throw new ApolloError(
						'user not found',
						NOT_FOUND.code,
					);
				}

				return mapUserDbRowToUserType(user);
			});
		},
	},

	Mutation: {
		async editUser(parent, { editUserInput }, { knex, user }) {
			const validatedArgs = schemaValidation(editUserSchema, editUserInput);

			const {
				address,
				disabilityIds,
				facilityIds,
				...userFields
			} = validatedArgs;

			const currentUser = await userQueries.findById(knex, user.userId);

			if (!currentUser) {
				throw new ApolloError(
					'user not found',
					NOT_FOUND.code,
				);
			}

			if (address) {
				const currentAddress = await userAddressQueries.findByUserId(knex, currentUser.id);

				if (!currentAddress) {
					throw new ApolloError(
						'user address not found',
						NOT_FOUND.code,
					);
				}

				await userAddressQueries.update(knex, currentUser.id, currentAddress.id, address);
			}

			if (disabilityIds) {
				await disabilitiesToUsersQueries.deleteDisabilitiesOfUser(knex, currentUser.id);
				await disabilitiesToUsersQueries.insert(knex, currentUser.id, disabilityIds);
			}

			if (facilityIds) {
				await facilitiesToUsersQueries.deleteFacilitiesOfUser(knex, currentUser.id);
				await facilitiesToUsersQueries.insert(knex, currentUser.id, facilityIds);
			}

			if (userFields.avatarId) {
				const picture = await pictureQueries.findById(knex, userFields.avatarId);

				if (!picture) {
					throw new ApolloError(
						'avatar picture not found',
						NOT_FOUND.code,
					);
				}
			}

			if (userFields && Object.keys(userFields).length > 0) {
				await userQueries.update(knex, currentUser.id, userFields);
			}

			const updatedUser = await userQueries.findUserWithAvatar(knex, user.userId);

			if (!updatedUser) {
				throw new ApolloError(
					'active user not found',
					NOT_FOUND.code,
				);
			}

			return mapUserDbRowToUserType(updatedUser);
		},

		async editUserByAdmin(parent, { editUserByAdminInput }, { knex }) {
			const validatedArgs = schemaValidation(editUserByAdminSchema, editUserByAdminInput);

			const {
				address,
				disabilityIds,
				facilityIds,
				...userFields
			} = validatedArgs;

			const currentUser = await userQueries.findById(knex, editUserByAdminInput.userId);

			if (!currentUser) {
				throw new ApolloError(
					'user not found',
					NOT_FOUND.code,
				);
			}

			if (address) {
				const currentAddress = await userAddressQueries.findByUserId(knex, currentUser.id);

				if (!currentAddress) {
					throw new ApolloError(
						'user address not found',
						NOT_FOUND.code,
					);
				}

				await userAddressQueries.update(knex, currentUser.id, currentAddress.id, address);
			}

			if (disabilityIds) {
				await disabilitiesToUsersQueries.deleteDisabilitiesOfUser(knex, currentUser.id);
				await disabilitiesToUsersQueries.insert(knex, currentUser.id, disabilityIds);
			}

			if (facilityIds) {
				await facilitiesToUsersQueries.deleteFacilitiesOfUser(knex, currentUser.id);
				await facilitiesToUsersQueries.insert(knex, currentUser.id, facilityIds);
			}

			if (userFields.avatarId) {
				const picture = await pictureQueries.findById(knex, userFields.avatarId);

				if (!picture) {
					throw new ApolloError(
						'avatar picture not found',
						NOT_FOUND.code,
					);
				}
			}

			if (userFields && Object.keys(userFields).length > 0) {
				await userQueries.update(knex, currentUser.id, userFields);
			}

			const updatedUser = await userQueries.findUserWithAvatar(knex, editUserByAdminInput.userId);

			if (!updatedUser) {
				throw new ApolloError(
					'active user not found',
					NOT_FOUND.code,
				);
			}

			return mapUserDbRowToUserType(updatedUser);
		},

		// Now you can deactivate user using edit mutation for admin
		async deactivateUser(parent, { userId }, { knex }) {
			const currentUser = await userQueries.findById(knex, userId);

			if (!currentUser) {
				throw new ApolloError(
					'user not found',
					NOT_FOUND.code,
				);
			}

			await userQueries.markIsNotActive(knex, userId);

			return { success: true };
		},

		async disableUser(parent, { userId }, { knex }) {
			const currentUser = await userQueries.findById(knex, userId);

			if (!currentUser) {
				throw new ApolloError(
					'user not found',
					NOT_FOUND.code,
				);
			}

			await userQueries.disableUser(knex, userId);

			return { success: true };
		},

		async deleteUser(parent, { userId }, { knex }) {
			const currentUser = await userQueries.findById(
				knex, userId,
			);

			if (!currentUser) {
				throw new ApolloError(
					'user not found',
					NOT_FOUND.code,
				);
			}

			await knex.transaction(async (trx) => {
				await Promise.all([
					userAddressQueries.deleteAddress(
						trx, userId,
					),
					disabilitiesToUsersQueries.deleteDisabilitiesOfUser(trx, userId),
					facilitiesToUsersQueries.deleteFacilitiesOfUser(trx, userId),
					favoritesQueries.deleteFavoritesByUser(trx, userId)
				]);

				await userQueries.deleteUser(trx, userId);
			});

			return { success: true };
		},
	},
};

module.exports = {
	typeResolvers,
	resolvers,
};
