import cloudinary from "../config/cloudinary.js";
import { Coins } from "../utils/db/coins.js";
import NotFoundError from "../errors/NotFoundError.js";
import { restockTimestamp } from "../utils/coinRestock.js";
import { isAdminUser } from "../middlewares/adminMiddleware.js";
import ForbiddenError from "../errors/ForbiddenError.js";
import ConflictError from "../errors/ConflictError.js";

export const getCoins = async (req, res, next) => {
  try {
    const filters = req.query;
    if (filters.includeUnavailable === "true" && !isAdminUser(req.user)) {
      throw new ForbiddenError("Admin access required.");
    }

    const coins = await Coins.getFiltered(filters);
    res.status(200).json(coins);
  } catch (err) {
    next(err);
  }
};

export const getCoin = async (req, res, next) => {
  try {
    const [coin] = await Coins.getById(req.params.id, isAdminUser(req.user));
    if (!coin) throw new NotFoundError("Coin not found");
    res.status(200).json(coin);
  } catch (err) {
    next(err);
  }
};

export const createCoin = async (req, res, next) => {
  try {
    const photo_url = req.file?.path;

    const coinData = {
      ...req.body,
      status: req.body.status || "active",
      currency: "EUR",
      ...(req.body.expected_delivery_date === "" && { expected_delivery_date: null }),
      ...(Number(req.body.stock_quantity) > 0 && { expected_delivery_date: null }),
      ...(req.body.zero_stock_action !== "show" && { expected_delivery_date: null }),
      ...(req.body.product_type !== "coin" && { year: null, country: null }),
      ...(req.body.product_type !== "consumable" && { consumable_category: null }),
      ...(photo_url && { photo_url }),
    };

    const [coin] = await Coins.create(coinData);

    res.status(201).json({
      message: "Coin created successfully",
      coin,
    });
  } catch (err) {
    next(err);
  }
};

export const updateCoin = async (req, res, next) => {
  try {
    const id = req.params.id;
    const existingCoin = await Coins.getById(id, true);

    if (!existingCoin || existingCoin.length === 0) {
      throw new NotFoundError("Coin not found");
    }

    const updates = {
      ...req.body,
      currency: "EUR",
      ...(req.body.product_type && req.body.product_type !== "coin" && { year: null, country: null }),
      ...(req.body.product_type && req.body.product_type !== "consumable" && { consumable_category: null }),
    };

    if (updates.expected_delivery_date === "") updates.expected_delivery_date = null;

    if (req.body.stock_quantity !== undefined && Number(req.body.stock_quantity) > 0) {
      updates.expected_delivery_date = null;
    }
    if (req.body.zero_stock_action && req.body.zero_stock_action !== "show") {
      updates.expected_delivery_date = null;
    }
    const restockedAt = restockTimestamp(existingCoin[0].stock_quantity, req.body.stock_quantity);
    if (restockedAt) updates.restocked_at = restockedAt;

    if (req.file) {
      updates.photo_url = req.file.path;
    }

    const [updatedCoin] = await Coins.update(id, updates, existingCoin[0].stock_quantity);
    if (!updatedCoin) throw new ConflictError("Stock changed while editing. Reload the product and try again.");

    if (req.file && existingCoin[0].photo_url) {
      const publicId = extractPublicId(existingCoin[0].photo_url);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (cleanupError) {
          console.error("Could not remove replaced product photo:", cleanupError);
        }
      }
    }

    res.status(200).json({
      message: "Coin updated successfully",
      coin: updatedCoin,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteCoin = async (req, res, next) => {
  try {
    const [deleted] = await Coins.delete(req.params.id);
    if (!deleted) {
      const [existing] = await Coins.getById(req.params.id, true);
      if (existing) throw new ConflictError("This product belongs to an open order and cannot be deleted yet.");
      throw new NotFoundError("Coin not found for deletion");
    }

    res.status(200).json({
      message: "Coin deleted successfully",
      id: deleted.id,
    });
  } catch (err) {
    next(err);
  }
};

function extractPublicId(url) {
  try {
    const urlObj = new URL(url);
    const parts = urlObj.pathname.split("/");
    const fileWithExt = parts.pop();
    const folder = parts.pop();
    const [filename] = fileWithExt.split(".");
    return `${folder}/${filename}`;
  } catch (err) {
    console.error("Failed to extract public_id:", err);
    return null;
  }
}
