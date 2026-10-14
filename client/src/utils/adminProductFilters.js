export const filterAdminProducts = (products, productType, category) => products.filter((product) => {
  if (productType !== "all" && product.product_type !== productType) return false;
  return productType !== "consumable" || !category || product.consumable_category === category;
});
