async function insert(knex, establishmentId, pictureIds) {
  const picturesAndEstablishment = pictureIds.map((pictureId) => ({
    establishment_id: establishmentId,
    picture_id: pictureId,
  }));
  return knex('pictures_to_establishments')
    .insert(picturesAndEstablishment);
}

async function deletePicturesOfEstablishment(knex, establishmentId) {
  return knex('pictures_to_establishments')
    .where('establishment_id', '=', establishmentId)
    .del();
}

async function findPicturesWithEstablishments(knex, establishmentsIds) {
  const picturesWithEstablishments = await knex('pictures_to_establishments')
    .select([
      'pictures.id',
      'pictures.url',
      'pictures.title',
      'pictures.description',
      'pictures_to_establishments.establishment_id as establishmentId',
      'pictures.position',
    ])
    .leftJoin('pictures', 'pictures.id', 'pictures_to_establishments.picture_id')
    .whereIn('pictures_to_establishments.establishment_id', establishmentsIds)
    .orderBy('pictures.position');

  return picturesWithEstablishments;
}

module.exports = {
  insert,
  deletePicturesOfEstablishment,
  findPicturesWithEstablishments,
};
