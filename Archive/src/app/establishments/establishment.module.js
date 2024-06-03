const { makeExecutableSchema } = require('@graphql-tools/schema');
const { applyMiddleware } = require('graphql-middleware');

const { resolvers } = require('./establishment.resolvers');
const { dateScalars } = require('../../common/date-scalars');
const { checkPermissions } = require('../../permissions/check-permission');
const establishmentPermissions = require('./establishment.permissions');
const { api, types: establishmentTypes } = require('./establishment.schema');
const { types: establishmentCategoryTypes } = require('./establishment-categories/establishment-category.schema');
const { types: facilityTypes } = require('../facilities/facility.schema');
const { types: disabilityTypes } = require('../disabilities/disability.schema');
const { types: establishmentAddressTypes } = require('./establishment-addresses/establishment-address.schema');
const { types: establishmentDetailsTypes } = require('./establishment-details/establishment-details.schema');
const { types: commonTypes } = require('../common/common.schema');
const { types: pictureTypes } = require('../pictures/picture.schema');

const schema = makeExecutableSchema({
  typeDefs: [
    dateScalars,
    api,
    establishmentTypes,
    facilityTypes,
    disabilityTypes,
    establishmentCategoryTypes,
    establishmentAddressTypes,
    establishmentDetailsTypes,
    commonTypes,
    pictureTypes,
  ],
  resolvers,
});

module.exports = {
  schema: applyMiddleware(
    schema,
    checkPermissions(establishmentPermissions),
  ),
};
