const { makeExecutableSchema } = require('@graphql-tools/schema');
const { applyMiddleware } = require('graphql-middleware');

const { resolvers } = require('./establishment-cities.resolvers');
const { api, types } = require('./establishment-cities.schema');
const { types: commonTypes } = require('../../common/common.schema');
const establishmentCitiesPermissions = require('./establishment-cities.permissions');
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
    checkPermissions(establishmentCitiesPermissions),
  ),
};
