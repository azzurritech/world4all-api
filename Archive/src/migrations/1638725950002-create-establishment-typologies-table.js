exports.up = async (knex) => {
  await knex.schema
    .createTable('establishment_typologies', (table) => {
      table.increments('id').primary();
      table.string('name', 255);
      table.integer('category_id').unsigned();
      table.foreign('category_id').references('id').inTable('establishment_categories');
      table.boolean('is_disabled').defaultTo('false');
    });

  await knex('establishment_typologies').insert([
    { name: 'Agriturismo', category_id: 1 },
    { name: 'Bar/Caffè', category_id: 1 },
    { name: 'Gelateria', category_id: 1 },
    { name: 'Macelleria/Salumeria', category_id: 1 },
    { name: 'Pasticceria', category_id: 1 },
    { name: 'Pizzeria', category_id: 1 },
    { name: 'Piadineria', category_id: 1 },
    { name: 'Pub/Birreria', category_id: 1 },
    { name: 'Ristorante', category_id: 1 },
    { name: 'Sleep Trattoria con Alloggio', category_id: 1 },
    { name: 'Supermercato', category_id: 1 },
    { name: 'Sushi', category_id: 1 },
    { name: 'Trattoria', category_id: 1 },

    { name: 'Hotel', category_id: 2 },
    { name: 'Residence', category_id: 2 },

    { name: 'Abbigliamento', category_id: 3 },
    { name: 'Gioielleria', category_id: 3 },
    { name: 'Residence', category_id: 3 },

    { name: 'Benzinaio', category_id: 4 },
    { name: 'Municipio', category_id: 4 },
    { name: 'Parcheggio', category_id: 4 },
    { name: 'Poste', category_id: 4 },
    { name: 'Tabacchi', category_id: 4 },

    { name: 'Az. Olearia', category_id: 5 },
    { name: 'Cantina', category_id: 5 },
    { name: 'Caseificio', category_id: 5 },
    { name: 'Centro sportivo', category_id: 5 },
    { name: 'Museo', category_id: 5 },
    { name: 'Palazzetto', category_id: 5 },
    { name: 'Palestra', category_id: 5 },
  ]);
};

exports.down = (knex) => knex.schema
  .dropTable('establishment_typologies');
