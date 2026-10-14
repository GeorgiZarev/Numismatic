import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import DateRangePicker from "./DateRangePicker";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const labels = { placeholder: "Any date", title: "Date", clear: "Clear date", previousMonth: "Prev", nextMonth: "Next", hint: "", pickEnd: "", today: "Today", last7: "Last 7 days", thisMonth: "This month", done: "Done" };

test("clicking two days in the calendar picks a range", () => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  let range = { from: "2026-10-05", to: "" };
  const render = () => root.render(<DateRangePicker from={range.from} to={range.to} onChange={(next) => { range = next; render(); }} locale="en-GB" labels={labels} />);
  act(render);

  expect(container.textContent).toContain("5 Oct 2026");
  act(() => container.querySelector('[aria-haspopup="dialog"]').click());
  act(() => container.querySelector('[data-day="2026-10-12"]').click());
  expect(range).toEqual({ from: "2026-10-05", to: "2026-10-12" });
  expect(container.querySelector('[role="dialog"]')).toBeNull();
  expect(container.textContent).toContain("5 Oct 2026 – 12 Oct 2026");

  act(() => container.querySelector('[aria-label="Clear date"]').click());
  expect(range).toEqual({ from: "", to: "" });
  expect(container.textContent).toContain("Any date");

  act(() => root.unmount());
  container.remove();
});
