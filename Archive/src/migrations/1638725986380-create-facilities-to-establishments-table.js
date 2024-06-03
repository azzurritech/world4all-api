exports.up = (knex) => knex.schema
  .createTable('facilities_to_establishments', (table) => {
    table.integer('establishment_id').unsigned().notNullable();
    table.foreign('establishment_id').references('id').inTable('establishments');
    table.integer('facility_id').unsigned().notNullable();
    table.foreign('facility_id').references('id').inTable('facilities');
  });

exports.down = (knex) => knex.schema
  .dropTable('facilities_to_establishments');
