export const PRODUCT_TYPES = ["coin", "investment", "consumable"];

const CATEGORY_LABELS = {
  coin: "nav.coins",
  investment: "nav.investment",
  consumable: "nav.accessories",
};

export const shopTitleKey = (productType) => CATEGORY_LABELS[productType] || "shop.allItems";

const API_FILTERS = [
  "country",
  "composition_metal",
  "coin_grading",
  "minPrice",
  "maxPrice",
  "search",
  "product_type",
  "consumable_category",
  "sort",
  "order",
];

export const readShopFilters = (params) => ({
  product_type: PRODUCT_TYPES.includes(params.get("product_type")) ? params.get("product_type") : "all",
  country: params.get("country") || "",
  composition_metal: params.get("composition_metal") || "",
  coin_grading: params.get("coin_grading") || "",
  minPrice: params.get("minPrice") || "",
  maxPrice: params.get("maxPrice") || "",
  minYear: params.get("minYear") || "",
  maxYear: params.get("maxYear") || "",
  denomination: params.get("denomination") || "",
  consumable_category: params.get("consumable_category") || "",
  search: params.get("search") || "",
  sort: ["price", "year"].includes(params.get("sort")) ? params.get("sort") : "",
  order: ["asc", "desc"].includes(params.get("order")) ? params.get("order") : "",
});

export const toApiFilters = (filters) =>
  Object.fromEntries(
    API_FILTERS.filter((key) => filters[key] && filters[key] !== "all")
      .map((key) => [key, filters[key]])
  );

export const filterLocalProducts = (products, filters) =>
  products.filter((product) => {
    const year = Number(product.year);
    if (filters.minYear && (!year || year < Number(filters.minYear))) return false;
    if (filters.maxYear && (!year || year > Number(filters.maxYear))) return false;
    if (filters.denomination && !String(product.denomination || "").toLowerCase().includes(filters.denomination.toLowerCase())) return false;
    return true;
  });
