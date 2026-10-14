import ApiError from "../errors/ApiError.js";

const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    console.error(`[${req.method} ${req.originalUrl}]`, err.message, JSON.stringify(err.details || ""));
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: {
        name: err.constructor.name,
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
      },
    });
  }

  return res.status(500).json({
    error: {
      name: "InternalServerError",
      message: "Something went wrong",
    },
  });
};

export default errorHandler;
