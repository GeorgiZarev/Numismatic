export const emptyCoinForm = {
  name: "",
  description: "",
  price: "",
  year: "",
  country: "Montenegro",
  currency: "EUR",
  product_type: "coin",
  consumable_category: "",
  monarch: "",
  price_value: "",
  composition_metal: "",
  weight: "",
  diameter: "",
  shape: "",
  technique: "",
  denomination: "",
  lettering: "",
  script: "",
  mintage: "",
  mint_place: "",
  coin_grading: "",
  number: "",
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
  stock_quantity: coin?.stock_quantity ?? 0,
  zero_stock_action: coin?.zero_stock_action || "hide",
  expected_delivery_date: coin?.expected_delivery_date?.slice(0, 10) || "",
});

export const buildCoinFormData = (formData) => {
  const data = new FormData();

  Object.entries(formData).forEach(([key, value]) => {
    if (key === "expected_delivery_date") {
      data.append(key, value || "");
      return;
    }
    if (formData.product_type !== "consumable" && key === "consumable_category") return;
    if (formData.product_type !== "coin" && ["year", "country", "monarch", "denomination", "coin_grading", "mintage", "mint_place", "lettering", "script", "price_value"].includes(key)) return;
    if (key === "photo" && value) {
      data.append("photo", value);
    } else if (key !== "photo" && value !== "" && value !== null) {
      data.append(key, value);
    }
  });

  return data;
};
