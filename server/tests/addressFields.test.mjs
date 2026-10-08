import { addressSchema } from "../validators/addressValidators.js";
import { orderCreateSchema } from "../validators/orderValidators.js";

const savedAddress = {
  label: "Home",
  full_name: "Maria Petrova",
  phone: "+359876305026",
  address: "Example Street 10",
  postal_code: "1000",
  city: "Sofia",
  address_line_2: "Apartment 4",
  country: "bg",
  notes: "",
  is_default: true,
};

test("saved addresses retain postal code, additional details and country", () => {
  const result = addressSchema.validate(savedAddress);
  expect(result.error).toBeUndefined();
  expect(result.value).toMatchObject({ postal_code: "1000", address_line_2: "Apartment 4", country: "BG" });
});

test("legacy addresses without the new fields remain valid", () => {
  const { postal_code, address_line_2, country, ...legacyAddress } = savedAddress;
  expect(addressSchema.validate(legacyAddress).error).toBeUndefined();
});

test("orders keep structured delivery details", () => {
  const result = orderCreateSchema.validate({
    customer_name: savedAddress.full_name,
    phone: savedAddress.phone,
    email: "maria@example.com",
    address: savedAddress.address,
    city: savedAddress.city,
    postal_code: savedAddress.postal_code,
    address_line_2: savedAddress.address_line_2,
    country: savedAddress.country,
    payment_method: "cash_on_delivery",
    items: [{ coin_id: "c4b22276-775e-4e5a-b074-11723d5493d1", quantity: 1 }],
  });
  expect(result.error).toBeUndefined();
  expect(result.value.country).toBe("BG");
});
