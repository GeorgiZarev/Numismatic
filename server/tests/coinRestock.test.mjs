import { restockTimestamp } from "../utils/coinRestock.js";

describe("restockTimestamp", () => {
  const now = new Date("2026-10-09T12:00:00Z");

  test.each([
    [0, 1],
    [10, 13],
  ])("marks an admin stock increase from %s to %s", (before, after) => {
    expect(restockTimestamp(before, after, now)).toBe(now);
  });

  test.each([
    [0, 0],
    [2, 2],
    [2, 0],
    [0, undefined],
  ])("does not mark %s to %s as a restock", (before, after) => {
    expect(restockTimestamp(before, after, now)).toBeNull();
  });
});
