const Joi = require('joi');

const createTypologySchema = Joi.object({
  categoryId: Joi.number().integer().positive(),

  name: Joi.string()
    .min(2)
    .max(255)
    .trim(),
});

const editTypologySchema = Joi.object({
  id: Joi.number().integer().positive(),

  categoryId: Joi.number().integer().positive(),

  name: Joi.string()
    .min(2)
    .max(255)
    .trim(),

  isDisabled: Joi.boolean(),
});

module.exports = {
  createTypologySchema,
  editTypologySchema,
};
