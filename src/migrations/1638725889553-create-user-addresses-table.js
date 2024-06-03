exports.up = (knex) => knex.schema
  .createTable('user_addresses', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned();
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('country', 255).notNullable();
    table.string('city', 255).notNullable();
    table.string('street', 255).notNullable();
    table.string('building_number', 255).notNullable();
    table.string('apartment', 255);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    // When you add integrations with GoogleMaps you need to make new migrations
    // for this table for adding latitude and longitude columns (or one common like jsonb)
  });

exports.down = (knex) => knex.schema
  .dropTable('user_addresses');
