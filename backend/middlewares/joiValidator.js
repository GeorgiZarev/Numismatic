import Joi from "joi";
import BadRequestError from "../errors/BadRequestError.js";

/**
 * @param {Joi.ObjectSchema} schema - Joi validation schema
 * @param {'body' | 'params' | 'query'} property - Request property to validate
 */
export const validateWithJoi = (
  schema,
  property = "body",
  allowFileFallback = false
) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    const isFileUploadOnly =
      allowFileFallback &&
      req.file &&
      (!req[property] || Object.keys(req[property]).length === 0);

    if (!error || isFileUploadOnly) {
      req[property] = value;
      return next();
    }

    // Format Joi errors to match express-validator's format
    const formattedErrors = error.details.map((err) => ({
      value: req[property][err.context.key],
      msg: err.message,
      path: err.context.key,
      location: property,
    }));

    return next(new BadRequestError("Validation failed", formattedErrors));
  };
};
