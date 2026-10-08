import Joi from "joi";
import { validateWithJoi } from "../middlewares/joiValidator.js";

export const registerSchema = Joi.object({
  email: Joi.string().email().lowercase().required().messages({
    "string.email": "Valid email is required",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
  first_name: Joi.string().trim().min(1).max(120).required(),
  last_name: Joi.string().trim().min(1).max(120).required(),
  birth_date: Joi.date().iso().max("now").required(),
  phone: Joi.string().trim().min(6).max(50).required(),
  email_confirmation: Joi.string().email().lowercase().valid(Joi.ref("email")).required(),
  preferred_language: Joi.string().valid("en", "bg").optional(),
  city: Joi.string().trim().min(2).max(120).required(),
  address: Joi.string().trim().min(5).required(),
  postal_code: Joi.string().trim().min(2).max(30).required(),
  address_line_2: Joi.string().trim().max(255).allow("").optional(),
  country: Joi.string().trim().uppercase().length(2).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required().messages({
    "string.empty": "Valid email is required",
    "any.required": "Valid email is required",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
});

export const profileUpdateSchema = Joi.object({
  full_name: Joi.string().min(2).max(255).allow("", null),
  phone: Joi.string().min(6).max(50).allow("", null),
  city: Joi.string().min(2).max(120).allow("", null),
  address: Joi.string().min(5).allow("", null),
  birth_date: Joi.date().iso().max("now").allow(null),
  preferred_language: Joi.string().valid("en", "bg").allow(null),
});

export const loginValidation = validateWithJoi(loginSchema);
export const registerValidation = validateWithJoi(registerSchema);
export const profileUpdateValidation = validateWithJoi(profileUpdateSchema);
