const { makeExecutableSchema } = require('@graphql-tools/schema');
const { applyMiddleware } = require('graphql-middleware');

const { resolvers } = require('./trovera.resolvers');
const { api, types } = require('./trovera.schema');
const { types: commonTypes } = require('../../common/common.schema');
const troveraPermissions = require('./trovera.permissions');
const { checkPermissions } = require('../../../permissions/check-permission');

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
    checkPermissions(troveraPermissions),
  ),
};
