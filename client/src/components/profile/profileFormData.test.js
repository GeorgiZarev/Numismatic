import { profileFormFromUser, splitFullName } from "./profileFormData";

test("splits existing names without discarding additional surnames", () => {
  expect(splitFullName("  Maria   Ivanova Petrova ")).toEqual({ first_name: "Maria", last_name: "Ivanova Petrova" });
  expect(splitFullName("")).toEqual({ first_name: "", last_name: "" });
});

test("populates the segmented birth date from a stored date", () => {
  expect(profileFormFromUser({ full_name: "Maria Petrova", birth_date: "1990-04-09T00:00:00.000Z" })).toMatchObject({
    first_name: "Maria", last_name: "Petrova", birth_day: "9", birth_month: "4", birth_year: "1990",
  });
  expect(profileFormFromUser(null)).toMatchObject({ birth_day: "", birth_month: "", birth_year: "" });
});
