import Joi from "joi";
import { validateWithJoi } from "../middlewares/joiValidator.js";

const addressSchema = Joi.object({
  label: Joi.string().trim().max(80).required(),
  full_name: Joi.string().trim().max(255).required(),
  phone: Joi.string().trim().max(50).required(),
  city: Joi.string().trim().max(120).required(),
  address: Joi.string().trim().required(),
  notes: Joi.string().allow("").max(2000).default(""),
  is_default: Joi.boolean().default(false),
});

const addressIdSchema = Joi.object({ id: Joi.string().uuid().required() });

export const validateAddress = validateWithJoi(addressSchema, "body");
export const validateAddressId = validateWithJoi(addressIdSchema, "params");
