const { gql } = require('apollo-server');

const types = gql`
  scalar Upload

  type SuccessResult { success: Boolean! }
`;

module.exports = { types };
