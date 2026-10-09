import ApiError from "./ApiError.js";

class ConflictError extends ApiError {
  constructor(message) {
    super(409, message);
  }
}

export default ConflictError;
