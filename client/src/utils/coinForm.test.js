import { buildCoinFormData, coinToForm } from "./coinForm";

test("editing stock sends the entered quantity instead of the old zero", () => {
  const form = coinToForm({
    id: "product-id",
    name: "Example coin",
    stock_quantity: 0,
    zero_stock_action: "hide",
    status: "active",
    product_type: "coin",
  });

  const request = buildCoinFormData({ ...form, stock_quantity: "7" });
  expect(request.get("stock_quantity")).toBe("7");
  expect(request.get("zero_stock_action")).toBe("hide");
});
