import ApiError from "./ApiError.js";

class BadRequestError extends ApiError {
  constructor(message = "Bad Request", errors = []) {
    super(400, message, errors);
  }
}

export default BadRequestError;
