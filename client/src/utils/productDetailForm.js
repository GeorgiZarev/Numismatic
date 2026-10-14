import { coinDetailFields } from "./coinFields";

export const buildProductDetailUpdate = (product, formData, photo) => {
  const fields = product.product_type === "coin"
    ? ["name", ...coinDetailFields.map(({ name }) => name)]
    : product.product_type === "investment"
      ? ["name", "composition_metal", "weight"]
      : product.consumable_category === "cleaning_solutions"
        ? ["name", "company", "volume_ml", "suitable_metals"]
        : ["name", "company", "pieces_per_box"];
  const data = new FormData();
  fields.forEach((field) => {
    const value = formData[field];
    if (value !== undefined && value !== null && (value !== "" || ["fineness", "pure_weight", "company", "volume_ml", "suitable_metals", "pieces_per_box"].includes(field))) {
      data.append(field, value);
    }
  });
  if (photo) data.append("photo", photo);
  return data;
};
