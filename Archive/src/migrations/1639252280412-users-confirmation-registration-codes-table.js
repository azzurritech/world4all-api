exports.up = (knex) => knex.schema
  .createTable('users_confirmation_registration_codes', (table) => {
    table.integer('user_id').unsigned().notNullable();
    table.foreign('user_id').references('id').inTable('users');
    table.string('code').notNullable();
  });

exports.down = (knex) => knex.schema
  .dropTable('users_confirmation_registration_codes');
