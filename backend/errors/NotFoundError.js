import ApiError from "./ApiError.js";

class NotFoundError extends ApiError {
  constructor(message = "Resource Not Found", errors = []) {
    super(404, message, errors);
  }
}

export default NotFoundError;

/**
 * * Use this when a requested resource is missing.
 */
