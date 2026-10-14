import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import AccessorySizeMatrix from "./AccessorySizeMatrix";

test("renders sizes and box quantities as paired rows", () => {
  const markup = renderToStaticMarkup(<AccessorySizeMatrix product={{ size_stock: [{ size_mm: 25, stock_quantity: 40 }, { size_mm: 27, stock_quantity: 30 }] }} onEdit={() => {}} />);
  expect(markup).toContain("Sizes");
  expect(markup).toContain("Quantity");
  expect(markup).toContain("25 mm");
  expect(markup).toContain("40 boxes");
  expect(markup).toContain("27 mm");
  expect(markup).toContain("30 boxes");
});

test("flags previously recorded stock with no size breakdown", () => {
  const markup = renderToStaticMarkup(<AccessorySizeMatrix product={{ size_stock: [], stock_quantity: 40 }} onEdit={() => {}} />);
  expect(markup).toContain("40 boxes are recorded without a size breakdown");
  expect(markup).toContain("Add sizes");
});
