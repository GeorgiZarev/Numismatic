// Products have an English name and an optional Bulgarian one. Bulgarian
// visitors see the Bulgarian name when it is filled in, everyone else the English.
export const productName = (product, language) =>
  (String(language || "").startsWith("bg") && product?.name_bg) || product?.name || "";
