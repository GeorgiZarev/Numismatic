import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateCurrentUser,
} from "../controllers/authController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import {
  registerValidation,
  loginValidation,
  profileUpdateValidation,
} from "../validators/authValidators.js";

const router = express.Router();

router.post("/register", registerValidation, registerUser);
router.post("/login", loginValidation, loginUser);
router.post("/logout", authenticateUser, logoutUser);
router.get("/me", authenticateUser, getCurrentUser);
router.patch("/me", authenticateUser, profileUpdateValidation, updateCurrentUser);

router.get("/protected", authenticateUser, (req, res) => {
  res.json({ message: "Access granted!", user: req.user });
});

export default router;
