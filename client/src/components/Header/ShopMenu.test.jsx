import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import ShopMenu, { MobileShopMenu } from "./ShopMenu";

jest.mock("react-router-dom", () => ({
  Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
  useLocation: () => ({ pathname: "/", search: "" }),
}), { virtual: true });
jest.mock("@tanstack/react-query", () => ({
  useQuery: () => ({
    data: [
      { product_type: "coin", composition_metal: "Gold", country: "Italy" },
      { product_type: "coin", composition_metal: "Gold", country: "Austria" },
      { product_type: "coin", composition_metal: "Silver", country: "France" },
      { product_type: "investment", composition_metal: "Gold", country: null },
    ],
  }),
}));
jest.mock("../../api/coins", () => ({ fetchCoins: jest.fn() }));

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const t = (key) => key;
const hrefs = (container) => [...container.querySelectorAll("a")].map((link) => link.getAttribute("href"));
const hover = (element) => act(() => element.dispatchEvent(new MouseEvent("mouseover", { bubbles: true })));

const renderInto = (ui) => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => root.render(ui));
  return { container, cleanup: () => { act(() => root.unmount()); container.remove(); } };
};

test("desktop menus open on hover and show countries for the hovered section", () => {
  const { container, cleanup } = renderInto(<ShopMenu t={t} />);
  expect(hrefs(container)).toEqual([
    "/all-products?composition_metal=Gold",
    "/all-products?composition_metal=Silver",
    "/all-products?product_type=consumable",
  ]);

  hover(container.querySelector('a[href="/all-products?composition_metal=Gold"]'));
  hover(container.querySelector('a[href="/all-products?product_type=coin&composition_metal=Gold"]'));
  expect(hrefs(container.querySelector("#shop-menu-gold"))).toEqual([
    "/all-products?product_type=coin&composition_metal=Gold",
    "/all-products?product_type=investment&composition_metal=Gold",
    "/all-products?product_type=coin&composition_metal=Gold&country=Austria",
    "/all-products?product_type=coin&composition_metal=Gold&country=Italy",
    "/all-products?product_type=coin&composition_metal=Gold",
  ]);
  cleanup();
});

test("mobile menu opens a metal with a tap", () => {
  const { container, cleanup } = renderInto(<MobileShopMenu t={t} />);
  const silver = [...container.querySelectorAll("button")].find((button) => button.textContent === "nav.silverCoins");
  act(() => silver.click());
  expect(hrefs(container.querySelector("#mobile-shop-menu-silver"))).toEqual([
    "/all-products?product_type=coin&composition_metal=Silver",
    "/all-products?product_type=coin&composition_metal=Silver&country=France",
    "/all-products?product_type=coin&composition_metal=Silver",
    "/all-products?product_type=investment&composition_metal=Silver",
  ]);
  cleanup();
});
