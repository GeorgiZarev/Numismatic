import { filterAdminProducts } from "./adminProductFilters";

const products = [
  { id: 1, product_type: "coin" },
  { id: 2, product_type: "investment" },
  { id: 3, product_type: "consumable", consumable_category: "capsules" },
  { id: 4, product_type: "consumable", consumable_category: "cardboard_holders" },
];

test("filters admin products by type and accessory category", () => {
  expect(filterAdminProducts(products, "all", "")).toHaveLength(4);
  expect(filterAdminProducts(products, "coin", "").map(({ id }) => id)).toEqual([1]);
  expect(filterAdminProducts(products, "consumable", "").map(({ id }) => id)).toEqual([3, 4]);
  expect(filterAdminProducts(products, "consumable", "capsules").map(({ id }) => id)).toEqual([3]);
});
