import { check, body, param } from "express-validator";
import Joi from "joi";
import { validateWithJoi } from "../middlewares/joiValidator.js";

export const coinIdSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    "string.guid": "ID must be a valid UUID",
    "any.required": "ID parameter is required",
  }),
});

export const coinCreationSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "Coin name must be a string",
    "string.empty": "Coin name is required",
    "any.required": "Coin name is required",
  }),
  photo_url: Joi.string().uri().optional().messages({
    "string.uri": "A valid photo URL is required",
    "any.required": "Photo URL is required",
  }),
  price: Joi.number().required().messages({
    "number.base": "Price must be a number",
    "any.required": "Price is required",
  }),
  year: Joi.number()
    .integer()
    .min(1700)
    .max(new Date().getFullYear())
    .required()
    .messages({
      "number.base": "Year must be a number",
      "number.min": "Year must be after 1700",
      "number.max": "Year must not be in the future",
      "any.required": "Year is required",
    }),
  currency: Joi.string().required().messages({
    "string.empty": "Currency is required",
    "any.required": "Currency is required",
  }),
  country: Joi.string()
    .valid("Montenegro", "Bulgaria", "Serbia", "Romania", "Greece")
    .required()
    .messages({
      "any.only": "Country must be a valid Balkan country",
      "any.required": "Country is required",
    }),

  monarch: Joi.string().optional(),
  price_value: Joi.string().optional(),
  composition_metal: Joi.string().optional(),
  weight: Joi.string().optional(),
  diameter: Joi.string().optional(),
  shape: Joi.string().optional(),
  technique: Joi.string().optional(),
  denomination: Joi.string().optional(),
  lettering: Joi.string().optional(),
  script: Joi.string().optional(),
  mintage: Joi.number().integer().empty("").optional(),
  mint_place: Joi.string().optional(),
  coin_grading: Joi.string().optional(),
  number: Joi.string().optional(),
});

export const updateCoinSchema = Joi.object({
  name: Joi.string().messages({
    "string.base": "Coin name must be a string",
  }),
  photo_url: Joi.string().uri().messages({
    "string.uri": "A valid photo URL is required",
  }),
  price: Joi.number().messages({
    "number.base": "Price must be a number",
  }),
  year: Joi.number()
    .integer()
    .min(1700)
    .max(new Date().getFullYear())
    .messages({
      "number.base": "Year must be a number",
      "number.min": "Year must be after 1700",
      "number.max": "Year must not be in the future",
    }),
  currency: Joi.string().messages({
    "string.base": "Currency must be a string",
  }),
  country: Joi.string()
    .valid("Montenegro", "Bulgaria", "Serbia", "Romania", "Greece")
    .messages({
      "any.only": "Country must be a valid Balkan country",
    }),

  // Optional fields
  monarch: Joi.string(),
  price_value: Joi.string(),
  composition_metal: Joi.string(),
  weight: Joi.string(),
  diameter: Joi.string(),
  shape: Joi.string(),
  technique: Joi.string(),
  denomination: Joi.string(),
  lettering: Joi.string(),
  script: Joi.string(),
  mintage: Joi.number(),
  mint_place: Joi.string(),
  coin_grading: Joi.string(),
  number: Joi.string(),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

export const coinQuerySchema = Joi.object({
  country: Joi.string()
    .valid(
      "Montenegro",
      "Bulgaria",
      "Serbia",
      "Romania",
      "Greece",
      "Ottoman Empire"
    )
    .optional(),

  composition_metal: Joi.string().optional(),
  coin_grading: Joi.string().optional(),

  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),

  sort: Joi.string().valid("price", "year").optional(),
  order: Joi.string().valid("asc", "desc").optional(),
});

export const validateCoinCreation = [
  validateWithJoi(coinCreationSchema, "body"),
];
export const validateCoinUpdate = [
  validateWithJoi(coinIdSchema, "params"),
  validateWithJoi(updateCoinSchema, "body", true),
];
export const validateCoinDelete = [validateWithJoi(coinIdSchema, "params")];
export const validateCoinIdParam = [validateWithJoi(coinIdSchema, "params")];

export const validateCoinQuery = [validateWithJoi(coinQuerySchema, "query")];
