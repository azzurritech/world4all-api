const { mapCategoryTypeToCategoryDbRow } = require('./establishment-cities.utils');

// async function insert(knex, categoryName) {
//   return knex('establishment_categories').insert({ name: categoryName });
// }

async function findAllActive(knex,city) {
  const coordinates = await knex('establishment_addresses')
    .select(
      'lat',
      'lng',
    )
    .where('city', '=',  city );
   
  return coordinates;
}



module.exports = {
  findAllActive,
};
