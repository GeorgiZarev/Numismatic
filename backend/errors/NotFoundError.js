import ApiError from "./ApiError";

class NotFoundError extends ApiError {
  constructor(message = "Resource Not Found") {
    super(404, message);
  }
}

export default NotFoundError;

/**
 * * Use this when a requested resource is missing.
 */
