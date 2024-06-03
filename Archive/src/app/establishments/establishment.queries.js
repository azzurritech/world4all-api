const moment = require('moment');
const haversine = require('haversine-distance');
const { mapEstablishmentTypeToEstablishmentDbRow } = require('./establishment.utils');

async function insert(knex, establishmentData) {
	return knex('establishments').insert(mapEstablishmentTypeToEstablishmentDbRow(establishmentData));
}

async function findLastInserted(knex) {
	const [establishment] = await knex('establishments')
		.select()
		.orderBy('id', 'desc')
		.limit(1);

	if (!establishment) {
		return null;
	}

	return establishment;
}

async function findById(knex, establishmentId) {
	const [establishment] = await knex('establishments')
		.select(
			'id',
			'name',
			'phone',
			'email',
			'website',
			'description',
			'cover_id',
			'created_at',
			'updated_at',
		)
		.where('id', '=', establishmentId);

	if (!establishment) {
		return null;
	}

	return establishment;
}

async function findAll(
	knex,
	limit = 0,
	offset = 0,
	search = '',
	typologyIds = [],
	disabilityIds = [],
	facilityIds = [],
	order = '',
	categoryIds = [],
	tagsId=[],
) {
	const establishments = knex('establishments')
		.select(
			'establishments.id',
			'establishments.name',
			'establishments.phone',
			'establishments.email',
			'establishments.website',
			'establishments.description',
			'establishments.cover_id',
			'establishments.created_at',
			'establishments.updated_at',
			'establishment_typologies.category_id as category_id',
			'pictures.url as url',
			'typology_id',
			'disability_id',
			'facility_id',
			'idtag',
			'enabled',
			'lat',
			'lng',
		)
		.where('enabled', '=', 1)
		.leftJoin(
			'typologies_to_establishments',
			'typologies_to_establishments.establishment_id',
			'establishments.id',
		).leftJoin(
			'disabilities_to_establishments',
			'disabilities_to_establishments.establishment_id',
			'establishments.id',
		)
		.leftJoin(
			'facilities_to_establishments',
			'facilities_to_establishments.establishment_id',
			'establishments.id',
		)
		.leftJoin(
			'establishment_typologies',
			'establishment_typologies.id',
			'typology_id',
		)
		.leftJoin(
			'tag_to_establishment',
			'tag_to_establishment.idestablishment',
			'establishments.id',
		)
		.leftJoin(
			'pictures',
			'establishments.cover_id',
			'pictures.id',
		)
		.leftJoin(
			'establishment_addresses',
			'establishment_addresses.establishment_id',
			'establishments.id',
		)
		.groupBy('id', 'url')
		.limit(limit)
		.offset(offset);

	if (search) {
		establishments
			.where('establishments.name', 'like', `%${search}%`);
	}

	if (order) {
		establishments
			.orderBy('establishments.name', order);
	}

	if (typologyIds.length) {
		establishments
			.whereIn('typology_id', typologyIds)
			.countDistinct('typology_id as typologyCount')
			.having('typologyCount', '>=', typologyIds.length);
	}
	if (categoryIds.length) {
		establishments
			.whereIn('category_id', categoryIds)
			.countDistinct('category_id as categoryCount')
			.having('categoryCount', '>=', categoryIds.length);
	}
	if (disabilityIds.length) {
		establishments
			.whereIn('disability_id', disabilityIds)
			.countDistinct('disability_id as disabilityCount')
			.having('disabilityCount', '>=', disabilityIds.length);
	}
	if (facilityIds.length) {
		establishments
			.whereIn('facility_id', facilityIds)
			.countDistinct('facility_id as facilityCount')
			.having('facilityCount', '>=', facilityIds.length);
	}
	if(tagsId.length){
		establishments
			.whereIn('idtag', tagsId)
			.countDistinct('idtag as tagCount')
			.having('tagCount', '>=', tagsId.length);
	}

	return await establishments;
}

async function findEstablishmentWithCover(knex, establishmentId) {
	const [establishment] = await knex('establishments')
		.select([
			'establishments.id',
			'establishments.name',
			'establishments.phone',
			'establishments.email',
			'establishments.website',
			'establishments.description',
			'establishments.created_at',
			'establishments.updated_at',
			'pictures.id as cover_id',
			'pictures.url',
			'enabled'
		])
		.leftJoin('pictures', 'establishments.cover_id', 'pictures.id')
		.where('establishments.id', establishmentId)
		.andWhere('enabled', '=', 1);

	if (!establishment) {
		return null;
	}

	return establishment;
}

async function findDistanceToEstablishment(knex, establishmentId, lat, lng) {
	const [establishment] = await knex('establishments')
		.select([
			'establishment_addresses.lat as latitude',
			'establishment_addresses.lng as longitude',
		])
		.leftJoin('establishment_addresses', 'establishments.id', 'establishment_addresses.establishment_id')
		.where('establishments.id', establishmentId);

	if (!establishment) {
		return null;
	}

	const startPoint = { latitude: lat, longitude: lng };
	return haversine(startPoint, establishment);
}

async function update(knex, establishmentId, updatedFields) {
	const updatedEstablishment = await knex('establishments')
		.where('id', '=', establishmentId)
		.update({
			...mapEstablishmentTypeToEstablishmentDbRow(updatedFields),
			updated_at: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
		});

	return updatedEstablishment;
}

async function deleteEstablishment(knex, establishmentId) {
	return knex('establishments')
		.where('id', '=', establishmentId)
		.del();
}

async function disableEstablishment(knex, establishmentId) {
	const disabledEstablishment = await knex('establishments')
		.where('id', '=', establishmentId)
		.update({ enabled: false });

	return disabledEstablishment;
}

module.exports = {
	insert,
	findLastInserted,
	findEstablishmentWithCover,
	findById,
	findAll,
	update,
	deleteEstablishment,
	findDistanceToEstablishment,
	disableEstablishment
};
