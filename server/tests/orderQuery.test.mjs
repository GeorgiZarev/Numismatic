import { orderQuerySchema } from "../validators/orderValidators.js";

const validate = (query) => orderQuerySchema.validate(query, { stripUnknown: true, convert: true });

test("accepts the admin order filters together", () => {
  const { error, value } = validate({ search: " admin ", status: "new", city: "Sofia", fromDate: "2026-10-01", toDate: "2026-10-10" });
  expect(error).toBeUndefined();
  expect(value).toEqual({ search: "admin", status: "new", city: "Sofia", fromDate: "2026-10-01", toDate: "2026-10-10" });
});

test("a single day keeps its plain date", () => {
  expect(validate({ fromDate: "2026-10-10" }).value.fromDate).toBe("2026-10-10");
});

test("rejects impossible dates, other formats, and reversed ranges", () => {
  expect(validate({ fromDate: "2026-02-30" }).error).toBeDefined();
  expect(validate({ fromDate: "10/10/2026" }).error).toBeDefined();
  expect(validate({ fromDate: "2026-10-10", toDate: "2026-10-01" }).error).toBeDefined();
});

test("empty filters are allowed", () => {
  expect(validate({ search: "", city: "", fromDate: "", toDate: "" }).error).toBeUndefined();
});
