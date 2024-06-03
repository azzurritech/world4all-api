const { makeExecutableSchema } = require('@graphql-tools/schema');
const { applyMiddleware } = require('graphql-middleware');

const { resolvers } = require('./favorites.resolvers');
const { typeResolvers: establishmentResolvers } = require('../establishments/establishment.resolvers');
const { api, types: favoriteTypes } = require('./favorites.schema');
const { dateScalars } = require('../../common/date-scalars');
const { types: establishmentTypes } = require('../establishments/establishment.schema');
const { types: establishmentCategoryTypes } = require('../establishments/establishment-categories/establishment-category.schema');
const { types: facilityTypes } = require('../facilities/facility.schema');
const { types: disabilityTypes } = require('../disabilities/disability.schema');
const { types: establishmentAddressTypes } = require('../establishments/establishment-addresses/establishment-address.schema');
const { types: establishmentDetailsTypes } = require('../establishments/establishment-details/establishment-details.schema');
const { types: pictureTypes } = require('../pictures/picture.schema');
const favoritesPermissions = require('./favorites.permissions');
const { checkPermissions } = require('../../permissions/check-permission');

const schema = makeExecutableSchema({
  typeDefs: [
    api,
    favoriteTypes,
    dateScalars,
    establishmentTypes,
    establishmentCategoryTypes,
    facilityTypes,
    disabilityTypes,
    establishmentAddressTypes,
    establishmentDetailsTypes,
    pictureTypes,
  ],
  resolvers: {
    ...resolvers,
    ...establishmentResolvers,
  },
});

module.exports = {
  schema: applyMiddleware(
    schema,
    checkPermissions(favoritesPermissions),
  ),
};
