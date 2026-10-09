import { getProductStatus, productStatuses } from "./productStatus";

test("each product status has a distinct visual treatment", () => {
  expect(productStatuses.map(({ value }) => value)).toEqual(["active", "draft", "sold", "hidden"]);
  expect(new Set(productStatuses.map(({ className }) => className)).size).toBe(productStatuses.length);
  expect(getProductStatus("sold").label).toBe("Sold");
});
