const { mapTypologyTypeToTypologyDbRow } = require('./establishment-typology.utils');

async function insert(knex, typologyData) {
  return knex('establishment_typologies')
    .insert({
      name: typologyData.name,
      category_id: typologyData.categoryId,
    });
}

async function findAllActive(knex) {
  const facilities = await knex('establishment_typologies')
    .select(
      'id',
      'name',
      'category_id as categoryId',
      'is_disabled as isDisabled',
    )
    .where('is_disabled', '=', 0);

  return facilities;
}

async function findAllActiveInTheCategories(knex, queries) {
  const facilities = await knex('establishment_typologies')
    .select(
      'id',
      'name',
      'category_id as categoryId',
      'is_disabled as isDisabled',
    ).where((qb) => {
      if (queries && queries.categoryIds) {
        qb.whereIn('category_id', queries.categoryIds);
      }
      qb.andWhere('is_disabled', '=', 0);
    });

  return facilities;
}

async function findOneById(knex, typologyId) {
  const [typology] = await knex('establishment_typologies')
    .select(
      'id',
      'name',
      'category_id as categoryId',
      'is_disabled as isDisabled',
    )
    .where('id', '=', typologyId);

  if (!typology) {
    return null;
  }

  return typology;
}

async function findOneActiveById(knex, typologyId) {
  const [typology] = await knex('establishment_typologies')
    .select(
      'id',
      'name',
      'category_id as categoryId',
      'is_disabled as isDisabled',
    )
    .where('id', '=', typologyId)
    .andWhere('is_disabled', '=', 0);

  if (!typology) {
    return null;
  }

  return typology;
}

async function update(knex, typologyId, updatedFields) {
  const updatedTypology = await knex('establishment_typologies')
    .where('id', '=', typologyId)
    .update(mapTypologyTypeToTypologyDbRow(updatedFields));

  return updatedTypology;
}

async function disable(knex, typologyId) {
  return knex('establishment_typologies')
    .where('id', '=', typologyId)
    .update({
      is_disabled: true,
    });
}

module.exports = {
  insert,
  findOneById,
  findOneActiveById,
  findAllActive,
  update,
  disable,
  findAllActiveInTheCategories,
};
