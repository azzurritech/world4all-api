const { makeExecutableSchema } = require('@graphql-tools/schema');
const { applyMiddleware } = require('graphql-middleware');

const { resolvers } = require('./establishment-typology.resolvers');
const { api, types } = require('./establishment-typology.schema');
const { types: commonTypes } = require('../../common/common.schema');
const establishmentTypologyPermissions = require('./establishment-typology.permissions');
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
    checkPermissions(establishmentTypologyPermissions),
  ),
};
