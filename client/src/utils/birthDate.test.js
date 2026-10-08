import { availableBirthDays, daysInMonth, toBirthDate } from "./birthDate";

test("birth date dropdowns produce a valid date", () => {
  expect(toBirthDate("8", "10", "1998")).toBe("1998-10-08");
  expect(daysInMonth("2", "2024")).toBe(29);
  expect(daysInMonth("2", "2025")).toBe(28);
  expect(availableBirthDays("10", "2026", new Date(2026, 9, 8))).toBe(8);
});

test("invalid or future dates are rejected", () => {
  expect(toBirthDate("31", "2", "2024")).toBe("");
  expect(toBirthDate("29", "2", "2025")).toBe("");
  expect(toBirthDate("", "10", "1998")).toBe("");
  expect(toBirthDate("1", "1", "2999")).toBe("");
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  expect(toBirthDate(String(tomorrow.getDate()), String(tomorrow.getMonth() + 1), String(tomorrow.getFullYear()))).toBe("");
});
