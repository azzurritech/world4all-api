exports.up = (knex) => knex.schema
  .createTable('establishment_addresses', (table) => {
    table.increments('id').primary();
    table.integer('establishment_id').unsigned();
    table.foreign('establishment_id').references('id').inTable('establishments').onDelete('CASCADE');
    table.string('country', 255).notNullable();
    table.string('city', 255).notNullable();
    table.string('street', 255).notNullable();
    table.string('building_number', 255).notNullable();
    table.string('apartment', 255);
    table.double('lat', 14, 10).notNullable();
    table.double('lng', 14, 10).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    // When you add integrations with GoogleMaps you need to make new migrations
    // for this table for adding latitude and longitude columns (or one common like jsonb)
  });

exports.down = (knex) => knex.schema
  .dropTable('establishment_addresses');
