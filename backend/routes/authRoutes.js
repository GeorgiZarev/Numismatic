import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/authController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import {
  registerValidation,
  loginValidation,
} from "../validators/authValidators.js";

const router = express.Router();

router.post("/register", registerValidation, registerUser);
router.post("/login", loginValidation, loginUser);
router.post("/logout", authenticateUser, logoutUser);

router.get("/protected", authenticateUser, (req, res) => {
  res.json({ message: "Access granted!", user: req.user });
});

export default router;
