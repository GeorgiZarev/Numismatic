import { coinCreationSchema } from "../validators/coinValidators.js";

const base = {
  name: "Capsules",
  price: 12,
  stock_quantity: 1,
  product_type: "consumable",
  consumable_category: "capsules",
  size_stock: '[{"size_mm":15,"stock_quantity":1}]',
  pieces_per_box: 50,
};

test("capsule boxes need pieces per box but company is optional", () => {
  expect(coinCreationSchema.validate({ ...base, pieces_per_box: undefined }).error).toBeDefined();
  expect(coinCreationSchema.validate({ ...base, pieces_per_box: 0 }).error).toBeDefined();
  expect(coinCreationSchema.validate(base).error).toBeUndefined();
  expect(coinCreationSchema.validate({ ...base, company: "Lindner" }).error).toBeUndefined();
  expect(coinCreationSchema.validate({ ...base, consumable_category: "cardboard_holders", company: "" }).error).toBeUndefined();
});

test("cleaning solutions require company, volume, and suitable metals", () => {
  const solution = { ...base, consumable_category: "cleaning_solutions", size_stock: undefined, pieces_per_box: undefined };
  expect(coinCreationSchema.validate(solution).error).toBeDefined();
  expect(coinCreationSchema.validate({ ...solution, company: "", volume_ml: 250, suitable_metals: "Silver" }).error).toBeDefined();
  expect(coinCreationSchema.validate({ ...solution, company: "Example", volume_ml: 250, suitable_metals: "Silver" }).error).toBeUndefined();
});
