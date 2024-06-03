
async function createTrovera(knex, { name }) {
  return knex('trovera').insert({ name: name })
}
async function createTroveraToEstablishment(knex, { idTrovera, idEstablishment }) {
  return knex('trovera_to_establishments').insert({ id_trovera: idTrovera, id_establishment: idEstablishment })
}
async function getTroveraToEstablishment(knex) {
  return knex('trovera_to_establishments').select('id', 'id_trovera', 'id_establishment')
}
async function getTrovera(knex) {
  return knex('trovera').select('id', 'name')
}
async function getTroveraByEstablishment(knex, idEstablishment) {
  return knex('trovera_to_establishments').select('id', 'id_trovera', 'id_establishment').whereIn('id_establishment', idEstablishment)
}
async function deleteTroveraToEstablishment(knex, tagData) {
  return knex('trovera_to_establishments').where('id_trovera', '=', tagData.idTrovera).where('id_establishment', '=', tagData.idEstablishment).del()
}
async function deleteTrovera(knex, id) {
  return knex('trovera_to_establishments').where('id_trovera', '=', id).del().then(ret => knex('trovera').where('id', '=', id).del())

}

module.exports = {
  createTrovera,
  getTroveraToEstablishment,
  getTrovera,
  getTroveraByEstablishment,
  deleteTrovera,
  deleteTroveraToEstablishment,
  createTroveraToEstablishment
};
