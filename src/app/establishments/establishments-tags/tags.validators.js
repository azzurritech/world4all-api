const Joi = require('joi');

const deleteTagSchema = Joi.object({
  idTagEstablishment: Joi.number().integer().positive()
});

const createTagSchema = Joi.object({
  idCategoria: Joi.number().integer().positive(),
  idSezione: Joi.number().integer().positive(),
  name: Joi.string()
    .min(2)
    .max(255)
    .trim(),
});


module.exports = {
  createTagSchema,
  deleteTagSchema,
};
