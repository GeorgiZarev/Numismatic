import { filterLocalProducts, readShopFilters, shopTitleKey, toApiFilters } from "./shopFilters";

test("empty shop URL loads all product types without empty API filters", () => {
  const filters = readShopFilters(new URLSearchParams());
  expect(filters.product_type).toBe("all");
  expect(toApiFilters(filters)).toEqual({});
});

test("shop category and search map to supported API filters", () => {
  const filters = readShopFilters(new URLSearchParams("product_type=coin&search=Kennedy&minYear=1900"));
  expect(toApiFilters(filters)).toEqual({ product_type: "coin", search: "Kennedy" });
  expect(filterLocalProducts([{ year: 1964, denomination: "Half dollar" }, { year: 1899, denomination: "Dollar" }], filters)).toHaveLength(1);
});

test("country filters locally so new countries remain available in the filter", () => {
  const filters = readShopFilters(new URLSearchParams("country=Peru"));
  expect(toApiFilters(filters)).toEqual({});
  expect(filterLocalProducts([
    { country: "Peru", year: 1918 },
    { country: "Bulgaria", year: 1918 },
  ], filters)).toEqual([{ country: "Peru", year: 1918 }]);
});

test("shop title follows the selected product category", () => {
  expect(shopTitleKey("all")).toBe("shop.allItems");
  expect(shopTitleKey("coin")).toBe("nav.coins");
  expect(shopTitleKey("investment")).toBe("nav.investment");
  expect(shopTitleKey("consumable")).toBe("nav.accessories");
});
