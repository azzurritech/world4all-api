const { createHash } = require('crypto');

const {
  uploadAsync,
  deleteObjectAsync,
} = require('../../s3/s3');
const { createLogger } = require('../../logger/logger');
const { pictureExtentions } = require('../../common/mime-types');

const logger = createLogger({
  moduleName: 'pictures',
});

const uploadPicture = async (params) => {
  try {
    const data = await uploadAsync(params);

    return data;
  } catch (error) {
    logger.error({
      message: 'Error while picture uploading',
      error,
    });

    throw error;
  }
};

const deletePicture = async (params) => {
  try {
    const data = await deleteObjectAsync(params);

    return data;
  } catch (error) {
    logger.error({
      message: 'Error while picture deleting',
      error,
    });

    throw error;
  }
};

const isValidExtension = (filename) => {
  const extension = filename.split('.').pop();
  return pictureExtentions.includes(extension);
};

const createPictureNameForStorage = (currentFilename, userId) => {
  const fileExtension = currentFilename.split('.').slice(-1)[0];

  const hashedFilename = createHash('sha256').update(currentFilename, 'utf8').digest('hex');
  return `${userId}_${Date.now()}_${hashedFilename}.${fileExtension}`;
};

const getPictureNameFromUrl = (imageUrl) => {
  const urlParts = imageUrl.split('/');

  const filename = urlParts[(urlParts.length - 1)];

  return filename;
};

module.exports = {
  uploadPicture,
  deletePicture,
  isValidExtension,
  createPictureNameForStorage,
  getPictureNameFromUrl,
};
