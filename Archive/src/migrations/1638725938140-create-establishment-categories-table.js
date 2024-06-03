exports.up = async (knex) => {
  await knex.schema
    .createTable('establishment_categories', (table) => {
      table.increments('id').primary();
      table.string('name', 255);
      table.boolean('is_disabled').defaultTo('false');
    });

  await knex('establishment_categories').insert([
    { name: 'Mangiare/Bere' },
    { name: 'Dormire' },
    { name: 'Shopping' },
    { name: 'Avere servize' },
    { name: 'Divertirmi' },
  ]);
};

exports.down = (knex) => knex.schema
  .dropTable('establishment_categories');
