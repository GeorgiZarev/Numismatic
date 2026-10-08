const newestFirst = (field) => (a, b) =>
  (Date.parse(b[field]) || 0) - (Date.parse(a[field]) || 0);

export const selectHomeProducts = (products, limit = 8) => ({
  newlyAdded: [...products].sort(newestFirst("created_at")).slice(0, limit),
  freshlyRestocked: products
    .filter((product) => product.restocked_at)
    .sort(newestFirst("restocked_at"))
    .slice(0, limit),
  coins: products
    .filter((product) => product.product_type === "coin")
    .sort(newestFirst("created_at"))
    .slice(0, limit),
  accessories: products
    .filter((product) => product.product_type === "consumable")
    .sort(newestFirst("created_at"))
    .slice(0, limit),
});
