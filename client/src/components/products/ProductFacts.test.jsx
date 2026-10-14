import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ProductFacts from "./ProductFacts";

test("coin product facts show the requested details without legacy fields", () => {
  const product = {
    product_type: "coin",
    name: "1 Libra Peru 1918 NGC MS 62",
    country: "Peru",
    coin_grading: "MS 62",
    denomination: "1 Libra",
    year: 1918,
    weight: "7.99",
    fineness: 917,
    pure_weight: "7.320",
    mintage: 600000,
    diameter: "22.00",
    monarch: "Legacy value",
  };
  const labels = {
    "shop.dateLocale": "en-GB",
    "coinDetails.grams": "g",
    "coinDetails.millimeters": "mm",
    "coinDetails.pieces": "pcs",
  };
  const markup = renderToStaticMarkup(<ProductFacts product={product} editMode={false} t={(key) => labels[key] || key} />);

  expect(markup).toContain("Peru");
  expect(markup).toContain("MS 62");
  expect(markup).toContain("917/1000");
  expect(markup).toContain("7.32 g");
  expect(markup).toContain("22.00 mm");
  expect(markup).not.toContain("Legacy value");
});

test("capsule company appears only when provided", () => {
  const product = { product_type: "consumable", consumable_category: "capsules", name: "Capsules", company: "Lindner" };
  const render = (company) => renderToStaticMarkup(<ProductFacts product={{ ...product, company }} editMode={false} t={(key) => key} />);

  expect(render("Lindner")).toContain("Lindner");
  expect(render("")).not.toContain("coinDetails.company");
});
