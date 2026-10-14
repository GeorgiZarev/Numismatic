import cloudinary from "../config/cloudinary.js";
import { Coins } from "../utils/db/coins.js";
import NotFoundError from "../errors/NotFoundError.js";
import { restockTimestamp } from "../utils/coinRestock.js";
import { isAdminUser } from "../middlewares/adminMiddleware.js";
import ForbiddenError from "../errors/ForbiddenError.js";
import ConflictError from "../errors/ConflictError.js";
import BadRequestError from "../errors/BadRequestError.js";
import { hasSizeRestock, parseSizeStock, totalSizeStock, usesSizeStock } from "../utils/sizeStock.js";
import { applyReservations, reservedBelowMinimum } from "../utils/reservedStock.js";

const withReservations = async (coins, shown) => {
  const reservations = await Coins.getReservations(coins.map((coin) => coin.id));
  return coins.map((coin) => applyReservations(coin, reservations, { shown }));
};

export const getCoins = async (req, res, next) => {
  try {
    const filters = req.query;
    if (filters.includeUnavailable === "true" && !isAdminUser(req.user)) {
      throw new ForbiddenError("Admin access required.");
    }

    const coins = await Coins.getFiltered(filters);
    res.status(200).json(await withReservations(coins, filters.includeUnavailable !== "true"));
  } catch (err) {
    next(err);
  }
};

export const getCoin = async (req, res, next) => {
  try {
    const [coin] = await Coins.getById(req.params.id, isAdminUser(req.user));
    if (!coin) throw new NotFoundError("Coin not found");
    const [shownCoin] = await withReservations([coin], true);
    res.status(200).json(shownCoin);
  } catch (err) {
    next(err);
  }
};

export const createCoin = async (req, res, next) => {
  try {
    const photo_url = req.file?.path;
    const sized = usesSizeStock(req.body.product_type, req.body.consumable_category);
    const sizeStock = sized ? parseSizeStock(req.body.size_stock) : [];

    const coinData = {
      ...req.body,
      size_stock: JSON.stringify(sizeStock),
      ...(sized && { stock_quantity: totalSizeStock(sizeStock) }),
      status: req.body.status || "active",
      currency: "EUR",
      ...(req.body.expected_delivery_date === "" && { expected_delivery_date: null }),
      ...(req.body.fineness === "" && { fineness: null }),
      ...(req.body.pure_weight === "" && { pure_weight: null }),
      ...(req.body.volume_ml === "" && { volume_ml: null }),
      ...(req.body.company === "" && { company: null }),
      ...(req.body.pieces_per_box === "" && { pieces_per_box: null }),
      ...(Number(sized ? totalSizeStock(sizeStock) : req.body.stock_quantity) > 0 && { expected_delivery_date: null }),
      ...(req.body.zero_stock_action !== "show" && { expected_delivery_date: null }),
      ...(req.body.product_type !== "coin" && { year: null, country: null, fineness: null, pure_weight: null }),
      ...(req.body.product_type !== "consumable" && { consumable_category: null }),
      ...(req.body.product_type !== "consumable" && { company: null }),
      ...(req.body.consumable_category !== "cleaning_solutions" && { volume_ml: null, suitable_metals: null }),
      ...(!["capsules", "cardboard_holders"].includes(req.body.consumable_category) && { pieces_per_box: null }),
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
      ...(req.body.product_type && req.body.product_type !== "coin" && { year: null, country: null, fineness: null, pure_weight: null }),
      ...(req.body.product_type && req.body.product_type !== "consumable" && { consumable_category: null }),
    };
    const type = req.body.product_type || existingCoin[0].product_type;
    const category = req.body.consumable_category || existingCoin[0].consumable_category;
    const sized = usesSizeStock(type, category);
    if (sized && req.body.size_stock !== undefined) {
      const sizeStock = parseSizeStock(req.body.size_stock);
      const oldSizes = existingCoin[0].size_stock || [];
      const openOrderSizes = await Coins.getOpenOrderSizes(id);
      const shortSize = reservedBelowMinimum(sizeStock, await Coins.getReservations([id]));
      if (shortSize) {
        throw new BadRequestError(`${shortSize.size_mm} mm has more boxes reserved in pending orders than ${shortSize.stock_quantity}. Approve or cancel those orders first.`);
      }
      for (const oldSize of oldSizes) {
        if (!sizeStock.some((row) => row.size_mm === Number(oldSize.size_mm))) {
          if (Number(oldSize.stock_quantity) > 0 || openOrderSizes.some((orderSize) => Number(orderSize.size_mm) === Number(oldSize.size_mm))) {
            throw new BadRequestError("A size can be removed only when it has no boxes and no open orders.");
          }
        }
      }
      updates.size_stock = JSON.stringify(sizeStock);
      updates.stock_quantity = totalSizeStock(sizeStock);
    } else if (sized && req.body.stock_quantity !== undefined) {
      throw new BadRequestError("Edit box quantity for each size instead of the product total.");
    } else if (!sized && (req.body.product_type || req.body.consumable_category)) {
      updates.size_stock = "[]";
    }
    if (!sized && updates.stock_quantity !== undefined) {
      const reserved = (await Coins.getReservations([id])).reduce((total, row) => total + Number(row.quantity), 0);
      if (Number(updates.stock_quantity) < reserved) {
        throw new BadRequestError(`${reserved} pieces are reserved in pending orders, so stock cannot go below ${reserved}. Approve or cancel those orders first.`);
      }
    }

    if (updates.expected_delivery_date === "") updates.expected_delivery_date = null;
    if (updates.fineness === "") updates.fineness = null;
    if (updates.pure_weight === "") updates.pure_weight = null;
    if (updates.volume_ml === "") updates.volume_ml = null;
    if (updates.company === "") updates.company = null;
    if (updates.pieces_per_box === "") updates.pieces_per_box = null;
    if (req.body.product_type && req.body.product_type !== "consumable") {
      Object.assign(updates, { company: null, volume_ml: null, suitable_metals: null, pieces_per_box: null });
    } else if (req.body.consumable_category) {
      if (category !== "cleaning_solutions") Object.assign(updates, { volume_ml: null, suitable_metals: null });
      if (!["capsules", "cardboard_holders"].includes(category)) updates.pieces_per_box = null;
    }

    if (updates.stock_quantity !== undefined && Number(updates.stock_quantity) > 0) {
      updates.expected_delivery_date = null;
    }
    if (req.body.zero_stock_action && req.body.zero_stock_action !== "show") {
      updates.expected_delivery_date = null;
    }
    const restockedAt = sized && req.body.size_stock !== undefined
      ? hasSizeRestock(existingCoin[0].size_stock || [], JSON.parse(updates.size_stock)) ? new Date() : null
      : restockTimestamp(existingCoin[0].stock_quantity, updates.stock_quantity);
    if (restockedAt) updates.restocked_at = restockedAt;

    if (req.file) {
      updates.photo_url = req.file.path;
    }

    const [updatedCoin] = await Coins.update(id, updates, existingCoin[0].stock_quantity, existingCoin[0].size_stock);
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

    const [coinWithReservations] = await withReservations([updatedCoin], false);
    res.status(200).json({
      message: "Coin updated successfully",
      coin: coinWithReservations,
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
