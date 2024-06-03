async function insert(knex, pictureInput) {
  return knex('pictures').insert(pictureInput);
}

async function findLastInserted(knex) {
  const [picture] = await knex('pictures')
    .select()
    .orderBy('id', 'desc')
    .limit(1);

  if (!picture) {
    return null;
  }

  return picture;
}

async function findById(knex, pictureId) {
  const [picture] = await knex('pictures')
    .select('url')
    .where('id', '=', pictureId);

  if (!picture) {
    return null;
  }

  return picture;
}

async function drop(knex, pictureId) {
  return knex('pictures')
    .where('id', '=', pictureId)
    .del();
}

module.exports = {
  insert,
  findById,
  findLastInserted,
  drop,
};
