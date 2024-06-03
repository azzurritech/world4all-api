const { gql } = require('apollo-server');

const types = gql`
  type trovera {
    id: ID!
    name: String!
  }
  type troveraToEstablishment {
    id: ID!
    idTrovera: Int!
    idEstablishment:Int!
  }
  input CreateTroveraInput {
    name: String!
  }
  input EditTroveraInput{
    id:[Int]
    idEstablishment: [Int]
  }
  type allTroveraEstablishment{
    trovera: [trovera]
    troveraToEstablishment: [troveraToEstablishment]
  }
  input Filter{
    idEstablishment: [Int]
    idTrovera: [Int]
    idTroveraToEstablishment: [Int]
    getTrovera: Boolean
    getTroveraToEstablishment:Boolean
  }
`;

const api = gql`
  type Mutation {
    createTrovera(CreateTroveraInput: CreateTroveraInput!): SuccessResult!
    editTrovera(EditTroveraInput: EditTroveraInput!): SuccessResult!
    deleteTrovera(DeleteTroveraInput: Int!): SuccessResult!
  }
  type Query {
    GetAllTrovera(Filter: Filter): allTroveraEstablishment
  }
`;

module.exports = { types, api };
