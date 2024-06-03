exports.up = (knex) => knex.schema
  .createTable('favorites', (table) => {
    table.integer('user_id').unsigned().notNullable();
    table.foreign('user_id').references('id').inTable('users');
    table.integer('establishment_id').unsigned().notNullable();
    table.foreign('establishment_id').references('id').inTable('establishments');
  });

exports.down = (knex) => knex.schema
  .dropTable('favorites');
