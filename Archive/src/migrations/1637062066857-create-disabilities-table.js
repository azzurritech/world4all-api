exports.up = async (knex) => {
  await knex.schema
    .createTable('disabilities', (table) => {
      table.increments('id').primary();
      table.string('name', 255).unique().notNullable();
      table.boolean('is_disabled').defaultTo('false');
    });

  await knex('disabilities').insert([
    { name: 'Emiplegico' },
    { name: 'Paraplegico' },
    { name: 'Tetraplegico' },
    { name: 'Ipovedente' },
    { name: 'Anziano' },
    { name: 'Mamma' },
  ]);
};

exports.down = (knex) => knex.schema
  .dropTable('disabilities');
