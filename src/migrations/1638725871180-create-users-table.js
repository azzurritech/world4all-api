exports.up = (knex) => knex.schema
	.createTable('users', (table) => {
		table.increments('id').primary();
		table.string('first_name', 255).notNullable();
		table.string('last_name', 255).notNullable();
		table.string('phone', 255).notNullable();
		table.string('email', 255).unique().notNullable();
		// It's always the hash
		table.string('password', 64).notNullable();
		table.boolean('is_active').defaultTo('false');
		table.boolean('enabled').defaultTo('true');
		table.boolean('accompanied').defaultTo('false');
		table.integer('avatar_id').unsigned().defaultTo(null);
		table.foreign('avatar_id').references('id').inTable('pictures');
		table.string('role', 255).notNullable();
		table.date('date_birth').notNullable();
		table.timestamp('created_at').defaultTo(knex.fn.now());
		table.timestamp('updated_at').defaultTo(knex.fn.now());
	});

exports.down = (knex) => knex.schema
	.dropTable('users');
