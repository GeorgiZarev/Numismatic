import { coinDetailFields, formatCoinFact } from "./coinFields";

const labels = {
  "shop.dateLocale": "bg-BG",
  "coinDetails.grams": "гр.",
  "coinDetails.millimeters": "мм.",
  "coinDetails.pieces": "бр.",
};
const t = (key) => labels[key];

test("coin facts follow the requested order", () => {
  expect(coinDetailFields.map(({ name }) => name)).toEqual([
    "country", "coin_grading", "denomination", "year", "weight",
    "fineness", "pure_weight", "mintage", "diameter",
  ]);
});

test("coin measurements display their units and fineness", () => {
  expect(formatCoinFact("fineness", 917, t)).toBe("917/1000");
  expect(formatCoinFact("pure_weight", "7.320", t)).toBe("7.32 гр.");
  expect(formatCoinFact("weight", "7.99", t)).toBe("7.99 гр.");
  expect(formatCoinFact("diameter", "22.00", t)).toBe("22.00 мм.");
  expect(formatCoinFact("mintage", 600000, t)).toContain("бр.");
});
