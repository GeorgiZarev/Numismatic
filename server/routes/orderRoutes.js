import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrder,
  getMyOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { requireAdmin } from "../middlewares/adminMiddleware.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import {
  validateOrderCreation,
  validateOrderQuery,
  validateOrderStatus,
} from "../validators/orderValidators.js";

const router = express.Router();

router.use(authenticateUser);

router.post("/", validateOrderCreation, createOrder);
router.get("/my", getMyOrders);
router.get("/", requireAdmin, validateOrderQuery, getAllOrders);
router.get("/:id", requireAdmin, getOrder);
router.patch("/:id/status", requireAdmin, validateOrderStatus, updateOrderStatus);

export default router;
