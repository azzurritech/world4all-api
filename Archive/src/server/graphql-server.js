// const inspector = require('@inspector-apm/inspector-nodejs')({
//   ingestionKey: 'd4227ca265134edb39c8b2a0a0f8e05a19aec322'
// })
const http = require('http');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { ApolloError } = require('apollo-server-errors');
const { graphqlUploadExpress } = require('graphql-upload');
const bodyParser = require('body-parser');
const { mergeSchemas } = require('@graphql-tools/schema');
// const inpMdl = require('./inspector.js');
const knex = require('../mysql/knex');
const userQueries = require('../app/users/user.queries');
const { createLogger } = require('../logger/logger');
const { decodeToken } = require('../app/auth/auth.utils');
const { UNAUTHORIZED } = require('../common/errors');

const authModule = require('../app/auth/auth.module');
const userModule = require('../app/users/user.module');
const facilityModule = require('../app/facilities/facility.module');
const disabilityModule = require('../app/disabilities/disability.module');
const establishmentModule = require('../app/establishments/establishment.module');
const establishmentCategoryModule = require('../app/establishments/establishment-categories/establishment-category.module');
const establishmentTypologyModule = require('../app/establishments/establishments-typologies/establishment-typology.module');
const tagsModule = require('../app/establishments/establishments-tags/tags.module');

const establishmentDetailsModule = require('../app/establishments/establishment-details/establishment-details.module');
const favoriteModule = require('../app/favorites/favorites.module');
const pictureModule = require('../app/pictures/picture.module');

const test = require("../api/user/profile/router.js")

const { createUserAddressDataLoader } = require('../app/users/user-addresses/user-address.dataloader');
const {
  createUserDisabilityLoader,
  createEstablishmentDisabilityLoader,
} = require('../app/disabilities/disability.dataloaders');
const {
  createUserFacilityLoader,
  createEstablishmentFacilityLoader,
} = require('../app/facilities/facility.dataloaders');
const { createEstablishmentAddressDataLoader } = require('../app/establishments/establishment-addresses/establishment-address.dataloader');
const { createEstablishmentDetailsDataLoader } = require('../app/establishments/establishment-details/establishment-details.dataloader');
const { createEstablishmentTypologiesWithCategoriesLoader } = require('../app/establishments/establishments-typologies/establishment-typology.dataloaders');
const {
  createFavoriteLoader,
  createFavoriteEstablishmentLoader,
} = require('../app/favorites/favorite.dataloaders');
const { createEstablishmentPictureLoader } = require('../app/pictures/picture.dataloaders');
const troveraModule = require('../app/establishments/establishments-trovera/trovera.module');

const logger = createLogger({
  moduleName: 'graphql_server',
});

async function startApolloServer() {
  const app = express();

  // app.use(inpMdl(inspector,{}))

  app.use(graphqlUploadExpress());

  app.use(authModule.router);

  app.use(bodyParser.json({ limit: "50mb" }));

  app.use(test);

  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    schema: mergeSchemas({
      schemas: [
        authModule.schema,
        userModule.schema,
        facilityModule.schema,
        disabilityModule.schema,
        establishmentModule.schema,
        establishmentCategoryModule.schema,
        establishmentTypologyModule.schema,
        establishmentDetailsModule.schema,
        favoriteModule.schema,
        pictureModule.schema,
        tagsModule.schema,
        troveraModule.schema,
      ],
    }),
    context: async ({ req }) => {
      // Add all entities or fields you want
      const ctx = {
        user: null,
        knex,
      };

      if (!req.headers.authorization) {
        ctx.user = null;
      } else {
        try {
          const jwt = decodeToken(req.headers.authorization);

          if (!jwt.userId) {
            throw new ApolloError(
              'user unauthorized',
              UNAUTHORIZED.code,
            );
          }

          const user = await userQueries.findUserWithAvatar(knex, jwt.userId);

          if (!user) {
            throw new ApolloError(
              'user unauthorized',
              UNAUTHORIZED.code,
            );
          }

          const { id, role } = user;

          ctx.user = {
            userId: id,
            role,
          };
        } catch (error) {
          logger.error({
            message: 'Error in adding token to context',
            error,
          });
        }
      }

      return {
        ...ctx,
        req,
        knex,
        dataloaders: {
          userAddresses: createUserAddressDataLoader(knex),
          userDisabilities: createUserDisabilityLoader(knex),
          userFacilities: createUserFacilityLoader(knex),
          establishmentAddress: createEstablishmentAddressDataLoader(knex),
          establishmentDetails: createEstablishmentDetailsDataLoader(knex),
          establishmentDisabilities: createEstablishmentDisabilityLoader(knex),
          establishmentFacilities: createEstablishmentFacilityLoader(knex),
          establishmentTypologiesAndCategories:
            createEstablishmentTypologiesWithCategoriesLoader(knex),
          isFavorite: createFavoriteLoader(knex),
          picture: createEstablishmentPictureLoader(knex),
          favoriteList: createFavoriteEstablishmentLoader(knex),
        },
      };
    },
  });

  await server.start();

  server.applyMiddleware({
    app,
    path: '/graphql',
  });

  await new Promise((resolve) => {
    httpServer.listen({ port: process.env.PORT }, undefined, () => {
      resolve(null);
    });
  });

  logger.info({
    message: `🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`,
  });
}

module.exports = { startApolloServer };
