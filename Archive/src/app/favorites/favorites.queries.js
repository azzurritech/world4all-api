async function insert(knex, userId, establishmentId) {
	return knex('favorites')
		.insert({
			user_id: userId,
			establishment_id: establishmentId,
		});
}

async function findAllByUserIdAndEstablishmentId(knex, userId, establishmentIds) {
	return knex('favorites')
		.select(
			'establishment_id as establishmentId',
		)
		.whereIn('establishment_id', establishmentIds)
		.andWhere('user_id', '=', userId);
}

async function findAllByUserId(knex, userId, limit = 0, offset = 0) {
	return knex('favorites')
		.select(
			'establishments.id',
			'establishments.name',
			'establishments.phone',
			'establishments.email',
			'establishments.website',
			'establishments.description',
			'pictures.url as url',
			'establishments.cover_id',
			'establishments.created_at as created_at',
			'establishments.updated_at as updated_at',
		)
		.leftJoin('establishments', 'favorites.establishment_id', 'establishments.id')
		.leftJoin(
			'pictures',
			'establishments.cover_id',
			'pictures.id',
		)
		.where('favorites.user_id', '=', userId)
		.limit(limit)
		.offset(offset);
}

async function findAllByUserIds(knex, userIds) {
	return knex('favorites')
		.select(
			'establishments.id',
			'establishments.name',
			'establishments.phone',
			'establishments.email',
			'establishments.website',
			'establishments.description',
			'establishments.created_at as createdAt',
			'establishments.updated_at as updatedAt',
			'favorites.user_id as userId',
		)
		.leftJoin('establishments', 'favorites.establishment_id', 'establishments.id')
		.whereIn('favorites.user_id', userIds);
}

async function drop(knex, userId, establishmentId) {
	return knex('favorites')
		.where('user_id', '=', userId)
		.andWhere('establishment_id', '=', establishmentId)
		.del();
}

async function deleteFavoritesByUser(knex, userId, establishmentId) {
	return knex('favorites')
		.where('user_id', '=', userId)
		.del();
}

module.exports = {
	insert,
	drop,
	findAllByUserId,
	findAllByUserIds,
	findAllByUserIdAndEstablishmentId,
	deleteFavoritesByUser
};
