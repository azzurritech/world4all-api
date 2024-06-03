exports.up = (knex) => knex.schema
  .createTable('typologies_to_establishments', (table) => {
    table.integer('establishment_id').unsigned().notNullable();
    table.foreign('establishment_id').references('id').inTable('establishments');
    table.integer('typology_id').unsigned().notNullable();
    table.foreign('typology_id').references('id').inTable('establishment_typologies');
  });

exports.down = (knex) => knex.schema
  .dropTable('typologies_to_establishments');
