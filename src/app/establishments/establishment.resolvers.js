const datesResolver = require('graphql-iso-date');
const { ApolloError } = require('apollo-server-errors');

const moment = require('moment');
const Joi = require('joi');
const { schemaValidation } = require('../../common/schema-validation');
const {
	createEstablishmentSchema,
	establishmentsListSchema,
	editEstablishmentSchema,
	establishmentSchema,
} = require('./establishment.validators');
const tagsQueries = require("./establishments-tags/tags.queries")
const establishmentQueries = require('./establishment.queries');
const establishmentAddressesQueries = require('./establishment-addresses/establishment-address.queries');
const disabilitiesToEstablishmentsQueries = require('../disabilities/disabilities-to-establishments.queries');
const facilitiesToEstablishmentsQueries = require('../facilities/facilities-to-establishments.queries');
const establishmentDetailsQueries = require('./establishment-details/establishment-details.queries');
const typologiesToEstablishmentsQueries = require('./establishments-typologies/establishment-typologies-to-establishment.queries');
const picturesToEstablishmentsQueries = require('../pictures/pictures-to-establishments.queries');
const pictureQueries = require('../pictures/picture.queries');
const addressQueries = require('./establishment-addresses/establishment-address.queries')
const { mapEstablishmentDbRowToEstablishmentType } = require('./establishment.utils');
const { NOT_FOUND } = require('../../common/errors');
const { mapEstablishmentAddressTypeToEstablishmentAddressDbRow } = require('./establishment-addresses/establishment-address.utils');
const { LATIN1_BIN } = require('mysql/lib/protocol/constants/charsets');
const { upperFirst } = require('lodash');

const typeResolvers = {
	Establishment: {
		address: (establishment, _, { dataloaders }) => {
			const { establishmentAddress } = dataloaders;

			return establishmentAddress.load(establishment.id);
		},

		details: (establishment, _, { dataloaders }) => {
			const { establishmentDetails } = dataloaders;

			return establishmentDetails.load(establishment.id);
		},

		disabilities: (establishment, _, { dataloaders }) => {
			const { establishmentDisabilities } = dataloaders;

			return establishmentDisabilities.load(establishment.id);
		},

		facilities: (establishment, _, { dataloaders }) => {
			const { establishmentFacilities } = dataloaders;

			return establishmentFacilities.load(establishment.id);
		},

		typologiesAndCategories: (establishment, _, { dataloaders }) => {
			const { establishmentTypologiesAndCategories } = dataloaders;

			return establishmentTypologiesAndCategories.load(establishment.id);
		},

		isFavorite: (establishment, _, { dataloaders, user }) => {
			const { isFavorite } = dataloaders;
			if (user && user.userId) {
				return isFavorite.load({
					userId: user.userId,
					establishmentId: establishment.id,
				});
			}
			return false;
		},

		gallery: (establishment, _, { dataloaders }) => {
			const { picture } = dataloaders;

			return picture.load(establishment.id);
		},
	},
};

const resolvers = {
	...datesResolver,
	...typeResolvers,
	Query: {
		async establishment(parent, { establishmentInput }, { knex }) {
			const validatedArgs = schemaValidation(establishmentSchema, establishmentInput);
			const establishment = await establishmentQueries.findEstablishmentWithCover(
				knex,
				validatedArgs.id,
			);

			if (!establishment) {
				throw new ApolloError(
					'establishment not found',
					NOT_FOUND.code,
				);
			}

			if (validatedArgs.lat && validatedArgs.lng) {
				establishment.distance = await establishmentQueries.findDistanceToEstablishment(
					knex,
					validatedArgs.id,
					validatedArgs.lat,
					validatedArgs.lng,
				);
			}
			return mapEstablishmentDbRowToEstablishmentType(establishment);
		},

		async establishmentsList(parent, { establishmentListInput }, { knex }) {
			const validatedArgs = schemaValidation(establishmentsListSchema, establishmentListInput);
			var establishments = await establishmentQueries.findAll(
				knex,
				validatedArgs.limit,
				validatedArgs.offset,
				validatedArgs.search,
				validatedArgs.typologyIds,
				validatedArgs.disabilityIds,
				validatedArgs.facilityIds,
				validatedArgs.order,
				validatedArgs.categoryIds,
				validatedArgs.tagIds,
			);

			if (establishmentListInput?.lat && establishmentListInput?.lng && establishmentListInput?.radius) {
				const KMTODEGREES = 111
				const [latFilter, lngFilter] = [establishmentListInput.lat, establishmentListInput.lng]
				const radiusToDegrees = establishmentListInput.radius / KMTODEGREES;

				establishments = establishments.filter(
					(est) => {
						try{
						const { lat, lng } = est
						const latDistance = Math.max(lat, latFilter) - Math.min(lat, latFilter)
						const lngDistance = Math.max(lng, lngFilter) - Math.min(lng, lngFilter)
						const deltaDistanceSqrt = Math.sqrt(latDistance ** 2 + lngDistance ** 2)
						if (deltaDistanceSqrt > radiusToDegrees) {
							return false
						}
						return true
						}catch(e){
							console.log(e)
							return false
						}
					}
				)
			}

			return establishments.map((establishment) => {
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
		async createEstablishment(parent, { establishmentInput }, { knex }) {
			const validatedArgs = schemaValidation(createEstablishmentSchema, establishmentInput);

			const {
				address,
				details,
				typologyIds,
				disabilityIds,
				facilityIds,
				...establishmentFields
			} = validatedArgs;
			let resId = 0;
			await knex.transaction(async (trx) => {
				await establishmentQueries.insert(trx, establishmentFields);

				const { id } = await establishmentQueries.findLastInserted(trx);
				resId = id;
				if (details) {
					if (details.imageId) {
						const currentPicture = await pictureQueries.findById(knex, details.imageId);

						if (!currentPicture) {
							throw new ApolloError(
								'detail picture not found',
								NOT_FOUND.code,
							);
						}
					}

					await establishmentDetailsQueries.insert(trx, id, details);
				}

				await Promise.all([
					establishmentAddressesQueries.insert(trx, {
						...address,
						establishment_id: id,
					}),
					typologiesToEstablishmentsQueries.insert(trx, id, typologyIds),
					disabilitiesToEstablishmentsQueries.insert(trx, id, disabilityIds),
					facilitiesToEstablishmentsQueries.insert(trx, id, facilityIds),
				]);
			});
			return { success: true, id: resId };
		},

		async editEstablishment(parent, { editEstablishmentInput }, { knex }) {
			const validatedArgs = schemaValidation(editEstablishmentSchema, editEstablishmentInput);

			const {
				address,
				details,
				disabilityIds,
				facilityIds,
				typologyIds,
				pictureIds,
				...establishmentFields
			} = validatedArgs;

			const currentEstablishment = await establishmentQueries.findById(
				knex, establishmentFields.id,
			);

			if (!currentEstablishment) {
				throw new ApolloError(
					'establishment not found',
					NOT_FOUND.code,
				);
			}

			if (address) {
				const currentAddress = await establishmentAddressesQueries
					.findByEstablishmentId(knex, currentEstablishment.id);

				if (!currentAddress) {
					throw new ApolloError(
						'establishment address not found',
						NOT_FOUND.code,
					);
				}
				// eslint-disable-next-line no-console
				await establishmentAddressesQueries.update(
					knex,
					currentEstablishment.id,
					address,
				);
			}

			if (details) {
				const promises = details.map(async (detail) => {
					const currentDetail = await establishmentDetailsQueries
						.findById(knex, detail.id);

					if (!currentDetail) {
						throw new ApolloError(
							'establishment details not found',
							NOT_FOUND.code,
						);
					}

					if (details.imageId) {
						const currentPicture = await pictureQueries.findById(knex, details.imageId);

						if (!currentPicture) {
							throw new ApolloError(
								'establishment detail picture not found',
								NOT_FOUND.code,
							);
						}
					}

					return establishmentDetailsQueries.update(
						knex,
						currentEstablishment.id,
						currentDetail.id,
						detail,
					);
				});

				await Promise.all(promises);
			}

			if (disabilityIds) {
				// TODO: возможно, здесь нужно промапать айдишники и проверить, что такие записи
				// есть в БД
				await disabilitiesToEstablishmentsQueries.deleteDisabilitiesOfEstablishment(
					knex, currentEstablishment.id,
				);
				await disabilitiesToEstablishmentsQueries.insert(
					knex, currentEstablishment.id, disabilityIds,
				);
			}

			if (facilityIds) {
				// TODO: возможно, здесь нужно промапать айдишники и проверить, что такие записи
				// есть в БД
				await facilitiesToEstablishmentsQueries.deleteFacilitiesOfEstablishment(
					knex, currentEstablishment.id,
				);
				await facilitiesToEstablishmentsQueries.insert(
					knex, currentEstablishment.id, facilityIds,
				);
			}

			if (typologyIds) {
				// TODO: возможно, здесь нужно промапать айдишники и проверить, что такие записи
				// есть в БД
				await typologiesToEstablishmentsQueries.deleteTypologiesOfEstablishment(
					knex, currentEstablishment.id,
				);
				await typologiesToEstablishmentsQueries.insert(
					knex, currentEstablishment.id, typologyIds,
				);
			}

			if (pictureIds) {
				// TODO: возможно, здесь нужно промапать айдишники и проверить, что такие записи
				// есть в БД
				await picturesToEstablishmentsQueries.deletePicturesOfEstablishment(
					knex, currentEstablishment.id,
				);
				await picturesToEstablishmentsQueries.insert(
					knex, currentEstablishment.id, pictureIds,
				);
				await Promise.all(pictureIds.map(async (id, index) => {
					await knex('pictures').update({ position: index + 1 }).where({ id });
				}));
			}

			if (establishmentFields && Object.keys(establishmentFields).length > 0) {
				await establishmentQueries.update(knex, currentEstablishment.id, establishmentFields);
			}

			const updatedEstablishment = await establishmentQueries.findEstablishmentWithCover(
				knex, establishmentFields.id,
			);

			if (!updatedEstablishment) {
				throw new ApolloError(
					'updated establishment not found',
					NOT_FOUND.code,
				);
			}

			return mapEstablishmentDbRowToEstablishmentType(updatedEstablishment);
		},

		async deleteEstablishment(parent, { establishmentId }, { knex }) {
			const currentEstablishment = await establishmentQueries.findById(
				knex, establishmentId,
			);

			if (!currentEstablishment) {
				throw new ApolloError(
					'establishment not found',
					NOT_FOUND.code,
				);
			}

			await knex.transaction(async (trx) => {
				await Promise.all([
					establishmentAddressesQueries.deleteAddress(
						trx, establishmentId,
					),
					picturesToEstablishmentsQueries.deletePicturesOfEstablishment(
						trx, establishmentId,
					),
					typologiesToEstablishmentsQueries.deleteTypologiesOfEstablishment(
						trx, establishmentId,
					),
					disabilitiesToEstablishmentsQueries.deleteDisabilitiesOfEstablishment(
						trx, establishmentId,
					),
					facilitiesToEstablishmentsQueries.deleteFacilitiesOfEstablishment(
						trx, establishmentId,
					),
					establishmentDetailsQueries.deleteAllDetails(
						trx, establishmentId,
					),
				]);

				await establishmentQueries.deleteEstablishment(trx, establishmentId);
			});

			return { success: true };
		},
		async disableEstablishment(parent, { establishmentId }, { knex }) {
			const currentEstablishment = await establishmentQueries.findById(knex, establishmentId);

			if (!currentEstablishment) {
				throw new ApolloError(
					'establishment not found',
					NOT_FOUND.code,
				);
			}

			await establishmentQueries.disableEstablishment(knex, establishmentId);

			return { success: true };
		},
		async dropPictureFromEstablishmentGallery(parent, { dropEstablishmentPictureInput }, { knex }) {
			const {
				pictureId,
				establishmentId,
			} = dropEstablishmentPictureInput;

			const [picture] = await knex('pictures_to_establishments')
				.select(
					'picture_id',
				)
				.where('picture_id', '=', pictureId)
				.andWhere('establishment_id', '=', establishmentId);

			if (!picture) {
				throw new ApolloError(
					'establishment picture not found',
					NOT_FOUND.code,
				);
			}

			await knex('pictures_to_establishments')
				.where('picture_id', '=', pictureId)
				.andWhere('establishment_id', '=', establishmentId)
				.del();

			return { success: true };
		},
		async editEstablishmentGalleryPicture(parent, { editEstablishmentPictureInput }, { knex }) {
			const {
				pictureId,
				establishmentId,
				title,
				description,
			} = editEstablishmentPictureInput;

			const [picture] = await knex('pictures_to_establishments')
				.select(
					'picture_id',
				)
				.where('picture_id', '=', pictureId)
				.andWhere('establishment_id', '=', establishmentId);

			if (!picture) {
				throw new ApolloError(
					'establishment picture not found',
					NOT_FOUND.code,
				);
			}

			await knex('pictures')
				.where('id', '=', pictureId)
				.update({
					title,
					description,
					updated_at: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
				});

			return { success: true };
		},
		async addPicturesToEstablishmentGallery(
			parent, { addPicturesToEstablishmentGalleryInput }, { knex },
		) {
			const {
				establishmentId,
				pictureIds,
			} = addPicturesToEstablishmentGalleryInput;

			const establishment = await establishmentQueries.findById(knex, establishmentId);

			if (!establishment) {
				throw new ApolloError(
					'establishment not found',
					NOT_FOUND.code,
				);
			}

			await picturesToEstablishmentsQueries.insert(knex, establishmentId, pictureIds);

			return { success: true };
		},

		async addCoverPicture(parent, { addCoverPictureInput }, { knex }) {
			const {
				establishmentId,
				pictureId,
			} = addCoverPictureInput;

			const establishment = await establishmentQueries.findById(knex, establishmentId);

			if (!establishment) {
				throw new ApolloError(
					'establishment not found',
					NOT_FOUND.code,
				);
			}

			const picture = await pictureQueries.findById(knex, pictureId);

			if (!picture) {
				throw new ApolloError(
					'cover picture not found',
					NOT_FOUND.code,
				);
			}
			await establishmentQueries.update(knex, establishmentId, { coverId: pictureId });

			return { success: true };
		},
	},
};

module.exports = {
	typeResolvers,
	resolvers,
};
