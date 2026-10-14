import { coinCreationSchema, updateCoinSchema } from "../validators/coinValidators.js";

const baseProduct = {
  name: "1964 Kennedy Half Dollar",
  price: 50,
  product_type: "coin",
  country: "United States",
  year: 1964,
};

describe("product inventory validation", () => {
  test("accepts the Peru coin facts shown in the new form", () => {
    const result = coinCreationSchema.validate({
      ...baseProduct,
      name: "1 Libra Peru 1918 NGC MS 62",
      country: "Peru",
      year: 1918,
      coin_grading: "NGC MS 62",
      denomination: "1 Libra",
      weight: "7.99",
      fineness: 917,
      pure_weight: 7.32,
      mintage: 600000,
      diameter: "22.00",
      stock_quantity: 1,
    });
    expect(result.error).toBeUndefined();
    expect(result.value.country).toBe("Peru");
  });

  test("rejects fineness outside parts per thousand", () => {
    expect(updateCoinSchema.validate({ fineness: 1001 }).error).toBeDefined();
    expect(updateCoinSchema.validate({ fineness: "", pure_weight: "" }).error).toBeUndefined();
  });

  test("requires a nonnegative integer quantity on creation", () => {
    expect(coinCreationSchema.validate(baseProduct).error).toBeDefined();
    expect(coinCreationSchema.validate({ ...baseProduct, stock_quantity: -1 }).error).toBeDefined();
    expect(coinCreationSchema.validate({ ...baseProduct, stock_quantity: 0.5 }).error).toBeDefined();
  });

  test.each(["hide", "show", "review_delete"])("accepts %s at zero stock", (action) => {
    const result = coinCreationSchema.validate({
      ...baseProduct,
      stock_quantity: 0,
      zero_stock_action: action,
    });
    expect(result.error).toBeUndefined();
    expect(result.value.zero_stock_action).toBe(action);
  });

  test("defaults a new product to hide and rejects unknown rules", () => {
    expect(coinCreationSchema.validate({ ...baseProduct, stock_quantity: 0 }).value.zero_stock_action).toBe("hide");
    expect(updateCoinSchema.validate({ zero_stock_action: "delete" }).error).toBeDefined();
  });

  test("allows editing stock and the optional expected delivery date", () => {
    expect(updateCoinSchema.validate({ stock_quantity: 3, zero_stock_action: "show", expected_delivery_date: "2026-11-10" }).error).toBeUndefined();
    expect(updateCoinSchema.validate({ expected_delivery_date: "" }).error).toBeUndefined();
    expect(updateCoinSchema.validate({ stock_quantity: -2 }).error).toBeDefined();
  });
});
