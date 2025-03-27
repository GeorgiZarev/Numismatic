const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");
const {
  getCoins,
  getCoin,
  createCoin,
} = require("../controllers/coinController");

//TODO: Import the controllers
router.get("/", getCoins);
router.get("/:id", getCoin);
router.post("/", verifyToken, isAdmin, createCoin);
