async function insert(knex, userId, code) {
  return knex('users_confirmation_registration_codes').insert({
    user_id: userId,
    code,
  });
}

async function findUserByCode(knex, code) {
  const [user] = await knex('users')
    .select(
      'users.id',
    )
    .leftJoin('users_confirmation_registration_codes', 'users_confirmation_registration_codes.user_id', 'users.id')
    .where('code', '=', code);

  if (!user) {
    return null;
  }

  return user;
}

async function drop(knex, userId, code) {
  return knex('users_confirmation_registration_codes')
    .where('user_id', '=', userId)
    .andWhere('code', '=', code)
    .del();
}

module.exports = {
  insert,
  findUserByCode,
  drop,
};
