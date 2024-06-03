exports.up = async (knex) => {
  await knex.schema
    .createTable('facilities', (table) => {
      table.increments('id').primary();
      table.string('name', 255).unique().notNullable();
      table.boolean('is_disabled').defaultTo('false');
    });

  await knex('facilities').insert([
    { name: 'Protesi' },
    { name: 'Tripode' },
    { name: 'Stampelle' },
    { name: 'Deambulatore' },
    { name: 'Carrozzina' },
    { name: 'Genny' },
  ]);
};

exports.down = (knex) => knex.schema
  .dropTable('facilities');
