const S3 = require('aws-sdk/clients/s3');

const s3 = new S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

const uploadAsync = async (params) => new Promise((resolve, reject) => {
  s3.upload(params, (err, data) => {
    if (err) {
      reject(err);
      return;
    }
    resolve(data);
  });
});

const deleteObjectAsync = async (params) => new Promise((resolve, reject) => {
  s3.deleteObject(params, (err, data) => {
    if (err) {
      reject(err);
      return;
    }

    resolve(data);
  });
});

module.exports = {
  s3,
  uploadAsync,
  deleteObjectAsync,
};
