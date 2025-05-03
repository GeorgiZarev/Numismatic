import { verifyToken } from "../utils/jwtUtils.js";
import UnauthorizedError from "../errors/UnauthorizedError.js";
import ForbiddenError from "../errors/ForbiddenError.js";

/**
 * * Middleware to verify JWT token before accessing protected routes.
 */
export const authenticateUser = (req, res, next) => {
  const token = req.cookies.auth_token;

  if (!token) {
    return next(new UnauthorizedError("Access denied. No token provided."));
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return next(new ForbiddenError("Invalid or expired token."));
    }

    req.user = decoded;
    next();
  } catch (err) {
    next(new ForbiddenError("Invalid token."));
  }
};
