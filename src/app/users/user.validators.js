const Joi = require('joi');

const editUserSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(255),

  lastName: Joi.string()
    .min(1)
    .max(255),

  email: Joi.string()
    .email()
    .trim(),

  password: Joi.string()
    .alphanum()
    .min(6)
    .max(255)
    .trim(),

  dateBirth: Joi.date(),

  phone: Joi.string()
  // Fix it if you need
    .min(3)
    .max(20)
    .pattern(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/),

  accompanied: Joi.bool().optional(),

  avatarId: Joi.number().integer().positive(),

  address: Joi.object().keys({
    id: Joi.number().integer().positive(),
    country: Joi.string().min(1).max(255),
    city: Joi.string().min(1).max(255),
    street: Joi.string().min(1).max(255),
    buildingNumber: Joi.string().max(255),
    apartment: Joi.string().max(255),
  }),

  disabilityIds: Joi.array().items(Joi.number().integer().positive()),

  facilityIds: Joi.array().items(Joi.number().integer().positive()),
});

const editUserByAdminSchema = Joi.object({
  userId: Joi.number().integer().positive(),

  firstName: Joi.string()
    .min(2)
    .max(255),

  lastName: Joi.string()
    .min(1)
    .max(255),

  dateBirth: Joi.date(),

  phone: Joi.string()
  // Fix it if you need
    .min(3)
    .max(20)
    .pattern(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/),

  accompanied: Joi.bool().optional(),

  avatarId: Joi.number().integer().positive(),

  isActive: Joi.boolean(),

  role: Joi.string(),

  address: Joi.object().keys({
    id: Joi.number().integer().positive(),
    country: Joi.string().min(1).max(255),
    city: Joi.string().min(1).max(255),
    street: Joi.string().min(1).max(255),
    buildingNumber: Joi.string().max(255),
    apartment: Joi.string().max(255),
  }),

  disabilityIds: Joi.array().items(Joi.number().integer().positive()),

  facilityIds: Joi.array().items(Joi.number().integer().positive()),
});

const usersListSchema = Joi.object({
  limit: Joi.number().integer().positive(),
  offset: Joi.number().integer().positive().allow(0),
});

module.exports = {
  editUserSchema,
  editUserByAdminSchema,
  usersListSchema,
};
