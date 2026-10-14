export const coinDetailFields = [
  { name: "country", label: "Country", translationKey: "country", required: true, maxLength: 100 },
  { name: "coin_grading", label: "Grade", translationKey: "grade", maxLength: 50 },
  { name: "denomination", label: "Denomination", translationKey: "denomination" },
  { name: "year", label: "Year", translationKey: "year", type: "number", min: 1700, max: new Date().getFullYear(), step: 1, required: true },
  { name: "weight", label: "Weight (g)", translationKey: "weight", inputMode: "decimal" },
  { name: "fineness", label: "Fineness (out of 1000)", translationKey: "fineness", type: "number", min: 0, max: 1000, step: 1 },
  { name: "pure_weight", label: "Pure weight (g)", translationKey: "pure_weight", type: "number", min: 0, step: "0.001" },
  { name: "mintage", label: "Mintage", translationKey: "mintage", type: "number", min: 0, step: 1 },
  { name: "diameter", label: "Diameter (mm)", translationKey: "diameter", inputMode: "decimal" },
];

export const formatCoinFact = (name, value, t) => {
  if (name === "fineness") return `${value}/1000`;
  if (name === "mintage") return `${new Intl.NumberFormat(t("shop.dateLocale")).format(Number(value))} ${t("coinDetails.pieces")}`;
  if (name === "pure_weight") return `${Number(value)} ${t("coinDetails.grams")}`;
  if (name === "weight" || name === "diameter") {
    const text = String(value).trim();
    const unit = name === "weight" ? "grams" : "millimeters";
    return /^\d+(?:[.,]\d+)?$/.test(text) ? `${text} ${t(`coinDetails.${unit}`)}` : text;
  }
  return value;
};
