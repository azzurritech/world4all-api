const { makeExecutableSchema } = require('@graphql-tools/schema');
const { applyMiddleware } = require('graphql-middleware');

const authPermissions = require('./auth.permissions');
const { checkPermissions } = require('../../permissions/check-permission');
const { resolvers } = require('./auth.resolvers');
const { api, types } = require('./auth.schema');
const { dateScalars } = require('../../common/date-scalars');
const { types: commonTypes } = require('../common/common.schema');
const router = require('./auth.router');

const schema = makeExecutableSchema({
  typeDefs: [
    dateScalars,
    api,
    types,
    commonTypes,
  ],
  resolvers,
});

module.exports = {
  router,
  schema: applyMiddleware(
    schema,
    checkPermissions(authPermissions),
  ),
};
