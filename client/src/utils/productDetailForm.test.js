import { buildProductDetailUpdate } from "./productDetailForm";

test("detail updates exclude inventory and database metadata", () => {
  const product = { product_type: "consumable", consumable_category: "capsules" };
  const data = buildProductDetailUpdate(product, { name: "Capsule box", company: "Lindner", pieces_per_box: "50", size_stock: [{ size_mm: 15, stock_quantity: 10 }], stock_quantity: 10, created_at: "yesterday" });
  expect(data.get("name")).toBe("Capsule box");
  expect(data.get("company")).toBe("Lindner");
  expect(data.get("pieces_per_box")).toBe("50");
  expect(data.get("size_stock")).toBeNull();
  expect(data.get("stock_quantity")).toBeNull();
  expect(data.get("created_at")).toBeNull();
});
