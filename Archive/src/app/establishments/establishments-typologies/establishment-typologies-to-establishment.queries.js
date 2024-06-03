async function insert(knex, establishmentId, typologyIds) {
  const typologiesAndEstablishment = typologyIds.map((typologyId) => ({
    establishment_id: establishmentId,
    typology_id: typologyId,
  }));

  return knex('typologies_to_establishments')
    .insert(typologiesAndEstablishment);
}

async function findTypologiesWithEstablishments(knex, establishmentIds) {
  const typologiesWithEstablishments = await knex('typologies_to_establishments')
    .select([
      'establishment_typologies.id',
      'establishment_typologies.name',
      'establishment_typologies.category_id as categoryId',
      'establishment_typologies.is_disabled as isDisabled',
      'typologies_to_establishments.establishment_id as establishmentId',
    ])
    .leftJoin('establishment_typologies', 'establishment_typologies.id', 'typologies_to_establishments.typology_id')
    .whereIn('typologies_to_establishments.establishment_id', establishmentIds)
    .andWhere('establishment_typologies.is_disabled', '=', '0');

  return typologiesWithEstablishments;
}

async function deleteTypologiesOfEstablishment(knex, establishmentId) {
  return knex('typologies_to_establishments')
    .where('establishment_id', '=', establishmentId)
    .del();
}

module.exports = {
  insert,
  findTypologiesWithEstablishments,
  deleteTypologiesOfEstablishment,
};
