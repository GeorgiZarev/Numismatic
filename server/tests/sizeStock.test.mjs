import { hasSizeRestock, parseSizeStock, totalSizeStock, usesSizeStock } from "../utils/sizeStock.js";

test("validates and sums per-size box stock", () => {
  const rows = parseSizeStock('[{"size_mm":17,"stock_quantity":30},{"size_mm":15,"stock_quantity":10}]');
  expect(rows).toEqual([{ size_mm: 15, stock_quantity: 10 }, { size_mm: 17, stock_quantity: 30 }]);
  expect(totalSizeStock(rows)).toBe(40);
  expect(usesSizeStock("consumable", "capsules")).toBe(true);
  expect(usesSizeStock("coin", "capsules")).toBe(false);
  expect(parseSizeStock([{ size_mm: 0.29, stock_quantity: 1 }])[0].size_mm).toBe(0.29);
});

test("an increase in one size counts as a restock even when the total is unchanged", () => {
  const previous = [{ size_mm: 15, stock_quantity: 2 }, { size_mm: 17, stock_quantity: 3 }];
  const next = [{ size_mm: 15, stock_quantity: 3 }, { size_mm: 17, stock_quantity: 2 }];
  expect(hasSizeRestock(previous, next)).toBe(true);
  expect(hasSizeRestock(next, previous)).toBe(true);
  expect(hasSizeRestock(previous, previous)).toBe(false);
});

test("rejects duplicate sizes and fractional box quantities", () => {
  expect(() => parseSizeStock([{ size_mm: 15, stock_quantity: 1 }, { size_mm: "15", stock_quantity: 2 }])).toThrow();
  expect(() => parseSizeStock([{ size_mm: 15, stock_quantity: 1.5 }])).toThrow();
  expect(() => parseSizeStock([])).toThrow();
});
