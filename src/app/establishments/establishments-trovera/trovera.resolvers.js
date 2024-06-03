const { ApolloError } = require('apollo-server-errors');
const Queries = require('./trovera.queries')
const { schemaValidation } = require('../../../common/schema-validation');
const { NOT_FOUND } = require('../../../common/errors');
const {

  deleteTroveraSchema,
  createTroveraSchema,
} = require('./trovera.validators');
const tagsQueries = require('./trovera.queries');

const resolvers = {
  Query: {
    async GetAllTrovera(parent, { Filter }, { knex }) {
      var trovera = []
      var troveraToEstablishment = []

      if (Filter?.idEstablishment) {
        [troveraToEstablishment, trovera] = await Promise.all([Queries.getTroveraByEstablishment(knex, Filter.idEstablishment), Queries.getTrovera(knex)])
        trovera = trovera.filter(item => troveraToEstablishment.some(item2 => item2.id_trovera == item.id))
      } else {
        if (Filter?.getTroveraToEstablishment && Filter?.getTrovera) {
          [troveraToEstablishment, trovera] = await Promise.all([Queries.getTroveraToEstablishment(knex), Queries.getTrovera(knex)])
        }
        else {
          troveraToEstablishment = Filter?.getTroveraToEstablishment ? await Queries.getTroveraToEstablishment(knex) : []
          trovera = Filter?.getTrovera ? Queries.getTrovera(knex) : []
        }
      }
      if (Filter?.idTrovera) {
        trovera = Filter?.getTrovera ? trovera.filter(item => Filter?.idTrovera.includes(item.id)) : []
      }
      if (Filter?.idTroveraToEstablishment) {
        // implements
      }
      troveraToEstablishment = troveraToEstablishment.map(({ id, id_establishment, id_trovera }) => ({ id: id, idEstablishment: id_establishment, idTrovera: id_trovera }))
      return ({ troveraToEstablishment: troveraToEstablishment, trovera: trovera })

    },

  },

  Mutation: {
    async createTrovera(parent, { CreateTroveraInput }, { knex }) {
      var validated = schemaValidation(createTroveraSchema, CreateTroveraInput)
      Queries.createTrovera(knex, validated)
      return { success: true };
    },
    async editTrovera(parent, { EditTroveraInput }, { knex }) {
      //implements      var tags = await tagsQueries.getTags(knex);
      var troveraToEstablishment = EditTroveraInput?.idEstablishment ?
        await Queries.getTroveraByEstablishment(knex, EditTroveraInput.idEstablishment) :
        await Queries.getTagsToEstablishments(knex)

      var insert = EditTroveraInput?.id.filter(tag => !troveraToEstablishment.some(t => t.id_trovera == tag))
      var remove = troveraToEstablishment.filter(tag => !EditTroveraInput?.id.includes(tag.id_trovera))
      console.log(insert, remove, EditTroveraInput.idEstablishment[0])
      insert.map(item => Queries.createTroveraToEstablishment(knex,
        {
          idEstablishment: EditTroveraInput.idEstablishment,
          idTrovera: item
        }
      ))
      remove.map(
        item =>
          Queries.deleteTroveraToEstablishment(knex, {
            idTrovera: item.id_trovera,
            idEstablishment: EditTroveraInput.idEstablishment
          })
      )
      return { success: true };
    },

    async deleteTrovera(parent, { DeleteTroveraInput }, { knex }) {
      var validated = schemaValidation(deleteTroveraSchema, DeleteTroveraInput)
      Queries.deleteTrovera(knex, validated)
      return { success: true };
    },

  },

};

module.exports = { resolvers };
