import { axiosInstance } from "../utils/axios";
import { updateCoinField } from "./coins";

jest.mock("../utils/axios", () => ({
  axiosInstance: { put: jest.fn() },
}));

beforeEach(() => {
  axiosInstance.put.mockReset();
  axiosInstance.put.mockResolvedValue({ data: { coin: { stock_quantity: 10, price: 45 } } });
});

test.each([
  ["stock_quantity", 10],
  ["price", 45.5],
])("inline %s update sends only its own value", async (field, value) => {
  await updateCoinField("product-id", field, value);

  const [url, data, config] = axiosInstance.put.mock.calls[0];
  expect(url).toBe("/coins/product-id");
  expect([...data.entries()]).toEqual([[field, String(value)]]);
  expect(config.headers["Content-Type"]).toBe("multipart/form-data");
});
