import { verifyToken } from "../utils/jwtUtils.js";

/**
 * * Middleware to verify JWT token before accessing protected routes.
 */
export const authenticateUser = (req, res, next) => {
  const token = req.cookies.auth_token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }

    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token." });
  }
};
