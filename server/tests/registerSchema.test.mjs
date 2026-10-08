import { loginSchema, registerSchema } from "../validators/authValidators.js";

const baseAccount = {
  email: "collector@example.com",
  email_confirmation: "collector@example.com",
  password: "secure123",
  first_name: "Georgi",
  last_name: "Zarev",
  birth_date: "1990-04-12",
  phone: "+359876305026",
  preferred_language: "bg",
  city: "Sofia",
  address: "Example Street 10",
  postal_code: "1000",
  address_line_2: "Apartment 4",
  country: "BG",
};

test("registration accepts customer details without a username", () => {
  const result = registerSchema.validate(baseAccount);

  expect(result.error).toBeUndefined();
  expect(result.value.birth_date).toBeInstanceOf(Date);
  expect(result.value).not.toHaveProperty("username");
});

test("registration requires customer details and matching email confirmation", () => {
  const { error } = registerSchema.validate({
    email: baseAccount.email,
    password: baseAccount.password,
    email_confirmation: "other@example.com",
  }, { abortEarly: false });

  expect(error?.details.map((detail) => detail.path[0])).toEqual(
    expect.arrayContaining(["first_name", "last_name", "birth_date", "phone", "city", "address", "postal_code", "country", "email_confirmation"])
  );
});

test("registration rejects future birth dates and legacy usernames", () => {
  expect(registerSchema.validate({ ...baseAccount, birth_date: "2999-01-01" }).error).toBeDefined();
  expect(registerSchema.validate({ ...baseAccount, username: "collector_123" }).error).toBeDefined();
});

test("login accepts email and password, not a username", () => {
  expect(loginSchema.validate({ email: baseAccount.email, password: baseAccount.password }).error).toBeUndefined();
  expect(loginSchema.validate({ username: "collector_123", password: baseAccount.password }).error).toBeDefined();
});
