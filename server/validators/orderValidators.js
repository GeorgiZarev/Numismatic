import Joi from "joi";
import { validateWithJoi } from "../middlewares/joiValidator.js";

export const orderCreateSchema = Joi.object({
  customer_name: Joi.string().min(2).max(255).required(),
  phone: Joi.string().min(6).max(50).required(),
  email: Joi.string().email().allow("", null),
  city: Joi.string().min(2).max(120).required(),
  address: Joi.string().min(5).required(),
  delivery_notes: Joi.string().allow("", null),
  payment_method: Joi.string()
    .valid("cash_on_delivery", "bank_transfer")
    .default("cash_on_delivery"),
  items: Joi.array()
    .items(
      Joi.object({
        coin_id: Joi.string().guid({ version: "uuidv4" }).required(),
        quantity: Joi.number().integer().min(1).default(1),
      })
    )
    .min(1)
    .required(),
});

export const orderStatusSchema = Joi.object({
  status: Joi.string()
    .valid("new", "confirmed", "packed", "sent", "completed", "cancelled")
    .required(),
});

export const orderQuerySchema = Joi.object({
  status: Joi.string()
    .valid(
      "new",
      "pending",
      "confirmed",
      "packed",
      "sent",
      "completed",
      "cancelled",
      "canceled"
    )
    .optional(),
  search: Joi.string().allow("").optional(),
  fromDate: Joi.date().iso().optional(),
  toDate: Joi.date().iso().optional(),
});

export const validateOrderCreation = validateWithJoi(orderCreateSchema);
export const validateOrderStatus = validateWithJoi(orderStatusSchema);
export const validateOrderQuery = validateWithJoi(orderQuerySchema, "query");
