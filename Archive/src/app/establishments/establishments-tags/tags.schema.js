const { gql } = require('apollo-server');

const types = gql`
  type EstablishmentTypology {
    id: Int!
    name: String!
    categoryId: Int!
    isDisabled: Boolean!
  }
  type tag {
    idTag: Int!
    idCategoria: Int!
    idSezione: Int!
    name: String
  }
  type sezione {
    name: String
    idSezione: Int
  }
  type categorie{
    name: String
    idCategoria: Int
  }
  type tagToEstablishment {
    idTagEstablishment: Int!
    idTag: Int!
    idEstablishment:Int!
  }
  input CreateTagInput {
    idCategoria: Int!
    name: String!
    idSezione: Int!
  }
  input DeleteTagInput {
    idTag: Int!
  }
  input DeleteTagEstablishmentInput {
    idTagEstablishment: Int!
  }
  input EditTagEstablishmentInput{
    idEstablishment: Int!
    idTag:[Int]
    idSezione: Int
    idCategoria: [Int]
  }
  type allTagsAndFields{
    categorie:[categorie]!
    sezioni: [sezione]!
    tags: [tag]
    tagToEstablishment: [tagToEstablishment]
  }
  input filter{
    idCategoria:[Int]
    idSezione: Int
    idTag: Int
    idEstablishment: Int
  }
`;

const api = gql`
  type Mutation {
    createTag(CreateTagInput: CreateTagInput!): SuccessResult!
    editTagEstablishment(EditTagEstablishmentInput: EditTagEstablishmentInput!): SuccessResult!
    deleteTag(DeleteTagInput: Int!): SuccessResult!

  }

  type Query {
    GetAllTagsAndFields(Filter: filter!): allTagsAndFields
  }
`;

module.exports = { types, api };
