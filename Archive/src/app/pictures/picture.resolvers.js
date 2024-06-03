const { GraphQLUpload } = require('graphql-upload');
const { ApolloError } = require('apollo-server-errors');

const {
  uploadPicture,
  deletePicture,
  isValidExtension,
  createPictureNameForStorage,
  getPictureNameFromUrl,
} = require('./picture.utils');
const {
  BAD_REQUEST,
  NOT_FOUND,
} = require('../../common/errors');
const { mimeTypes } = require('../../common/mime-types');

const pictureQueries = require('./picture.queries');
const userQueries = require('../users/user.queries');

const resolvers = {
  Upload: GraphQLUpload,

  Query: {},

  Mutation: {
    async uploadPicture(parent, { picture }, { knex, user }) {
      const currentUser = await userQueries.findById(knex, user.userId);

      if (!currentUser) {
        throw new ApolloError(
          'user not found',
          NOT_FOUND.code,
        );
      }
      const uploadResult = await Promise.all(picture.map(async (image) => {
        const {
          createReadStream, filename, mimetype,
        } = await (await image).promise;

        if (!isValidExtension(filename) || !mimeTypes.includes(mimetype)) {
          throw new ApolloError(
            'file not valid',
            BAD_REQUEST.code,
          );
        }

        const stream = createReadStream();
        // TODO: тут поверять длину по чанкам для ограничения файла по размеру
        const newFilename = createPictureNameForStorage(filename, currentUser.id);


        const params = {
          ACL: 'public-read',
          Body: stream,
          Bucket: process.env.S3_PICTURES_BUCKET,
          Key: newFilename,
          ContentType: mimetype,
        };

        // Первый промис - это подсчёт размера по чанкам
        const uploadData = await uploadPicture(params);

        if (!uploadData.Location) {
          throw new ApolloError(
            'url from storage not found',
            NOT_FOUND.code,
          );
        }
        const last = await pictureQueries.findLastInserted(knex);
        const addedPicture = await knex.transaction(async (trx) => {
          await pictureQueries.insert(trx, {
            url: uploadData.Location,
            position: Number(last.id) + 1,
          });
          const {
            id,
            url,
          } = await pictureQueries.findLastInserted(trx);
          return {
            id,
            url,
          };
        });

        return addedPicture;
      }));
      return { uploadPicture: uploadResult };
    },

    async deletePicture(parent, { pictureId }, { knex }) {
      const picture = await pictureQueries.findById(knex, pictureId);

      if (!picture) {
        throw new ApolloError(
          'picture not found',
          NOT_FOUND.code,
        );
      }

      const filename = getPictureNameFromUrl(picture.url);

      const params = {
        Bucket: process.env.S3_PICTURES_BUCKET,
        Key: filename,
      };

      await deletePicture(params);
      await pictureQueries.drop(knex, pictureId);

      return { success: true };
    },
  },
};

module.exports = { resolvers };
