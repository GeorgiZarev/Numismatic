import { fetchCoins } from "./coins";
import { axiosInstance } from "../utils/axios";

jest.mock("../utils/axios", () => ({
  axiosInstance: { get: jest.fn() },
}));

afterEach(() => jest.clearAllMocks());

test("returns products from the API", async () => {
  const products = [{ id: "coin-1", name: "Coin" }];
  axiosInstance.get.mockResolvedValue({ data: products });

  await expect(fetchCoins({ product_type: "coin" })).resolves.toEqual(products);
  expect(axiosInstance.get).toHaveBeenCalledWith("/coins?product_type=coin");
});

test("rejects a response that is not a product list", async () => {
  axiosInstance.get.mockResolvedValue({ data: "<html>Not found</html>" });

  await expect(fetchCoins()).rejects.toThrow("unexpected response");
});
