const Joi = require('joi');

const createEstablishmentDetails = Joi.object({
  code: Joi.string().max(255),
  title: Joi.string().max(255),
  description: Joi.string().max(1000),
  imageId: Joi.number().integer().positive(),
});

const editEstablishmentDetails = Joi.object({
  id: Joi.number().integer().positive(),
  code: Joi.string().max(255),
  title: Joi.string().max(255),
  description: Joi.string().max(1000),
  imageId: Joi.number().integer().positive(),
});

const createEstablishmentSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(255),

  phone: Joi.string()
    // Fix it if you need
    .min(3)
    .max(20)
    .pattern(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/)
    .allow('')
    .optional(),

  email: Joi.string()
    .email()
    .trim()
    .allow('')
    .optional(),

  website: Joi.string()
    .uri()
    .allow('')
    .optional(),

  description: Joi.string()
    .min(2)
    .max(1000),

  address: Joi.object().keys({
    country: Joi.string().max(255),
    city: Joi.string().max(255),
    street: Joi.string().max(255),
    buildingNumber: Joi.string().max(255),
    apartment: Joi.string().max(255).allow('').optional(),
    lat: Joi.number(),
    lng: Joi.number(),
  }),

  details: Joi.array().items(createEstablishmentDetails),

  typologyIds: Joi.array().items(Joi.number().integer().positive()),

  disabilityIds: Joi.array().items(Joi.number().integer().positive()),

  facilityIds: Joi.array().items(Joi.number().integer().positive()),

  coverId: Joi.number().integer().positive(),
});

const editEstablishmentSchema = Joi.object({
  id: Joi.number().integer().positive(),

  name: Joi.string()
    .min(2)
    .max(255),

  phone: Joi.string()
    // Fix it if you need
    .min(3)
    .max(20)
    .pattern(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/)
    .allow('')
    .optional(),

  website: Joi.string()
    .uri()
    .allow('')
    .optional(),

  email: Joi.string()
    .email()
    .trim()
    .allow('')
    .optional(),

  description: Joi.string()
    .min(2)
    .max(1000),

  details: Joi.array().items(editEstablishmentDetails),

  // Update it if you need
  address: Joi.object().keys({
    country: Joi.string().min(1).max(255),
    city: Joi.string().min(1).max(255),
    street: Joi.string().min(1).max(255),
    buildingNumber: Joi.string().max(255),
    apartment: Joi.string().max(255).allow('').optional(),
    lat: Joi.number(),
    lng: Joi.number(),
  }).optional(),

  coverId: Joi.number().integer().positive(),

  typologyIds: Joi.array().items(Joi.number().integer().positive()),

  disabilityIds: Joi.array().items(Joi.number().integer().positive()),

  facilityIds: Joi.array().items(Joi.number().integer().positive()),

  pictureIds: Joi.array().items(Joi.number().integer().positive()),
});

const establishmentsListSchema = Joi.object({
  limit: Joi.number().integer().positive(),
  lat: Joi.number().positive(),
  lng: Joi.number().positive(),
  radius: Joi.number().positive(),
  offset: Joi.number().integer().positive().allow(0),
  search: Joi.string().optional().allow('').min(3).max(255),
  categoryIds: Joi.array().items(Joi.number().integer().positive()),
  typologyIds: Joi.array().items(Joi.number().integer().positive()),
  disabilityIds: Joi.array().items(Joi.number().integer().positive()),
  facilityIds: Joi.array().items(Joi.number().integer().positive()),
  order: Joi.string().valid('desc', 'asc').optional(),
  tagIds: Joi.array().items(Joi.number().integer().positive())
});

const establishmentSchema = Joi.object({
  id: Joi.number().integer().positive(),
  lat: Joi.number().optional(),
  lng: Joi.number().optional(),
});

module.exports = {
  createEstablishmentSchema,
  editEstablishmentSchema,
  establishmentsListSchema,
  establishmentSchema
};
