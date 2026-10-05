import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { validateAddress, validateAddressId } from "../validators/addressValidators.js";
import { listAddresses, createAddress, updateAddress, deleteAddress } from "../controllers/addressController.js";

const router = express.Router();
router.use(authenticateUser);
router.get("/", listAddresses);
router.post("/", validateAddress, createAddress);
router.put("/:id", validateAddressId, validateAddress, updateAddress);
router.delete("/:id", validateAddressId, deleteAddress);
export default router;
