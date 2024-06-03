exports.up = (knex) => knex.schema
  .createTable('facilities_to_users', (table) => {
    table.integer('user_id').unsigned().notNullable();
    table.foreign('user_id').references('id').inTable('users');
    table.integer('facility_id').unsigned().notNullable();
    table.foreign('facility_id').references('id').inTable('facilities');
  });

exports.down = (knex) => knex.schema
  .dropTable('facilities_to_users');
