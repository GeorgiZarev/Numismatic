import BadRequestError from "../errors/BadRequestError.js";

export const usesSizeStock = (productType, category) =>
  productType === "consumable" && ["capsules", "cardboard_holders"].includes(category);

export const parseSizeStock = (raw) => {
  let rows;
  try {
    rows = typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    throw new BadRequestError("Sizes must be valid JSON.");
  }
  if (!Array.isArray(rows) || rows.length === 0 || rows.length > 100) {
    throw new BadRequestError("Add between 1 and 100 sizes.");
  }
  const seen = new Set();
  return rows.map((row) => {
    const size = Number(row?.size_mm);
    const quantity = Number(row?.stock_quantity);
    if (!Number.isFinite(size) || size <= 0 || size > 1000 || Math.abs(Math.round(size * 100) - size * 100) > 1e-8 || !Number.isSafeInteger(quantity) || quantity < 0 || seen.has(size)) {
      throw new BadRequestError("Each size needs a unique positive millimeter value and a nonnegative whole-box quantity.");
    }
    seen.add(size);
    return { size_mm: size, stock_quantity: quantity };
  }).sort((a, b) => a.size_mm - b.size_mm);
};

export const totalSizeStock = (rows) => rows.reduce((total, row) => total + row.stock_quantity, 0);

export const hasSizeRestock = (previous, next) => next.some((row) =>
  row.stock_quantity > Number(previous.find((oldRow) => Number(oldRow.size_mm) === row.size_mm)?.stock_quantity || 0)
);
