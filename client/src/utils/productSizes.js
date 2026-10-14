export const hasProductSizes = (product) => Array.isArray(product?.size_stock) && product.size_stock.length > 0;

export const requiresProductSize = (product) => product?.product_type === "consumable" && ["capsules", "cardboard_holders"].includes(product?.consumable_category);

export const availableForSize = (product, sizeMm) => {
  if (requiresProductSize(product) && !hasProductSizes(product)) return 0;
  if (!hasProductSizes(product)) return Number(product?.stock_quantity) || 0;
  return Number(product.size_stock.find((row) => Number(row.size_mm) === Number(sizeMm))?.stock_quantity) || 0;
};

export const cartItemKey = (item) => `${item.id}:${item.size_mm ?? ""}`;

export const buildSizeStockUpdate = (sizes) => {
  const data = new FormData();
  data.append("size_stock", JSON.stringify(sizes));
  return data;
};

export const sizeStockLevel = (quantity) => {
  const count = Number(quantity) || 0;
  if (count <= 0) return "out";
  return count < 10 ? "low" : "high";
};

export const reservedForSize = (product, sizeMm) =>
  Number((product?.reserved_sizes || []).find((row) => Number(row.size_mm) === Number(sizeMm))?.quantity) || 0;
