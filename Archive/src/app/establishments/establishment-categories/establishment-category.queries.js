const { mapCategoryTypeToCategoryDbRow } = require('./establishment-category.utils');

async function insert(knex, categoryName) {
  return knex('establishment_categories').insert({ name: categoryName });
}

async function findAllActive(knex) {
  const categories = await knex('establishment_categories')
    .select(
      'establishment_categories.id',
      'establishment_categories.name',
      'is_disabled as isDisabled',
      'pictures.id as idImage', 
      'pictures.url',
    )
    .leftJoin('pictures', 'pictures.id', 'establishment_categories.image_id')
    .where('is_disabled', '=', 0);
   
  return categories;
}

async function findOneById(knex, id) {
  const [category] = await knex('establishment_categories')
    .select(
      'id',
      'name',
      'is_disabled as isDisabled',
    )
    .where('id', '=', id);

  if (!category) {
    return null;
  }

  return category;
}

async function findOneActiveById(knex, id) {
  const [category] = await knex('establishment_categories')
    .select(
      'id',
      'name',
      'is_disabled as isDisabled',
    )
    .where('id', '=', id);
  if (!category) {
    return null;
  }

  return category;
}

async function update(knex, categoryId, updatedFields) {
  const updatedCategory = await knex('establishment_categories')
    .where('id', '=', categoryId)
    .update(mapCategoryTypeToCategoryDbRow(updatedFields));

  return updatedCategory;
}

async function disable(knex, categoryId) {
  await knex('establishment_typologies')
    .where('category_id', '=', categoryId)
    .update({ is_disabled: 1 });
  return knex('establishment_categories')
    .where('id', '=', categoryId)
    .update({
      is_disabled: true,
    });
}

module.exports = {
  insert,
  update,
  disable,
  findOneById,
  findAllActive,
  findOneActiveById,
};
