import { availableForSize, cartItemKey, hasProductSizes, requiresProductSize, buildSizeStockUpdate, reservedForSize, sizeStockLevel } from "./productSizes";

test("size stock is separate for each box size", () => {
  const product = { id: "a", stock_quantity: 5, size_stock: [{ size_mm: 15, stock_quantity: 2 }, { size_mm: 17, stock_quantity: 3 }] };
  expect(hasProductSizes(product)).toBe(true);
  expect(availableForSize(product, 15)).toBe(2);
  expect(availableForSize(product, 17)).toBe(3);
  expect(availableForSize(product, 19)).toBe(0);
  expect(cartItemKey({ id: "a", size_mm: 15 })).not.toBe(cartItemKey({ id: "a", size_mm: 17 }));
});

test("capsules without configured sizes cannot be purchased", () => {
  const product = { product_type: "consumable", consumable_category: "capsules", stock_quantity: 40, size_stock: [] };
  expect(requiresProductSize(product)).toBe(true);
  expect(availableForSize(product, null)).toBe(0);
});

test("stock modal sends only the size breakdown", () => {
  const data = buildSizeStockUpdate([{ size_mm: "15", stock_quantity: "10" }]);
  expect(JSON.parse(data.get("size_stock"))).toEqual([{ size_mm: "15", stock_quantity: "10" }]);
  expect(data.get("stock_quantity")).toBeNull();
});

test("size stock colors: 10+ green, 1-9 yellow, 0 out of stock", () => {
  expect(sizeStockLevel(11)).toBe("high");
  expect(sizeStockLevel(10)).toBe("high");
  expect(sizeStockLevel(9)).toBe("low");
  expect(sizeStockLevel(1)).toBe("low");
  expect(sizeStockLevel(0)).toBe("out");
});

test("admin rows read reserved boxes per size", () => {
  const product = { reserved_sizes: [{ size_mm: 14, quantity: 6 }] };
  expect(reservedForSize(product, "14")).toBe(6);
  expect(reservedForSize(product, 15)).toBe(0);
  expect(reservedForSize({}, 14)).toBe(0);
});
