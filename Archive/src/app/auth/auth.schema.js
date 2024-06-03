const { gql } = require('apollo-server');

const types = gql`
  input AddressInput {
    country: String!
    city: String!
    street: String!
    buildingNumber: String!
    apartment: String
  }

  input SignUpInput {
    firstName: String!
    lastName: String!
    phone: String!
    email: String!
    password: String!
    # Use this format 1990-05-29
    dateBirth: GraphQLDate!
    accompanied: Boolean
    address: AddressInput!
    disabilityIds: [Int!]!
    facilityIds: [Int!]!
  }

  input SignInInput {
    login: String!
    password: String!
  }

  type SignInResult {
    jwtToken: String!
  }

  input ChangePasswordInput {
    code: String!
    password: String!
  }

  input RequestResetPasswordInput {
    email: String!
  }
`;

const api = gql`
  type Mutation {
    signUp(signUpInput: SignUpInput!): SuccessResult!

    signIn(signInInput: SignInInput!): SignInResult!

    requestResetPassword(requestResetPasswordInput: RequestResetPasswordInput!): SuccessResult!

    changePassword(changePasswordInput: ChangePasswordInput!): SuccessResult!
  }

  type Query {
    _empty: Int
  }
`;

module.exports = { api, types };
