const { makeExecutableSchema } = require('@graphql-tools/schema');
const { applyMiddleware } = require('graphql-middleware');

const { resolvers } = require('./establishment-category.resolvers');
const { api, types } = require('./establishment-category.schema');
const { types: commonTypes } = require('../../common/common.schema');
const establishmentCategoryPermissions = require('./establishment-category.permissions');
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
    checkPermissions(establishmentCategoryPermissions),
  ),
};
