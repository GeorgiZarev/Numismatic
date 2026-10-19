// The shop menus and the homepage tiles are built from these lists: each metal
// is a menu in the top bar and a homepage tile, each section is a row inside
// it. Adding one is a one-line change.
export const METALS = [
  { value: "Gold", label: "nav.goldCoins", tile: "home.gold" },
  { value: "Silver", label: "nav.silverCoins", tile: "home.silver" },
];
export const SECTIONS = [
  { type: "coin", label: "home.numismaticCoins" },
  { type: "investment", label: "home.investmentCoins" },
];

export const shopUrl = (params) => `/all-products?${new URLSearchParams(params)}`;
