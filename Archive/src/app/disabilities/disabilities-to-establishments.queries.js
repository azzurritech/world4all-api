async function insert(knex, establishmentId, disabilityIds) {
  const disabilitiesAndEstablishment = disabilityIds.map((disabilityId) => ({
    establishment_id: establishmentId,
    disability_id: disabilityId,
  }));

  return knex('disabilities_to_establishments')
    .insert(disabilitiesAndEstablishment);
}

async function findDisabilitiesWithEstablishments(knex, establishmentIds) {
  const disabilitiesWithEstablishments = await knex('disabilities_to_establishments')
    .select([
      'disabilities.id',
      'disabilities.name',
      'disabilities.is_disabled as isDisabled',
      'disabilities_to_establishments.establishment_id as establishmentId',
    ])
    .leftJoin('disabilities', 'disabilities.id', 'disabilities_to_establishments.disability_id')
    .whereIn('disabilities_to_establishments.establishment_id', establishmentIds);

  return disabilitiesWithEstablishments;
}

async function deleteDisabilitiesOfEstablishment(knex, establishmentId) {
  return knex('disabilities_to_establishments')
    .where('establishment_id', '=', establishmentId)
    .del();
}

module.exports = {
  insert,
  findDisabilitiesWithEstablishments,
  deleteDisabilitiesOfEstablishment,
};
