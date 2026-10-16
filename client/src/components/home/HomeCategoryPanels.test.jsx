import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import HomeCategoryPanels from "./HomeCategoryPanels";

jest.mock("react-router-dom", () => ({
  Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
}), { virtual: true });
jest.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key) => key }) }));

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

test("gold and silver tiles list both coin kinds, accessories list their kinds", () => {
  const container = document.createElement("div");
  const root = createRoot(container);
  act(() => root.render(<HomeCategoryPanels />));

  const hrefs = [...container.querySelectorAll("a")].map((link) => link.getAttribute("href"));
  expect(hrefs).toEqual([
    "/all-products?composition_metal=Gold",
    "/all-products?product_type=coin&composition_metal=Gold",
    "/all-products?product_type=investment&composition_metal=Gold",
    "/all-products?composition_metal=Silver",
    "/all-products?product_type=coin&composition_metal=Silver",
    "/all-products?product_type=investment&composition_metal=Silver",
    "/all-products?product_type=consumable",
    "/all-products?product_type=consumable&consumable_category=capsules",
    "/all-products?product_type=consumable&consumable_category=cleaning_solutions",
    "/all-products?product_type=consumable&consumable_category=cardboard_holders",
  ]);
  act(() => root.unmount());
});
