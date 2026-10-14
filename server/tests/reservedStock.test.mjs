import { applyReservations, reservedBelowMinimum } from "../utils/reservedStock.js";

const capsules = {
  id: "c1",
  stock_quantity: 43,
  size_stock: [{ size_mm: 14, stock_quantity: 10 }, { size_mm: 15, stock_quantity: 33 }],
};
const reservations = [{ coin_id: "c1", size_mm: "14.00", quantity: 6 }, { coin_id: "other", size_mm: null, quantity: 9 }];

test("shoppers see real stock minus pending reservations per size", () => {
  const shown = applyReservations(capsules, reservations, { shown: true });
  expect(shown.stock_quantity).toBe(37);
  expect(shown.size_stock).toEqual([{ size_mm: 14, stock_quantity: 4 }, { size_mm: 15, stock_quantity: 33 }]);
});

test("admins see real stock and what is reserved", () => {
  const admin = applyReservations(capsules, reservations, { shown: false });
  expect(admin.stock_quantity).toBe(43);
  expect(admin.size_stock[0].stock_quantity).toBe(10);
  expect(admin.reserved_quantity).toBe(6);
  expect(admin.reserved_sizes).toEqual([{ size_mm: 14, quantity: 6 }]);
});

test("products without sizes subtract the total and never go negative", () => {
  const coin = { id: "other", stock_quantity: 5, size_stock: [] };
  expect(applyReservations(coin, reservations, { shown: true }).stock_quantity).toBe(0);
});

test("a size cannot be set below its reserved boxes", () => {
  expect(reservedBelowMinimum([{ size_mm: 14, stock_quantity: 5 }], [{ size_mm: "14.00", quantity: 6 }])).toEqual({ size_mm: 14, stock_quantity: 5 });
  expect(reservedBelowMinimum([{ size_mm: 14, stock_quantity: 6 }], [{ size_mm: "14.00", quantity: 6 }])).toBeUndefined();
});
