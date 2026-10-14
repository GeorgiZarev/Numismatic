// Near-square and portrait photos (aspect 0.6–1.25) get a smart square crop centred on the subject;
// wide pictures such as logos or two-coin shots are only resized, so nothing important is cut.
// Cloudinary decides per image at delivery time, so photos uploaded before this change benefit too.
const CLOUDINARY_UPLOAD = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/;

export const isCroppableShape = (width, height) => {
  const ratio = width / height;
  return Number.isFinite(ratio) && ratio >= 0.6 && ratio <= 1.25;
};

export const productImageUrl = (url, width = 600) => {
  const match = typeof url === "string" ? url.match(CLOUDINARY_UPLOAD) : null;
  if (!match) return url;
  const [, base, rest] = match;
  // Leave URLs that already carry a transformation alone.
  if (!/^(v\d+\/|[^/,]+\/)/.test(rest) || rest.split("/")[0].includes(",")) return url;
  return `${base}if_ar_gte_0.6_and_ar_lte_1.25/c_fill,ar_1:1,g_auto,w_${width}/if_else/c_limit,w_${width}/if_end/q_auto,f_auto/${rest}`;
};
