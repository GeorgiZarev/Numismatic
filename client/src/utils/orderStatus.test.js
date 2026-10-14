import { ORDER_STATUSES, orderStatusClass, orderStockEffect } from "./orderStatus";

test("every status has its own colour", () => {
  const classes = ORDER_STATUSES.map(orderStatusClass);
  expect(new Set(classes).size).toBe(ORDER_STATUSES.length);
  expect(orderStatusClass("canceled")).toBe(orderStatusClass("cancelled"));
});

test("stock effect of each kind of status change", () => {
  expect(orderStockEffect("new", false, "confirmed")).toBe("take");
  expect(orderStockEffect("confirmed", true, "packed")).toBe("none");
  expect(orderStockEffect("sent", true, "new")).toBe("returnAndReserve");
  expect(orderStockEffect("confirmed", true, "cancelled")).toBe("return");
  expect(orderStockEffect("new", false, "cancelled")).toBe("release");
  expect(orderStockEffect("cancelled", false, "new")).toBe("reserve");
  expect(orderStockEffect("cancelled", true, "completed")).toBe("take");
  expect(orderStockEffect("cancelled", false, "cancelled")).toBe("none");
});

test("legacy pending orders that already took stock are treated as taken", () => {
  expect(orderStockEffect("new", true, "confirmed")).toBe("none");
  expect(orderStockEffect("new", true, "cancelled")).toBe("return");
});
