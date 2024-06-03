const Joi = require('joi');

const favoriteListSchema = Joi.object({
  limit: Joi.number().integer().positive(),
  offset: Joi.number().integer().positive().allow(0),
});

module.exports = {
  favoriteListSchema,
};
