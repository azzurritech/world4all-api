async function insert(knex, establishmentId, facilityIds) {
  const facilitiesAndEstablishment = facilityIds.map((facilityId) => ({
    establishment_id: establishmentId,
    facility_id: facilityId,
  }));

  return knex('facilities_to_establishments')
    .insert(facilitiesAndEstablishment);
}

async function findFacilitiesWithEstablishments(knex, establishmentIds) {
  const facilitiesWithEstablishments = await knex('facilities_to_establishments')
    .select([
      'facilities.id',
      'facilities.name',
      'facilities.is_disabled as isDisabled',
      'facilities_to_establishments.establishment_id as establishmentId',
    ])
    .leftJoin('facilities', 'facilities.id', 'facilities_to_establishments.facility_id')
    .whereIn('facilities_to_establishments.establishment_id', establishmentIds);

  return facilitiesWithEstablishments;
}

async function deleteFacilitiesOfEstablishment(knex, establishmentId) {
  return knex('facilities_to_establishments')
    .where('establishment_id', '=', establishmentId)
    .del();
}

module.exports = {
  insert,
  findFacilitiesWithEstablishments,
  deleteFacilitiesOfEstablishment,
};
