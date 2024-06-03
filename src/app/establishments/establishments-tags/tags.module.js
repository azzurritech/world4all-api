const { makeExecutableSchema } = require('@graphql-tools/schema');
const { applyMiddleware } = require('graphql-middleware');

const { resolvers } = require('./tags.resolvers');
const { api, types } = require('./tags.schema');
const { types: commonTypes } = require('../../common/common.schema');
const sezioniPermissions = require('./tags.permissions');
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
    checkPermissions(sezioniPermissions),
  ),
};
