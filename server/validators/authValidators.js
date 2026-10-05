import Joi from "joi";
import { validateWithJoi } from "../middlewares/joiValidator.js";

export const registerSchema = Joi.object({
  username: Joi.string().required().messages({
    "string.base": "Username must be a string",
    "string.empty": "Username is required",
    "any.required": "Username is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Valid email is required",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
});

export const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    "string.empty": "Valid username is required",
    "any.required": "Valid username is required",
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
});

export const loginValidation = validateWithJoi(loginSchema);
export const registerValidation = validateWithJoi(registerSchema);
export const profileUpdateValidation = validateWithJoi(profileUpdateSchema);
