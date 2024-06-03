async function insert(knex, userId, facilityIds) {
  const facilitiesAndUsers = facilityIds.map((facilityId) => ({
    user_id: userId,
    facility_id: facilityId,
  }));

  return knex('facilities_to_users')
    .insert(facilitiesAndUsers);
}

async function findFacilitiesWithUsers(knex, userIds) {
  const facilitiesWithUsers = await knex('facilities_to_users')
    .select([
      'facilities.id',
      'facilities.name',
      'facilities.is_disabled as isDisabled',
      'facilities_to_users.user_id as userId',
    ])
    .leftJoin('facilities', 'facilities.id', 'facilities_to_users.facility_id')
    .whereIn('facilities_to_users.user_id', userIds);

  return facilitiesWithUsers;
}

async function deleteFacilitiesOfUser(knex, userId) {
  return knex('facilities_to_users')
    .where('user_id', '=', userId)
    .del();
}

module.exports = {
  insert,
  findFacilitiesWithUsers,
  deleteFacilitiesOfUser,
};
