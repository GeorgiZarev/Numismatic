import express from "express";
import {
  getCoins,
  getCoin,
  createCoin,
  updateCoin,
  deleteCoin,
} from "../controllers/coinController.js";

import { authenticateUser } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/adminMiddleware.js";
import upload from "../middlewares/upload.js";

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
router.get("/", validateCoinQuery, getCoins);
router.get("/:id", validateCoinIdParam, getCoin);

/**
 * * Protected Routes
 */
router.post(
  "/",
  authenticateUser,
  requireAdmin,
  upload.single("photo"),
  validateCoinCreation,
  createCoin
);
router.put(
  "/:id",
  authenticateUser,
  requireAdmin,
  upload.single("photo"),
  validateCoinUpdate,
  updateCoin
);
router.delete("/:id", authenticateUser, requireAdmin, validateCoinDelete, deleteCoin);

export default router;
