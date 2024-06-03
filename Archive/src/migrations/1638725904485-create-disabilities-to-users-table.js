exports.up = (knex) => knex.schema
  .createTable('disabilities_to_users', (table) => {
    table.integer('user_id').unsigned().notNullable();
    table.foreign('user_id').references('id').inTable('users');
    table.integer('disability_id').unsigned().notNullable();
    table.foreign('disability_id').references('id').inTable('disabilities');
  });

exports.down = (knex) => knex.schema
  .dropTable('disabilities_to_users');
