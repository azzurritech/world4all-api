exports.up = (knex) => knex.schema
	.createTable('establishments', (table) => {
		table.increments('id').primary();
		table.string('name', 255).notNullable();
		table.string('phone', 255);
		table.integer('cover_id').unsigned().defaultTo(null);
		table.foreign('cover_id').references('id').inTable('pictures');
		// Make it unique if you need
		table.string('email', 255);
		// Make it unique if you need
		table.string('website', 255).unique();
		table.string('description', 1000);
		table.timestamp('created_at').defaultTo(knex.fn.now());
		table.timestamp('updated_at').defaultTo(knex.fn.now());
		table.boolean('enabled').defaultTo('true');
	});

exports.down = (knex) => knex.schema
	.dropTable('establishments');
