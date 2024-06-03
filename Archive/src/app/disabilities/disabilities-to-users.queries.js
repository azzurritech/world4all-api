async function insert(knex, userId, disabilityIds) {
  const disabilitiesAndUsers = disabilityIds.map((disabilityId) => ({
    user_id: userId,
    disability_id: disabilityId,
  }));

  return knex('disabilities_to_users')
    .insert(disabilitiesAndUsers);
}

async function findDisabilitiesWithUsers(knex, userIds) {
  const disabilitiesWithUsers = await knex('disabilities_to_users')
    .select([
      'disabilities.id',
      'disabilities.name',
      'disabilities.is_disabled as isDisabled',
      'disabilities_to_users.user_id as userId',
    ])
    .leftJoin('disabilities', 'disabilities.id', 'disabilities_to_users.disability_id')
    .whereIn('disabilities_to_users.user_id', userIds);

  return disabilitiesWithUsers;
}

async function deleteDisabilitiesOfUser(knex, userId) {
  return knex('disabilities_to_users')
    .where('user_id', '=', userId)
    .del();
}

module.exports = {
  insert,
  findDisabilitiesWithUsers,
  deleteDisabilitiesOfUser,
};
