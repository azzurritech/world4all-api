const moment = require('moment');

const { mapEstablishmentAddressTypeToEstablishmentAddressDbRow } = require('./establishment-address.utils');

async function insert(knex, establishmentAddressData) {
  const {
    // eslint-disable-next-line camelcase
    buildingNumber: building_number,
    ...fields
  } = establishmentAddressData;

  // eslint-disable-next-line camelcase
  return knex('establishment_addresses').insert({ ...fields, building_number });
}

async function findByEstablishmentId(knex, establishmentId) {
  const [address] = await knex('establishment_addresses')
    .select(
      'country',
      'city',
      'street',
      'building_number',
      'apartment',
      'lat',
      'lng',
    )
    .where({
      establishment_id: establishmentId,
    });

  if (!address) {
    return null;
  }

  return address;
}

async function findByIds(knex, establishmentIds) {
  const addresses = await knex('establishment_addresses')
    .select(
      'id',
      'establishment_id as establishmentId',
      'country',
      'city',
      'street',
      'building_number as buildingNumber',
      'apartment',
      'lat',
      'lng',
    )
    .whereIn('establishment_id', establishmentIds);

  return addresses;
}
async function findAll(knex) {
  const addresses = await knex('establishment_addresses')
    .select(
      'id',
      'establishment_id as establishmentId',
      'country',
      'city',
      'street',
      'building_number as buildingNumber',
      'apartment',
      'lat',
      'lng',
    );

  return addresses;
}
async function update(knex, establishmentId, updatedFields) {
  const updatedAddress = await knex('establishment_addresses')
    .where('establishment_id', '=', establishmentId)
    .update({
      ...mapEstablishmentAddressTypeToEstablishmentAddressDbRow(updatedFields),
      updated_at: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
    });

  return updatedAddress;
}

async function deleteAddress(knex, establishmentId) {
  return knex('establishment_addresses')
    .where('establishment_id', '=', establishmentId)
    .del();
}

module.exports = {
  insert,
  findByIds,
  findByEstablishmentId,
  update,
  deleteAddress,
  findAll
};
