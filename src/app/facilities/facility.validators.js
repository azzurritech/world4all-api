const Joi = require('joi');

const createFacilitySchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(255)
    .trim(),
});

const editFacilitySchema = Joi.object({
  id: Joi.number().integer().positive(),

  name: Joi.string()
    .min(2)
    .max(255)
    .trim(),

  isDisabled: Joi.boolean(),
  image_id: Joi.number().integer().positive().allow(null, ''),
});

module.exports = {
  createFacilitySchema,
  editFacilitySchema,
};
