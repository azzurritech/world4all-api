exports.up = (knex) => knex.schema
  .createTable('pictures', (table) => {
    table.increments('id').primary();
    table.string('url', 255).notNullable();
    table.string('title', 255);
    table.string('description', 255);
    table.integer('position').unsigned().notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

exports.down = (knex) => knex.schema
  .dropTable('pictures');
