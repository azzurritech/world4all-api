const establishmentCategoryQueries = require('../establishment-categories/establishment-category.queries');

async function insert(knex, tagData) {
  return knex('tag_to_establishment').insert(
    {
      idestablishment: tagData.idEstablishment,
      idtag: tagData.idTag
    }
  )
}
async function getTagsToEstablishments(knex) {
  return knex('tag_to_establishment').select('idtagestablishment', 'idtag', 'idestablishment')
}
async function getTags(knex) {
  return knex('tags').select('idtag', 'idcategoria', 'idsezione', 'name')
}
async function getTagByIdsToEstablishments(knex, idtag) {
  return knex('tag_to_establishment').select('idtagestablishment', knex.raw('SUM(idtag) as sum'), 'idestablishment').whereIn('idtag', idtag).groupBy('idestablishment')
}
async function getTagsCategorieAndSezione(knex, tagData) {
  return knex('tags').select('idtag', 'idcategoria', 'idsezione', 'name').where('idcategoria', '=', tagData.idCategoria).where('idsezione', '=', tagData.idSezione)
}
async function getTagsToEstablishmentsById(knex, idestablishment) {
  return knex('tag_to_establishment').select('idtagestablishment', 'idtag', 'idestablishment').where('idestablishment', '=', idestablishment)
}
async function getCategorie(knex) {
  return establishmentCategoryQueries.findAllActive(knex)
}
async function getSezione(knex) {
  return knex('sezioni').select('idsezione', 'name')
}
async function deleteTagEstablishment(knex, tagData) {
  return knex('tag_to_establishment').where('idtag', '=', tagData.idTag).where('idestablishment', '=', tagData.idEstablishment).del()
}
async function deleteTag(knex, idtag) {
  return knex('tag_to_establishment').where('idtag', '=', idtag).del().then(ret => knex('tags').where('idtag', '=', idtag).del())

}
async function createTag(knex, tagData) {
  return knex('tags').insert(
    {
      idcategoria: tagData.idCategoria,
      idsezione: tagData.idSezione,
      name: tagData.name
    }
  )
}
module.exports = {
  insert,
  getTagsToEstablishments,
  getTags,
  getSezione,
  getCategorie,
  deleteTag,
  getTagByIdsToEstablishments,
  getTagsToEstablishmentsById,
  deleteTagEstablishment,
  createTag,
  getTagsCategorieAndSezione

};
