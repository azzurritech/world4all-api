const { mapDisabilityTypeToDisabilityDbRow } = require('./disability.utils');

async function insert(knex, disabilityName) {
  return knex('disabilities').insert({ name: disabilityName });
}

async function findAllActive(knex) {
  const facilities = await knex('disabilities')
    .select(
      'disabilities.id',
      'disabilities.name',
      'is_disabled as isDisabled',
      'pictures.id as idImage', 
      'pictures.url',
    )
    .leftJoin('pictures', 'pictures.id', 'disabilities.image_id')
    .where('is_disabled', '=', 0);

  return facilities;
}

async function findOneById(knex, disabilityId) {
  const [disability] = await knex('disabilities')
    .select(
      'id',
      'name',
      'is_disabled as isDisabled',
    )
    .where('id', '=', disabilityId);

  if (!disability) {
    return null;
  }

  return disability;
}

async function findActiveById(knex, disabilityId) {
  const [disability] = await knex('disabilities')
    .select(
      'id',
      'name',
      'is_disabled as isDisabled',
    )
    .where('id', '=', disabilityId)
    .andWhere('is_disabled', '=', 0);

  if (!disability) {
    return null;
  }

  return disability;
}

async function update(knex, disabilityId, updatedFields) {
  const updatedDisability = await knex('disabilities')
    .where('id', '=', disabilityId)
    .update(mapDisabilityTypeToDisabilityDbRow(updatedFields));

  return updatedDisability;
}

async function disable(knex, disabilityId) {
  return knex('disabilities')
    .where('id', '=', disabilityId)
    .del({
      is_disabled: true,
    });
}



module.exports = {
  insert,
  update,
  disable,
  findOneById,
  findActiveById,
  findAllActive,
};
