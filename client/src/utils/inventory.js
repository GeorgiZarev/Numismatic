export const isPurchasable = (product) =>
  product?.status === "active" && Number(product.stock_quantity) > 0;

export const expectedDeliveryDate = (product) => {
  if (!product || Number(product.stock_quantity) > 0 || product.zero_stock_action !== "show") return null;
  const raw = String(product.expected_delivery_date || "").slice(0, 10);
  const date = new Date(`${raw}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today ? date : null;
};
