class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    if (details) {
      this.details = details;
    }
  }
}

export default ApiError;
