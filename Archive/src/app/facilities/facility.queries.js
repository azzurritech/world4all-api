const { mapFacilityTypeToFacilityDbRow } = require('./facility.utils');

async function insert(knex, facilityName) {
  return knex('facilities').insert({ name: facilityName });
}

async function findAllActive(knex) {
  const facilities = await knex('facilities')
    .select(
      'facilities.id',
      'facilities.name',
      'is_disabled as isDisabled',
      'pictures.id as idImage', 
      'pictures.url',
    )
    .leftJoin('pictures', 'pictures.id', 'facilities.image_id')
    .where('is_disabled', '=', 0);

  return facilities;
}

async function findOneById(knex, facilityId) {
  const [facility] = await knex('facilities')
    .select(
      'id',
      'name',
      'is_disabled as isDisabled',
    )
    .where('id', '=', facilityId);

  if (!facility) {
    return null;
  }

  return facility;
}

async function findActiveById(knex, disabilityId) {
  const [facility] = await knex('facilities')
    .select(
      'id',
      'name',
      'is_disabled as isDisabled',
    )
    .where('id', '=', disabilityId)
    .andWhere('is_disabled', '=', 0);

  if (!facility) {
    return null;
  }

  return facility;
}

async function update(knex, facilityId, updatedFields) {
  const updatedFacility = await knex('facilities')
    .where('id', '=', facilityId)
    .update(mapFacilityTypeToFacilityDbRow(updatedFields));

  return updatedFacility;
}

async function disable(knex, facilityId) {
  return knex('facilities')
    .where('id', '=', facilityId)
    .update({
      is_disabled: true,
    });
}

module.exports = {
  insert,
  update,
  disable,
  findAllActive,
  findOneById,
  findActiveById,
};
