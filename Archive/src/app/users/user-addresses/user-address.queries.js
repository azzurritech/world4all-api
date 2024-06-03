const moment = require('moment');

const { mapUserAddressTypeToUserAddressDbRow } = require('./user-address.utils');

async function insert(knex, userAddressData) {
	const {
		// eslint-disable-next-line camelcase
		buildingNumber: building_number,
		...fields
	} = userAddressData;

	// eslint-disable-next-line camelcase
	return knex('user_addresses').insert({ ...fields, building_number });
}

async function findByUserId(knex, userId) {
	const [address] = await knex('user_addresses')
		.select(
			'id',
			'country',
			'city',
			'street',
			'building_number',
			'apartment',
		)
		.where({
			user_id: userId,
		});

	if (!address) {
		return null;
	}

	return address;
}

async function findByUserIds(knex, userIds) {
	const addresses = await knex('user_addresses')
		.select(
			'id',
			'user_id as userId',
			'country',
			'city',
			'street',
			'building_number',
			'apartment',
		)
		.whereIn('user_id', userIds);

	return addresses;
}

async function update(knex, userId, addressId, updatedFields) {
	const updatedAddress = await knex('user_addresses')
		.where('id', '=', addressId)
		.andWhere('user_id', '=', userId)
		.update({
			...mapUserAddressTypeToUserAddressDbRow(updatedFields),
			updated_at: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
		});

	return updatedAddress;
}

async function deleteAddress(knex, userId) {
	return knex('user_addresses')
		.where('user_id', '=', userId)
		.del();
}

module.exports = {
	insert,
	update,
	findByUserId,
	findByUserIds,
	deleteAddress
};
