exports.up = (knex) => knex.schema
  .createTable('pictures_to_establishments', (table) => {
    table.integer('picture_id').unsigned().notNullable();
    table.foreign('picture_id').references('id').inTable('pictures');
    table.integer('establishment_id').unsigned().notNullable();
    table.foreign('establishment_id').references('id').inTable('establishments');
  });

exports.down = (knex) => knex.schema
  .dropTable('pictures_to_establishments');
