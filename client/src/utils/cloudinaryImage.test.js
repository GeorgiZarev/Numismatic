import { isCroppableShape, productImageUrl } from "./cloudinaryImage";

const photo = "https://res.cloudinary.com/ddgxlin64/image/upload/v1791651568/coins/tngqbb5wsr5y6ritcxm0.jpg";

test("Cloudinary photos get the shape-aware square crop", () => {
  expect(productImageUrl(photo, 200)).toBe(
    "https://res.cloudinary.com/ddgxlin64/image/upload/if_ar_gte_0.6_and_ar_lte_1.25/c_fill,ar_1:1,g_auto,w_200/if_else/c_limit,w_200/if_end/q_auto,f_auto/v1791651568/coins/tngqbb5wsr5y6ritcxm0.jpg"
  );
});

test("other images and already-transformed URLs are left alone", () => {
  expect(productImageUrl("https://example.com/coin.jpg")).toBe("https://example.com/coin.jpg");
  const transformed = "https://res.cloudinary.com/x/image/upload/c_fill,w_100/v1/coins/a.jpg";
  expect(productImageUrl(transformed)).toBe(transformed);
  expect(productImageUrl(null)).toBeNull();
});

test("only portrait and near-square shapes are cropped", () => {
  expect(isCroppableShape(600, 800)).toBe(true);
  expect(isCroppableShape(1000, 1000)).toBe(true);
  expect(isCroppableShape(800, 320)).toBe(false);
  expect(isCroppableShape(300, 800)).toBe(false);
});
