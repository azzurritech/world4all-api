const Joi = require('joi');

const deleteTroveraSchema = Joi.number().integer().positive()
const deleteTroveraToEstablishmentSchema = Joi.object({
  id: Joi.number().integer().positive()
});
const createTroveraSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(255)
    .trim(),
});


module.exports = {
  createTroveraSchema,
  deleteTroveraSchema,
};
