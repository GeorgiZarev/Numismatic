import ApiError from "./ApiError";

class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized") {
    super(401, message);
  }
}

export default UnauthorizedError;
