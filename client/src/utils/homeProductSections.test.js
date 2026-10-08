import { selectHomeProducts } from "./homeProductSections";

const product = (id, product_type, created_at, restocked_at = null) => ({
  id, product_type, created_at, restocked_at,
});

test("shows newest products across types and separates restocks from creation dates", () => {
  const products = [
    product("old-coin", "coin", "2026-01-01", "2026-10-08"),
    product("accessory", "consumable", "2026-10-09"),
    product("investment", "investment", "2026-10-07"),
    product("new-coin", "coin", "2026-10-06", "2026-10-09"),
  ];

  const sections = selectHomeProducts(products);
  expect(sections.newlyAdded.map(({ id }) => id)).toEqual(["accessory", "investment", "new-coin", "old-coin"]);
  expect(sections.freshlyRestocked.map(({ id }) => id)).toEqual(["new-coin", "old-coin"]);
  expect(sections.coins.map(({ id }) => id)).toEqual(["new-coin", "old-coin"]);
  expect(sections.accessories.map(({ id }) => id)).toEqual(["accessory"]);
  expect(products[0].id).toBe("old-coin");
});

test("limits each section independently", () => {
  const products = [product("a", "coin", "2026-10-01"), product("b", "coin", "2026-10-02")];
  expect(selectHomeProducts(products, 1).newlyAdded.map(({ id }) => id)).toEqual(["b"]);
  expect(selectHomeProducts(products, 1).coins.map(({ id }) => id)).toEqual(["b"]);
});
