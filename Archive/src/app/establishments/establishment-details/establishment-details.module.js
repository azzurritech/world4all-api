const { makeExecutableSchema } = require('@graphql-tools/schema');
const { applyMiddleware } = require('graphql-middleware');

const establishmentDetailsPermissions = require('./establishment-details.permissions');
const { checkPermissions } = require('../../../permissions/check-permission');
const { resolvers } = require('./establishment-details.resolvers');
const { api, types } = require('./establishment-details.schema');
const { dateScalars } = require('../../../common/date-scalars');
const { types: commonTypes } = require('../../common/common.schema');
const { types: pictureTypes } = require('../../pictures/picture.schema');

const schema = makeExecutableSchema({
  typeDefs: [
    dateScalars,
    api,
    types,
    commonTypes,
    pictureTypes,
  ],
  resolvers,
});

module.exports = {
  schema: applyMiddleware(
    schema,
    checkPermissions(establishmentDetailsPermissions),
  ),
};
