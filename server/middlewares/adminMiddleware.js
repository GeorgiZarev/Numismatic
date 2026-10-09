import ForbiddenError from "../errors/ForbiddenError.js";

const fallbackAdminEmails = ["admin@gmail.com"];

export const isAdminUser = (user) => {
  const configuredEmails = process.env.ADMIN_EMAILS?.split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  const adminEmails =
    configuredEmails && configuredEmails.length > 0
      ? configuredEmails
      : fallbackAdminEmails;

  return adminEmails.includes(user?.email?.toLowerCase());
};

export const requireAdmin = (req, res, next) => {
  if (!isAdminUser(req.user)) {
    return next(new ForbiddenError("Admin access required."));
  }

  next();
};
