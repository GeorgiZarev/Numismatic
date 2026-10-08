import { restockTimestamp } from "../utils/coinRestock.js";

describe("restockTimestamp", () => {
  const now = new Date("2026-10-09T12:00:00Z");

  test("marks a sold product returned to active", () => {
    expect(restockTimestamp("sold", "active", now)).toBe(now);
  });

  test.each([
    ["draft", "active"],
    ["hidden", "active"],
    ["active", "active"],
    ["sold", "sold"],
    ["active", undefined],
  ])("does not mark %s to %s as a restock", (before, after) => {
    expect(restockTimestamp(before, after, now)).toBeNull();
  });
});
