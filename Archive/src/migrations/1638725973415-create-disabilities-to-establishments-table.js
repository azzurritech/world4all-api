exports.up = (knex) => knex.schema
  .createTable('disabilities_to_establishments', (table) => {
    table.integer('establishment_id').unsigned().notNullable();
    table.foreign('establishment_id').references('id').inTable('establishments');
    table.integer('disability_id').unsigned().notNullable();
    table.foreign('disability_id').references('id').inTable('disabilities');
  });

exports.down = (knex) => knex.schema
  .dropTable('disabilities_to_establishments');
