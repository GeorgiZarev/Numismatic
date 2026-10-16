import { productName } from "./productName";

test("Bulgarian visitors see the Bulgarian name when there is one", () => {
  const coin = { name: "Silver lev", name_bg: "Сребърен лев" };
  expect(productName(coin, "bg")).toBe("Сребърен лев");
  expect(productName(coin, "en")).toBe("Silver lev");
  expect(productName({ name: "Silver lev", name_bg: null }, "bg")).toBe("Silver lev");
  expect(productName(null, "bg")).toBe("");
});
