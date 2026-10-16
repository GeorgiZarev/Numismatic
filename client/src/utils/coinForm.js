export const emptyCoinForm = {
  name: "",
  description: "",
  price: "",
  year: "",
  country: "",
  currency: "EUR",
  product_type: "coin",
  composition_metal: "",
  consumable_category: "",
  company: "",
  volume_ml: "",
  suitable_metals: "",
  pieces_per_box: "",
  size_stock: [],
  weight: "",
  fineness: "",
  pure_weight: "",
  diameter: "",
  denomination: "",
  mintage: "",
  coin_grading: "",
  status: "active",
  stock_quantity: "",
  zero_stock_action: "hide",
  expected_delivery_date: "",
  photo: null,
};

export const coinToForm = (coin) => ({
  ...emptyCoinForm,
  ...coin,
  price: coin?.price ?? "",
  year: coin?.year ?? "",
  mintage: coin?.mintage ?? "",
  photo: null,
  currency: "EUR",
  consumable_category: coin?.consumable_category || "",
  company: coin?.company || "",
  volume_ml: coin?.volume_ml ?? "",
  suitable_metals: coin?.suitable_metals || "",
  pieces_per_box: coin?.pieces_per_box ?? "",
  size_stock: Array.isArray(coin?.size_stock) ? coin.size_stock : [],
  stock_quantity: coin?.stock_quantity ?? 0,
  zero_stock_action: coin?.zero_stock_action || "hide",
  expected_delivery_date: coin?.expected_delivery_date?.slice(0, 10) || "",
});

export const buildCoinFormData = (formData) => {
  const data = new FormData();
  const sized = formData.product_type === "consumable" && ["capsules", "cardboard_holders"].includes(formData.consumable_category);
  const removedFields = new Set(["monarch", "price_value", "shape", "technique", "lettering", "script", "mint_place", "number"]);

  Object.entries(formData).forEach(([key, value]) => {
    if (removedFields.has(key)) return;
    if (key === "composition_metal") {
      if (formData.product_type !== "consumable" && value) data.append(key, value);
      return;
    }
    if (key === "size_stock") {
      if (sized) data.append(key, JSON.stringify(value || []));
      return;
    }
    if (key === "pieces_per_box") {
      if (sized) data.append(key, value ?? "");
      return;
    }
    if (key === "stock_quantity" && sized) {
      data.append(key, productStockQuantity(formData));
      return;
    }
    if (key === "expected_delivery_date") {
      data.append(key, value || "");
      return;
    }
    if (formData.product_type !== "consumable" && key === "consumable_category") return;
    if (formData.product_type !== "consumable" && ["company", "volume_ml", "suitable_metals"].includes(key)) return;
    if (formData.consumable_category !== "cleaning_solutions" && ["volume_ml", "suitable_metals"].includes(key)) return;
    if (["company", "volume_ml", "suitable_metals"].includes(key)) {
      data.append(key, value ?? "");
      return;
    }
    if (formData.product_type !== "coin" && ["year", "country", "denomination", "coin_grading", "mintage", "fineness", "pure_weight", "diameter"].includes(key)) return;
    if (key === "fineness" || key === "pure_weight") {
      data.append(key, value ?? "");
      return;
    }
    if (key === "photo" && value) {
      data.append("photo", value);
    } else if (key !== "photo" && value !== "" && value !== null) {
      data.append(key, value);
    }
  });

  return data;
};

export const productStockQuantity = (formData) =>
  formData.product_type === "consumable" && ["capsules", "cardboard_holders"].includes(formData.consumable_category)
    ? (formData.size_stock || []).reduce((total, row) => total + (Number(row.stock_quantity) || 0), 0)
    : Number(formData.stock_quantity);

export const savedInventoryMatches = (savedProduct, formData) => {
  if (Number(savedProduct?.stock_quantity) !== productStockQuantity(formData)) return false;
  if (formData.product_type !== "consumable" || !["capsules", "cardboard_holders"].includes(formData.consumable_category)) return true;

  const submitted = formData.size_stock || [];
  const saved = Array.isArray(savedProduct?.size_stock) ? savedProduct.size_stock : [];
  return submitted.length > 0 && saved.length === submitted.length && submitted.every((row) =>
    saved.some((entry) => Number(entry.size_mm) === Number(row.size_mm) && Number(entry.stock_quantity) === Number(row.stock_quantity))
  );
};
