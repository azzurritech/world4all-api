const { makeExecutableSchema } = require('@graphql-tools/schema');
const { applyMiddleware } = require('graphql-middleware');

const { resolvers } = require('./picture.resolvers');
const { api, types } = require('./picture.schema');
const { dateScalars } = require('../../common/date-scalars');
const { types: commonTypes } = require('../common/common.schema');
const picturePermissions = require('./picture.permission');
const { checkPermissions } = require('../../permissions/check-permission');

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
  schema: applyMiddleware(
    schema,
    checkPermissions(picturePermissions),
  ),
};
