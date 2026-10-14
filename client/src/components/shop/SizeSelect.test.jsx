import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import SizeSelect from "./SizeSelect";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const sizes = [
  { size_mm: 12, stock_quantity: 11 },
  { size_mm: 13, stock_quantity: 4 },
  { size_mm: 14, stock_quantity: 0 },
];

test("lists colored availability and skips out-of-stock sizes", () => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const onChange = jest.fn();
  const root = createRoot(container);
  act(() => root.render(<SizeSelect sizes={sizes} value="" onChange={onChange} label="Size" placeholder="Choose size" availableLabel="boxes available" outOfStockLabel="Out of stock" />));

  act(() => container.querySelector("button").click());
  const options = container.querySelectorAll('[role="option"]');
  expect(options).toHaveLength(3);
  expect(options[0].textContent).toContain("11 boxes available");
  expect(options[0].innerHTML).toContain("text-[#1f7a4d]");
  expect(options[1].innerHTML).toContain("text-[#a36b00]");
  expect(options[2].textContent).toContain("Out of stock");
  expect(options[2].getAttribute("aria-disabled")).toBe("true");

  act(() => options[2].click());
  expect(onChange).not.toHaveBeenCalled();
  act(() => options[1].click());
  expect(onChange).toHaveBeenCalledWith("13");

  act(() => root.unmount());
  container.remove();
});
