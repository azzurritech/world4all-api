const Joi = require('joi');

const addEstablishmentDetailsSchema = Joi.array().items(
  Joi.object({
    code: Joi.string().max(255),
    title: Joi.string().max(255),
    description: Joi.string().max(1000),
    imageId: Joi.number().integer().positive(),
  }),
);

module.exports = {
  addEstablishmentDetailsSchema,
};
