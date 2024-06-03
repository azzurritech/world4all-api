exports.up = async (knex) => {
	await knex.schema
		.createTable('establishment_details', (table) => {
			table.increments('id').primary();
			table.string('code', 255).notNullable();
			table.string('description', 1000);
			table.integer('image_id').unsigned();
			table.foreign('image_id').references('id').inTable('pictures');
			table.integer('establishment_id').unsigned();
			table.foreign('establishment_id').references('id').inTable('establishments');
			table.string('title', 255);
			table.timestamp('created_at').defaultTo(knex.fn.now());
			table.timestamp('updated_at').defaultTo(knex.fn.now());
		});
};

exports.down = (knex) => knex.schema
	.dropTable('establishment_details');
