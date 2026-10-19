import express from "express";
import {
  getCoins,
  getCoin,
  createCoin,
  updateCoin,
  deleteCoin,
} from "../controllers/coinController.js";

import { authenticateUser, optionalAuthenticateUser } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/adminMiddleware.js";
import { productPhotos } from "../middlewares/upload.js";

import {
  validateCoinCreation,
  validateCoinUpdate,
  validateCoinDelete,
  validateCoinIdParam,
  validateCoinQuery,
} from "../validators/coinValidators.js";

const router = express.Router();

/**
 * * Public Routes
 */
router.get("/", validateCoinQuery, optionalAuthenticateUser, getCoins);
router.get("/:id", validateCoinIdParam, optionalAuthenticateUser, getCoin);

/**
 * * Protected Routes
 */
router.post(
  "/",
  authenticateUser,
  requireAdmin,
  productPhotos,
  validateCoinCreation,
  createCoin
);
router.put(
  "/:id",
  authenticateUser,
  requireAdmin,
  productPhotos,
  validateCoinUpdate,
  updateCoin
);
router.delete("/:id", authenticateUser, requireAdmin, validateCoinDelete, deleteCoin);

export default router;
