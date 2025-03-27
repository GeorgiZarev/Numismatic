import ApiError from "./ApiError";

class ForbiddenError extends ApiError {
  constructor(message = "Forbidden") {
    super(403, message);
  }
}

export default ForbiddenError;

/**
 * * Use this class when a non-admin user tries to access an admin-only resource
 */
