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
  description: Joi.string().allow("").max(5000).optional(),
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
    .when("product_type", { is: "coin", then: Joi.required(), otherwise: Joi.optional() })
    .messages({
      "number.base": "Year must be a number",
      "number.min": "Year must be after 1700",
      "number.max": "Year must not be in the future",
      "any.required": "Year is required",
    }),
  currency: Joi.string().valid("EUR").default("EUR").messages({
    "string.empty": "Currency is required",
    "any.required": "Currency is required",
  }),
  country: Joi.string()
    .trim().max(100)
    .when("product_type", { is: "coin", then: Joi.required(), otherwise: Joi.optional() })
    .messages({
      "any.required": "Country is required",
    }),

  monarch: Joi.string().optional(),
  price_value: Joi.string().optional(),
  composition_metal: Joi.string().optional(),
  weight: Joi.string().optional(),
  fineness: Joi.number().integer().min(0).max(1000).allow(null, "").optional(),
  pure_weight: Joi.number().min(0).allow(null, "").optional(),
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
  status: Joi.string().valid("active", "draft", "sold", "hidden").optional(),
  stock_quantity: Joi.number().integer().min(0).required(),
  zero_stock_action: Joi.string().valid("hide", "show", "review_delete").default("hide"),
  expected_delivery_date: Joi.date().iso().allow(null, "").optional(),
  product_type: Joi.string().valid("coin", "investment", "consumable").default("coin"),
  consumable_category: Joi.string()
    .valid("capsules", "cleaning_solutions", "cardboard_holders")
    .when("product_type", { is: "consumable", then: Joi.required(), otherwise: Joi.optional() }),
  company: Joi.string().trim().max(255).when("consumable_category", { is: "cleaning_solutions", then: Joi.required(), otherwise: Joi.allow("").optional() }),
  volume_ml: Joi.number().integer().min(1).when("consumable_category", { is: "cleaning_solutions", then: Joi.required(), otherwise: Joi.optional() }),
  suitable_metals: Joi.string().trim().max(255).when("consumable_category", { is: "cleaning_solutions", then: Joi.required(), otherwise: Joi.optional() }),
  pieces_per_box: Joi.number().integer().min(1).when("consumable_category", { is: Joi.valid("capsules", "cardboard_holders").required(), then: Joi.required(), otherwise: Joi.allow(null, "").optional() }),
  size_stock: Joi.string().max(10000).when("consumable_category", { is: Joi.valid("capsules", "cardboard_holders").required(), then: Joi.required(), otherwise: Joi.optional() }),
});

export const updateCoinSchema = Joi.object({
  name: Joi.string().messages({
    "string.base": "Coin name must be a string",
  }),
  description: Joi.string().allow("").max(5000),
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
  currency: Joi.string().valid("EUR").messages({
    "string.base": "Currency must be a string",
  }),
  country: Joi.string()
    .trim().max(100),

  // Optional fields
  monarch: Joi.string(),
  price_value: Joi.string(),
  composition_metal: Joi.string(),
  weight: Joi.string(),
  fineness: Joi.number().integer().min(0).max(1000).allow(null, ""),
  pure_weight: Joi.number().min(0).allow(null, ""),
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
  status: Joi.string().valid("active", "draft", "sold", "hidden"),
  stock_quantity: Joi.number().integer().min(0),
  zero_stock_action: Joi.string().valid("hide", "show", "review_delete"),
  expected_delivery_date: Joi.date().iso().allow(null, ""),
  product_type: Joi.string().valid("coin", "investment", "consumable"),
  consumable_category: Joi.string().valid("capsules", "cleaning_solutions", "cardboard_holders"),
  company: Joi.string().trim().max(255).allow(""),
  volume_ml: Joi.number().integer().min(1).allow(null, ""),
  suitable_metals: Joi.string().trim().max(255).allow(""),
  pieces_per_box: Joi.number().integer().min(1).allow(null, ""),
  size_stock: Joi.string().max(10000),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

export const coinQuerySchema = Joi.object({
  country: Joi.string().trim().max(100).optional(),

  composition_metal: Joi.string().optional(),
  coin_grading: Joi.string().optional(),
  search: Joi.string().optional(),
  status: Joi.string().valid("active", "draft", "sold", "hidden").optional(),
  product_type: Joi.string().valid("coin", "investment", "consumable").optional(),
  consumable_category: Joi.string().valid("capsules", "cleaning_solutions", "cardboard_holders").optional(),
  includeUnavailable: Joi.string().valid("true", "false").optional(),

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
