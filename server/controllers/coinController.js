import cloudinary from "../config/cloudinary.js";
import { Coins } from "../utils/db/coins.js";
import NotFoundError from "../errors/NotFoundError.js";

export const getCoins = async (req, res, next) => {
  try {
    const filters = req.query;

    const coins = await Coins.getFiltered(filters);
    res.status(200).json(coins);
  } catch (err) {
    next(err);
  }
};

export const getCoin = async (req, res, next) => {
  try {
    const [coin] = await Coins.getById(req.params.id);
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
      ...(req.body.product_type === "consumable" && { year: null, country: null }),
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
    const existingCoin = await Coins.getById(id);

    if (!existingCoin || existingCoin.length === 0) {
      throw new NotFoundError("Coin not found");
    }

    const updates = {
      ...req.body,
      currency: "EUR",
      ...(req.body.product_type === "consumable" && { year: null, country: null }),
      ...(req.body.product_type === "coin" && { consumable_category: null }),
    };

    // 🖼 If a new image was uploaded
    if (req.file) {
      const newImageUrl = req.file.path;

      // 🧼 Delete old image from Cloudinary
      const oldUrl = existingCoin[0].photo_url;
      const publicId = extractPublicId(oldUrl);
      await cloudinary.uploader.destroy(publicId);

      updates.photo_url = newImageUrl;
    }

    const [updatedCoin] = await Coins.update(id, updates);

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
    if (!deleted) throw new NotFoundError("Coin not found for deletion");

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
