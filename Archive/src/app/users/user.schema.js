const { gql } = require('apollo-server');

const types = gql`
  enum UserRoles {
    ADMIN
    STANDARD
  }

  type User {
    id: Int!
    firstName: String!
    lastName: String!
    email: String!
    dateBirth: GraphQLDate!
    phone: String!
    accompanied: Boolean
    role: UserRoles!
    avatar: PictureType
    createdAt: GraphQLDateTime!
    updatedAt: GraphQLDateTime!
    isActive: Boolean!
    enabled: Boolean!
    address: UserAddress
    disabilities: [Disability!]!
    facilities: [Facility!]!
  }

  type UserDataForAdmin {
    id: Int!
    firstName: String!
    lastName: String!
    email: String!
    dateBirth: GraphQLDate!
    phone: String!
    accompanied: Boolean
    role: UserRoles!
    avatar: PictureType
    createdAt: GraphQLDateTime!
    updatedAt: GraphQLDateTime!
    isActive: Boolean!
		enabled: Boolean!
    address: UserAddress
    disabilities: [Disability!]!
    facilities: [Facility!]!
    favoriteList: [Establishment!]
  }

  input EditUserAddressInput {
    id: Int!
    country: String
    city: String
    street: String
    buildingNumber: String
    apartment: String
  }

  input EditUserInput {
    firstName: String
    lastName: String
    email: String
    password: String
    dateBirth: GraphQLDate
    phone: String
    accompanied: Boolean
    avatarId: Int
    address: EditUserAddressInput
    disabilityIds: [Int!]
    facilityIds: [Int!]
  }

  input EditUserByAdminInput {
    userId: Int!
    firstName: String
    lastName: String
    dateBirth: GraphQLDate
    phone: String
    accompanied: Boolean
    avatarId: Int
    isActive: Boolean
    role: UserRoles
    address: EditUserAddressInput
    disabilityIds: [Int!]
    facilityIds: [Int!]
  }

  input UsersListInput {
    # Add some filters if you need
    limit: Int!
    offset: Int!
  }
`;

const api = gql`
  type Mutation {
    editUser(editUserInput: EditUserInput!): User!

    editUserByAdmin(editUserByAdminInput: EditUserByAdminInput!): UserDataForAdmin!

    deactivateUser(userId: Int!): SuccessResult!

    disableUser(userId: Int!): SuccessResult!
		
		deleteUser(userId: Int!): SuccessResult!
  }

  type Query {
    me: User!

    getUser(userId: Int!): UserDataForAdmin!

    activeUsersList(activeUsersListInput: UsersListInput!): [User!]!

    allUsers(usersListInput: UsersListInput!): [User!]!
  }
`;

module.exports = { types, api };
