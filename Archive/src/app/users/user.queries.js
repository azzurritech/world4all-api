const moment = require('moment');
const { mapUserTypeToUserDbRow } = require('./user.utils');

async function insert(knex, userData) {
	const {
		// eslint-disable-next-line camelcase
		firstName: first_name,
		// eslint-disable-next-line camelcase
		lastName: last_name,
		// eslint-disable-next-line camelcase
		dateBirth: date_birth,
		...fields
	} = userData;

	return knex('users').insert({
		...fields,
		// eslint-disable-next-line camelcase
		first_name,
		// eslint-disable-next-line camelcase
		last_name,
		// eslint-disable-next-line camelcase
		date_birth,
	});
}

async function findById(knex, userId) {
	const [user] = await knex('users')
		.select([
			'id',
			'first_name',
			'last_name',
			'email',
			'date_birth',
			'phone',
			'accompanied',
			'role',
			'created_at',
			'updated_at',
			'is_active',
			'enabled'
		])
		.where('id', '=', userId)
		.andWhere('enabled', '=', 1);;

	if (!user) {
		return null;
	}

	return user;
}

async function findUserWithAvatar(knex, userId) {
	const [user] = await knex('users')
		.select([
			'users.id',
			'users.first_name',
			'users.last_name',
			'users.email',
			'users.date_birth',
			'users.phone',
			'users.accompanied',
			'users.role',
			'users.created_at',
			'users.updated_at',
			'users.is_active',
			'users.enabled',
			'pictures.id as pictureId',
			'pictures.url',
		])
		.leftJoin('pictures', 'users.avatar_id', 'pictures.id')
		.where('users.id', userId);

	if (!user) {
		return null;
	}

	return user;
}

async function findByEmailAndPassword(knex, email, password) {
	const [user] = await knex('users')
		.select(
			'id',
		)
		.where({
			email,
			password,
		})
		.where('enabled', '=', '1');

	if (!user) {
		return null;
	}

	return user;
}

async function findLastInserted(knex) {
	const [user] = await knex('users')
		.select()
		.orderBy('id', 'desc')
		.limit(1);

	if (!user) {
		return null;
	}

	return user;
}

async function update(knex, userId, updatedFields) {
	const updatedUser = await knex('users')
		.where('id', '=', userId)
		.update({
			...mapUserTypeToUserDbRow(updatedFields),
			updated_at: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
		});

	return updatedUser;
}

async function markIsNotActive(knex, userId) {
	const isNotActiveUser = await knex('users')
		.where('id', '=', userId)
		.update({ is_active: false });

	return isNotActiveUser;
}

async function disableUser(knex, userId) {
	const disabledUser = await knex('users')
		.where('id', '=', userId)
		.update({ enabled: false });

	return disabledUser;
}

async function getActives(knex, limit = 0, offset = 0) {
	const activeUsers = await knex('users')
		.select(
			'id',
			'first_name',
			'last_name',
			'phone',
			'accompanied',
			'email',
			'is_active',
			'avatar_id',
			'role',
			'date_birth',
			'created_at',
			'updated_at',
		)
		.where('is_active', '=', 1)
		.limit(limit)
		.offset(offset);

	return activeUsers;
}

async function findAll(knex, limit = 0, offset = 0) {
	const allUsers = await knex('users')
		.select(
			'id',
			'first_name',
			'last_name',
			'phone',
			'accompanied',
			'email',
			'is_active',
			'avatar_id',
			'role',
			'date_birth',
			'created_at',
			'updated_at',
			'enabled'
		)
		.where('enabled', '=', 1)
		.limit(limit)
		.offset(offset);

	return allUsers;
}

async function findByEmail(knex, email) {
	const [user] = await knex('users')
		.select(
			'id',
			'first_name',
		)
		.where('email', '=', email);

	if (!user) {
		return null;
	}

	return user;
}

async function deleteUser(knex, userId) {
	return knex('users')
		.where('id', '=', userId)
		.del();
}

module.exports = {
	insert,
	update,
	findById,
	findAll,
	getActives,
	findLastInserted,
	findByEmailAndPassword,
	markIsNotActive,
	findUserWithAvatar,
	findByEmail,
	deleteUser,
	disableUser
};
