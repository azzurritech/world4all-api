const Joi = require('joi');

const signUpUserSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(255),

  lastName: Joi.string()
    .min(1)
    .max(255),

  phone: Joi.string()
  // Fix it if you need
    .min(3)
    .max(20)
    .pattern(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/),

  email: Joi.string()
    .trim()
    .email(),

  password: Joi.string()
    .alphanum()
    .min(6)
    .max(255)
    .trim(),

  dateBirth: Joi.date(),
  accompanied: Joi.bool().optional(),

  address: Joi.object().keys({
    country: Joi.string().max(255),
    city: Joi.string().max(255),
    street: Joi.string().max(255),
    buildingNumber: Joi.string().max(255),
    apartment: Joi.string().max(255),
  }),

  disabilityIds: Joi.array().items(Joi.number().integer().positive()),

  facilityIds: Joi.array().items(Joi.number().integer().positive()),
});

const signInSchema = Joi.object({
  login: Joi.string()
    .email()
    .trim(),

  password: Joi.string()
    .alphanum()
    .min(6)
    .max(255)
    .trim(),
});

const requestResetPasswordSchema = Joi.object({
  email: Joi.string()
    .email()
    .trim(),
});

const changePasswordSchema = Joi.object({
  code: Joi.string(),

  password: Joi.string()
    .alphanum()
    .min(6)
    .max(255)
    .trim(),
});

module.exports = {
  signInSchema,
  signUpUserSchema,
  requestResetPasswordSchema,
  changePasswordSchema,
};
