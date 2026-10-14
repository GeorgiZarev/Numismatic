// Pending (unapproved) orders reserve boxes without lowering real stock.
// Shoppers see real stock minus reservations; admins see real stock plus the reserved counts.
export const applyReservations = (coin, reservations, { shown }) => {
  const rows = reservations.filter((row) => row.coin_id === coin.id);
  const reservedQuantity = rows.reduce((total, row) => total + Number(row.quantity), 0);
  const reservedSizes = rows
    .filter((row) => row.size_mm !== null && row.size_mm !== undefined)
    .map((row) => ({ size_mm: Number(row.size_mm), quantity: Number(row.quantity) }));
  const reservedForSize = (size) => reservedSizes.find((row) => row.size_mm === Number(size))?.quantity || 0;
  const sizes = Array.isArray(coin.size_stock) ? coin.size_stock : [];

  if (!shown) {
    return { ...coin, reserved_quantity: reservedQuantity, reserved_sizes: reservedSizes };
  }
  return {
    ...coin,
    stock_quantity: Math.max(0, Number(coin.stock_quantity) - reservedQuantity),
    size_stock: sizes.map((row) => ({ ...row, stock_quantity: Math.max(0, Number(row.stock_quantity) - reservedForSize(row.size_mm)) })),
  };
};

export const reservedBelowMinimum = (sizeStock, reservations) => sizeStock.find((row) => {
  const reserved = reservations.find((entry) => Number(entry.size_mm) === row.size_mm)?.quantity || 0;
  return row.stock_quantity < Number(reserved);
});
