const { gql } = require('apollo-server');

const types = gql`
  type TypologyAndCategory {
    typologyId: Int!
    name: String!
    category: EstablishmentCategory!
    isDisabled: Boolean!
  }

  type Establishment {
    id: Int!
    name: String!
    phone: String
    email: String
    website: String
    description: String
    details: [Details!]
    address: EstablishmentAddress
    distance: String
    typologiesAndCategories: [TypologyAndCategory]
    disabilities: [Disability!]!
    facilities: [Facility!]!
    isFavorite: Boolean!
    cover: PictureType
    gallery: [PictureType!]
    createdAt: GraphQLDateTime!
    updatedAt: GraphQLDateTime!
		enabled: Boolean!
  }

  input CreateEstablishmentAddressInput {
    country: String!
    city: String!
    street: String!
    buildingNumber: String!
    apartment: String
    lat: Float!
    lng: Float!
  }

  input EditEstablishmentAddressInput {
    country: String
    city: String
    street: String
    buildingNumber: String
    apartment: String
    lat: Float
    lng: Float
  }

  input CreateDetailsInput {
    code: DetailsCode!
    # Mark it required if you need
    description: String
    title: String
    imageId: Int!
  }

  input EditDetailsInput {
    id: Int!
    code: DetailsCode
    description: String
    title: String
    imageId: Int
  }

  input CreateEstablishmentInput {
    name: String!
    phone: String
    website: String
    email: String
    coverId: Int
    # Mark it required if you need
    description: String
    details: [CreateDetailsInput!]
    address: CreateEstablishmentAddressInput!
    disabilityIds: [Int!]!
    facilityIds: [Int!]!
    typologyIds: [Int!]!
  }

  input EstablishmentListInput {
    # Add some filters if you need
    limit: Int!
    offset: Int!
    search: String
    categoryIds: [Int!]
    typologyIds: [Int!]
    tagIds:[Int!]
    disabilityIds: [Int!]
    lat:Float
    lng:Float
    radius: Float
    facilityIds: [Int!]
    order: String
  }

  input EditEstablishmentInput {
    id: Int!
    name: String
    phone: String
    website: String
    email: String
    description: String
    details: [EditDetailsInput!]
    address: EditEstablishmentAddressInput
    coverId: Int
    disabilityIds: [Int!]
    facilityIds: [Int!]
    typologyIds: [Int!]
    pictureIds: [Int!]
  }
  
  input EstablishmentInput {
    id: Int!
    lat: Float
    lng: Float
  }

  input AddCoverPictureInput {
    establishmentId: Int!
    pictureId: Int!
  }

  input AddPicturesToEstablishmentGalleryInput {
    establishmentId: Int!
    pictureIds: [Int!]!
  }
  type EstablishmentResult {
    id: Int!
    success: Boolean!
  }
  input DropEstablishmentPictureInput {
    establishmentId: Int!
    pictureId: Int!
  }
  input EditEstablishmentPictureInput {
    establishmentId: Int!
    pictureId: Int!
    title: String
    description: String
  }
`;

const api = gql`
  type Mutation {
    createEstablishment(establishmentInput: CreateEstablishmentInput!): EstablishmentResult!
    editEstablishment(editEstablishmentInput: EditEstablishmentInput!): Establishment!
    deleteEstablishment(establishmentId: Int!): SuccessResult!
    disableEstablishment(establishmentId: Int!): SuccessResult!
    addPicturesToEstablishmentGallery(addPicturesToEstablishmentGalleryInput: AddPicturesToEstablishmentGalleryInput!): SuccessResult!
    dropPictureFromEstablishmentGallery(dropEstablishmentPictureInput: DropEstablishmentPictureInput!): SuccessResult!
    editEstablishmentGalleryPicture(editEstablishmentPictureInput: EditEstablishmentPictureInput!): SuccessResult!
    addCoverPicture(addCoverPictureInput: AddCoverPictureInput!): SuccessResult!
  }

  type Query {
    establishment(establishmentInput: EstablishmentInput!): Establishment!
    establishmentsList(establishmentListInput: EstablishmentListInput!): [Establishment!]!
  }

`;

module.exports = { types, api };
