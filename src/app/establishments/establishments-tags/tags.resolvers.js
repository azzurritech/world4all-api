const { ApolloError } = require('apollo-server-errors');

const { schemaValidation } = require('../../../common/schema-validation');
const { NOT_FOUND } = require('../../../common/errors');
const {
  createTagSchema,
  deleteTagSchema,
} = require('./tags.validators');
const tagsQueries = require('./tags.queries');

const resolvers = {
  Query: {
    async GetAllTagsAndFields(parent, { Filter }, { knex }) {
      var categorie = await tagsQueries.getCategorie(knex);
      var sezioni = await tagsQueries.getSezione(knex);
      var tags = await tagsQueries.getTags(knex);
      var tags_to_establishments = Filter?.idEstablishment ?
        await tagsQueries.getTagsToEstablishmentsById(knex, Filter.idEstablishment) :
        await tagsQueries.getTagsToEstablishments(knex)
      tags = tags?.filter(
        tag =>
          ((Filter?.idCategoria?.includes(tag.idcategoria) || !Filter.idCategoria) &&
            (tag.idsezione == Filter.idSezione || !Filter.idSezione) &&
            (tag.idtag == Filter.idTag || !Filter.idTag) &&
            (!Filter.idEstablishment || tags_to_establishments?.some(tagTo => (tagTo.idtag == tag.idtag)))) ?
            true : false
      )
      tags = tags?.map(tag => ({
        idTag: tag.idtag,
        idCategoria: tag.idcategoria,
        idSezione: tag.idsezione,
        name: tag.name
      }))
      tags_to_establishments = tags_to_establishments?.map(tag => ({
        idTagEstablishment: tag.idtagestablishment,
        idTag: tag.idtag,
        idEstablishment: tag.idestablishment,
      }))
      sezioni = sezioni?.map(sezione => ({ idSezione: sezione.idsezione, name: sezione.name }))
      categorie = categorie?.map(categoria => ({ name: categoria.name, idCategoria: categoria.id }))

      return { categorie: categorie, sezioni: sezioni, tags: tags, tagToEstablishment: tags_to_establishments }
    },

  },

  Mutation: {
    async createTag(parent, { CreateTagInput }, { knex }) {
      await tagsQueries.createTag(knex, CreateTagInput);

      return { success: true };
    },
    async editTagEstablishment(parent, { EditTagEstablishmentInput }, { knex }) {
      var tags = await tagsQueries.getTags(knex);
      var tags_to_establishments = EditTagEstablishmentInput?.idEstablishment ?
        await tagsQueries.getTagsToEstablishmentsById(knex, EditTagEstablishmentInput.idEstablishment) :
        await tagsQueries.getTagsToEstablishments(knex)
      console.log(EditTagEstablishmentInput)

      tags = tags?.filter(
        tag =>
          ((EditTagEstablishmentInput?.idCategoria?.includes(tag.idcategoria) || !EditTagEstablishmentInput.idCategoria) &&
            (tag.idsezione == EditTagEstablishmentInput.idSezione || !EditTagEstablishmentInput.idSezione) &&
            (!EditTagEstablishmentInput.idEstablishment || tags_to_establishments?.some(tagTo => (tagTo.idtag == tag.idtag)))) ?
            true : false
      )

      var insert = EditTagEstablishmentInput?.idTag.filter(tag => !tags.some(t => t.idtag == tag))
      var remove = tags.filter(tag => !EditTagEstablishmentInput?.idTag.includes(tag.idtag)).map(tag => tag.idtag)
      insert.map(item => tagsQueries.insert(knex,
        {
          idEstablishment: EditTagEstablishmentInput.idEstablishment,
          idTag: item
        }
      ))
      remove.map(
        item =>
          tagsQueries.deleteTagEstablishment(knex, {
            idTag: item,
            idEstablishment: EditTagEstablishmentInput.idEstablishment
          })
      )
      return { success: true };
    },

    async deleteTag(parent, { DeleteTagInput }, { knex }) {
      await tagsQueries.deleteTag(knex, DeleteTagInput)
      return { success: true };

    },

  },

};

module.exports = { resolvers };
