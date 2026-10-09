import { expectedDeliveryDate, isPurchasable } from "./inventory";

describe("storefront inventory", () => {
  afterEach(() => jest.useRealTimers());

  test("positive stock is purchasable only for an active product", () => {
    expect(isPurchasable({ status: "active", stock_quantity: 2 })).toBe(true);
    expect(isPurchasable({ status: "active", stock_quantity: 0 })).toBe(false);
    expect(isPurchasable({ status: "hidden", stock_quantity: 2 })).toBe(false);
  });

  test("expected delivery appears only for a relevant out-of-stock show product", () => {
    jest.useFakeTimers().setSystemTime(new Date("2026-10-09T12:00:00"));
    const product = { stock_quantity: 0, zero_stock_action: "show", expected_delivery_date: "2026-10-10" };
    expect(expectedDeliveryDate(product)).toBeInstanceOf(Date);
    expect(expectedDeliveryDate({ ...product, expected_delivery_date: "2026-10-08" })).toBeNull();
    expect(expectedDeliveryDate({ ...product, stock_quantity: 1 })).toBeNull();
    expect(expectedDeliveryDate({ ...product, zero_stock_action: "hide" })).toBeNull();
  });
});
