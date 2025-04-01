import express from "express";
import {
  getCoins,
  getCoin,
  createCoin,
  updateCoin,
  deleteCoin,
} from "../controllers/coinController.js";

import { authenticateUser } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";

import {
  validateCoinCreation,
  validateCoinUpdate,
  validateCoinDelete,
  validateCoinIdParam,
} from "../validators/coinValidators.js";

const router = express.Router();

/**
 * * Public Routes
 */
router.get("/", getCoins);
router.get("/:id", validateCoinIdParam, getCoin);

/**
 * * Protected Routes
 */
router.post(
  "/",
  authenticateUser,
  upload.single("photo"),
  validateCoinCreation,
  createCoin
);
router.put(
  "/:id",
  authenticateUser,
  upload.single("photo"),
  validateCoinUpdate,
  updateCoin
);
router.delete("/:id", authenticateUser, validateCoinDelete, deleteCoin);

export default router;
