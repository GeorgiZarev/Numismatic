import { isInRange, monthGrid, pickDay, shiftMonth } from "./dateRange";

test("October 2026 starts on a Thursday in a Monday-first grid", () => {
  const grid = monthGrid(2026, 9);
  expect(grid.slice(0, 4)).toEqual([null, null, null, "2026-10-01"]);
  expect(grid.filter(Boolean)).toHaveLength(31);
});

test("picking days builds a single day, then a range", () => {
  let range = pickDay({ from: "", to: "" }, "2026-10-05");
  expect(range).toEqual({ from: "2026-10-05", to: "" });
  range = pickDay(range, "2026-10-12");
  expect(range).toEqual({ from: "2026-10-05", to: "2026-10-12" });
  expect(isInRange("2026-10-08", range.from, range.to)).toBe(true);
  expect(pickDay(range, "2026-10-20")).toEqual({ from: "2026-10-20", to: "" });
  expect(pickDay({ from: "2026-10-05", to: "" }, "2026-10-01")).toEqual({ from: "2026-10-01", to: "" });
});

test("months roll over years", () => {
  expect(shiftMonth({ year: 2026, monthIndex: 11 }, 1)).toEqual({ year: 2027, monthIndex: 0 });
  expect(shiftMonth({ year: 2026, monthIndex: 0 }, -1)).toEqual({ year: 2025, monthIndex: 11 });
});
