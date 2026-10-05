import ForbiddenError from "../errors/ForbiddenError.js";

const fallbackAdminEmails = ["admin@gmail.com"];

export const requireAdmin = (req, res, next) => {
  const configuredEmails = process.env.ADMIN_EMAILS?.split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  const adminEmails =
    configuredEmails && configuredEmails.length > 0
      ? configuredEmails
      : fallbackAdminEmails;

  if (!adminEmails.includes(req.user.email?.toLowerCase())) {
    return next(new ForbiddenError("Admin access required."));
  }

  next();
};
