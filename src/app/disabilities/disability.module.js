const { makeExecutableSchema } = require('@graphql-tools/schema');
const { applyMiddleware } = require('graphql-middleware');

const { resolvers } = require('./disability.resolvers');
const { api, types } = require('./disability.schema');
const { types: commonTypes } = require('../common/common.schema');
const facilityPermissions = require('./disability.permissions');
const { checkPermissions } = require('../../permissions/check-permission');

const schema = makeExecutableSchema({
  typeDefs: [
    api,
    types,
    commonTypes,
  ],
  resolvers,
});

module.exports = {
  schema: applyMiddleware(
    schema,
    checkPermissions(facilityPermissions),
  ),
};
