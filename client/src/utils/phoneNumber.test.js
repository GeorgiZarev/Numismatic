import { toInternationalPhone } from "./phoneNumber";

test("adds the selected calling code and removes a local trunk zero", () => {
  expect(toInternationalPhone("+359", "0876 305 026")).toBe("+359876305026");
  expect(toInternationalPhone("+49", "0151 1234567")).toBe("+491511234567");
});

test("does not prepend a second calling code to an international number", () => {
  expect(toInternationalPhone("+359", "+49 151 1234567")).toBe("+491511234567");
  expect(toInternationalPhone("+359", "")).toBe("");
});
