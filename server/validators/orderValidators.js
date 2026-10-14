import Joi from "joi";
import { validateWithJoi } from "../middlewares/joiValidator.js";

export const orderCreateSchema = Joi.object({
  customer_name: Joi.string().min(2).max(255).required(),
  phone: Joi.string().min(6).max(50).required(),
  email: Joi.string().email().allow("", null),
  city: Joi.string().min(2).max(120).required(),
  address: Joi.string().min(5).required(),
  postal_code: Joi.string().trim().max(30).allow("", null).optional(),
  address_line_2: Joi.string().trim().max(255).allow("", null).optional(),
  country: Joi.string().trim().uppercase().length(2).allow("", null).optional(),
  delivery_notes: Joi.string().allow("", null),
  payment_method: Joi.string()
    .valid("cash_on_delivery", "bank_transfer")
    .default("cash_on_delivery"),
  items: Joi.array()
    .items(
      Joi.object({
        coin_id: Joi.string().guid({ version: "uuidv4" }).required(),
        quantity: Joi.number().integer().min(1).default(1),
        size_mm: Joi.number().positive().precision(2).max(1000).allow(null).optional(),
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

const calendarDay = Joi.string()
  .pattern(/^\d{4}-\d{2}-\d{2}$/)
  .custom((value, helpers) => {
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value) ? value : helpers.error("any.invalid");
  })
  .allow("")
  .optional()
  .messages({ "string.pattern.base": "Dates must look like YYYY-MM-DD", "any.invalid": "Enter a real calendar date" });

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
  search: Joi.string().trim().max(200).allow("").optional(),
  city: Joi.string().trim().max(120).allow("").optional(),
  // Calendar days (YYYY-MM-DD). Only fromDate means that single day.
  fromDate: calendarDay,
  toDate: calendarDay,
}).custom((value, helpers) => {
  if (value.fromDate && value.toDate && value.toDate < value.fromDate) {
    return helpers.message("The end date must be on or after the start date");
  }
  return value;
});

export const validateOrderCreation = validateWithJoi(orderCreateSchema);
export const validateOrderStatus = validateWithJoi(orderStatusSchema);
export const validateOrderQuery = validateWithJoi(orderQuerySchema, "query");
