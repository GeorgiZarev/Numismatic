import { buildCoinFormData, coinToForm, emptyCoinForm, productStockQuantity, savedInventoryMatches } from "./coinForm";

test("editing stock sends the entered quantity instead of the old zero", () => {
  const form = coinToForm({
    id: "product-id",
    name: "Example coin",
    stock_quantity: 0,
    zero_stock_action: "hide",
    status: "active",
    product_type: "coin",
  });

  const request = buildCoinFormData({ ...form, stock_quantity: "7" });
  expect(request.get("stock_quantity")).toBe("7");
  expect(request.get("zero_stock_action")).toBe("hide");
});

test("coin form sends the new facts and omits removed legacy fields", () => {
  const form = coinToForm({
    name: "1 Libra Peru 1918",
    product_type: "coin",
    country: "Peru",
    year: 1918,
    coin_grading: "MS 62",
    denomination: "1 Libra",
    weight: "7.99",
    fineness: 917,
    pure_weight: "7.320",
    mintage: 600000,
    diameter: "22.00",
    monarch: "Legacy value",
  });

  const request = buildCoinFormData(form);
  expect(request.get("country")).toBe("Peru");
  expect(request.get("fineness")).toBe("917");
  expect(request.get("pure_weight")).toBe("7.320");
  expect(request.get("monarch")).toBeNull();
});

test("clearing a coin measurement sends an empty value", () => {
  const request = buildCoinFormData({ ...emptyCoinForm, fineness: "", pure_weight: "" });
  expect(request.get("fineness")).toBe("");
  expect(request.get("pure_weight")).toBe("");
});

test("accessory details are sent only for their category", () => {
  const cleaning = buildCoinFormData({
    ...emptyCoinForm,
    product_type: "consumable",
    consumable_category: "cleaning_solutions",
    company: "Example",
    volume_ml: "250",
    suitable_metals: "Silver",
  });
  expect(cleaning.get("company")).toBe("Example");
  expect(cleaning.get("volume_ml")).toBe("250");
  expect(cleaning.get("pieces_per_box")).toBeNull();

  const capsules = buildCoinFormData({
    ...emptyCoinForm,
    product_type: "consumable",
    consumable_category: "capsules",
    company: "Lindner",
    pieces_per_box: "50",
  });
  expect(capsules.get("pieces_per_box")).toBe("50");
  expect(capsules.get("company")).toBe("Lindner");

  const holders = buildCoinFormData({
    ...emptyCoinForm,
    product_type: "consumable",
    consumable_category: "cardboard_holders",
    company: "",
  });
  expect(holders.get("company")).toBe("");
});

test("size stock is serialized and its box total replaces the parent quantity", () => {
  const form = {
    ...emptyCoinForm,
    product_type: "consumable",
    consumable_category: "capsules",
    stock_quantity: 99,
    size_stock: [{ size_mm: "15", stock_quantity: "10" }, { size_mm: "17", stock_quantity: "30" }],
  };
  const request = buildCoinFormData(form);
  expect(productStockQuantity(form)).toBe(40);
  expect(request.get("stock_quantity")).toBe("40");
  expect(JSON.parse(request.get("size_stock"))).toEqual(form.size_stock);
  expect(savedInventoryMatches({ stock_quantity: 40, size_stock: [{ size_mm: 15, stock_quantity: 10 }, { size_mm: 17, stock_quantity: 30 }] }, form)).toBe(true);
  expect(savedInventoryMatches({ stock_quantity: 40, size_stock: [] }, form)).toBe(false);
  expect(savedInventoryMatches({ stock_quantity: 40, size_stock: [{ size_mm: 15, stock_quantity: 11 }, { size_mm: 17, stock_quantity: 29 }] }, form)).toBe(false);
});

test("coins and investment products send their metal, accessories do not", () => {
  expect(buildCoinFormData(coinToForm({ product_type: "coin", composition_metal: "Gold" })).get("composition_metal")).toBe("Gold");
  expect(buildCoinFormData(coinToForm({ product_type: "investment", composition_metal: "Silver" })).get("composition_metal")).toBe("Silver");
  expect(buildCoinFormData(coinToForm({ product_type: "consumable", composition_metal: "Gold" })).get("composition_metal")).toBeNull();
});

test("sends both photos when the second one is chosen", () => {
  const first = new File(["a"], "front.jpg");
  const second = new File(["b"], "back.jpg");
  const data = buildCoinFormData({ ...emptyCoinForm, name: "Lev", photo: first, photo_2: second });
  expect(data.get("photo")).toBe(first);
  expect(data.get("photo_2")).toBe(second);
  expect(buildCoinFormData({ ...emptyCoinForm, name: "Lev" }).has("photo_2")).toBe(false);
});
