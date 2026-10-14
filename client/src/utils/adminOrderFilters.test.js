import { emptyOrderFilters, hasOrderFilters, orderQueryParams } from "./adminOrderFilters";

test("typed text reaches the server only after the debounce", () => {
  const filters = { ...emptyOrderFilters, search: "admin", status: "new", city: "Sofia" };
  expect(orderQueryParams(filters, { search: "a" })).toEqual({ ...filters, search: "a" });
});

test("a reversed date range sends only the start day", () => {
  const params = orderQueryParams({ ...emptyOrderFilters, fromDate: "2026-10-10", toDate: "2026-10-01" }, { search: "" });
  expect(params.fromDate).toBe("2026-10-10");
  expect(params.toDate).toBe("");
});

test("clear filters is enabled only when something is set", () => {
  expect(hasOrderFilters(emptyOrderFilters)).toBe(false);
  expect(hasOrderFilters({ ...emptyOrderFilters, city: "Sofia" })).toBe(true);
});
