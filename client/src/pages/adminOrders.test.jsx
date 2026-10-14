import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AdminOrders from "./adminOrders";
import { fetchAllOrders, fetchOrderCities } from "../api/orders";

jest.mock("../api/orders", () => ({
  fetchAllOrders: jest.fn(),
  fetchOrderCities: jest.fn(),
  updateOrderStatus: jest.fn(),
}));
jest.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key) => key }) }));
jest.mock("../components/orders/AdminOrderDetail", () => () => null);

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const setInputValue = (input, value) => {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
  setter.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
};

test("typing in search keeps the box mounted and focused while orders reload", async () => {
  jest.useFakeTimers();
  // The server answers slowly, so every keystroke would hit the loading state.
  fetchAllOrders.mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve([]), 1000)));
  fetchOrderCities.mockResolvedValue(["Sofia"]);
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  await act(async () => root.render(<QueryClientProvider client={client}><AdminOrders /></QueryClientProvider>));

  const input = container.querySelector('input[name="search"]');
  input.focus();
  let typed = "";
  for (const letter of "admin") {
    typed += letter;
    await act(async () => setInputValue(input, typed));
    await act(async () => { jest.advanceTimersByTime(120); });
    expect(container.querySelector('input[name="search"]')).toBe(input);
    expect(document.activeElement).toBe(input);
  }
  expect(input.value).toBe("admin");

  await act(async () => { jest.advanceTimersByTime(400); });
  // One request at mount and one after the debounce, not one per letter.
  expect(fetchAllOrders.mock.calls.map(([params]) => params.search)).toEqual(["", "admin"]);

  await act(async () => root.unmount());
  container.remove();
  jest.useRealTimers();
});
