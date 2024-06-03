const { makeExecutableSchema } = require('@graphql-tools/schema');
const { applyMiddleware } = require('graphql-middleware');
const { resolvers } = require('./user.resolvers');
const { api, types: userTypes } = require('./user.schema');
const userPermissions = require('./user.permissions');
const { dateScalars } = require('../../common/date-scalars');
const { checkPermissions } = require('../../permissions/check-permission');
const { types: userAddressesTypes } = require('./user-addresses/user-address.schema');
const { types: facilityTypes } = require('../facilities/facility.schema');
const { types: disabilityTypes } = require('../disabilities/disability.schema');
const { types: commonTypes } = require('../common/common.schema');
const { types: pictureTypes } = require('../pictures/picture.schema');
const { types: establishmentTypes } = require('../establishments/establishment.schema');
const { types: establishmentAddressTypes } = require('../establishments/establishment-addresses/establishment-address.schema');
const { types: establishmentDetailsTypes } = require('../establishments/establishment-details/establishment-details.schema');
const { types: establishmentCategoryTypes } = require('../establishments/establishment-categories/establishment-category.schema');

const schema = makeExecutableSchema({
  typeDefs: [
    dateScalars,
    api,
    userTypes,
    userAddressesTypes,
    facilityTypes,
    disabilityTypes,
    commonTypes,
    pictureTypes,
    establishmentTypes,
    establishmentAddressTypes,
    establishmentDetailsTypes,
    establishmentCategoryTypes,
  ],
  resolvers,
});

module.exports = {
  schema: applyMiddleware(
    schema,
    checkPermissions(userPermissions),
  ),
};
