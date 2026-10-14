import { useState } from "react";
import { isCroppableShape, productImageUrl } from "../../utils/cloudinaryImage";

// One frame for every product photo, on white. Cloudinary photos arrive already shaped
// (square crop for coins, untouched width for wide pictures), so `contain` fills the frame
// without cutting anything important. Other URLs are measured after loading instead.
const sizes = {
  card: { box: "aspect-square w-full", width: 600 },
  xs: { box: "h-10 w-10", width: 120 },
  sm: { box: "h-12 w-12", width: 120 },
  md: { box: "h-16 w-16", width: 160 },
  lg: { box: "h-24 w-24 sm:h-28 sm:w-28", width: 240 },
};

const ProductPhoto = ({ src, alt = "", size = "card", fallback = null, className = "", imageClassName = "", lazy = true }) => {
  const [coverOther, setCoverOther] = useState(false);
  const { box, width } = sizes[size];
  const deliveredSrc = productImageUrl(src, width);
  const fromCloudinary = deliveredSrc !== src;

  return (
    <span className={`flex shrink-0 items-center justify-center overflow-hidden bg-white ${size === "card" ? "" : "rounded border border-[#e3e8e5]"} ${box} ${className}`}>
      {src ? (
        <img
          src={deliveredSrc}
          alt={alt}
          loading={lazy ? "lazy" : undefined}
          decoding="async"
          onLoad={fromCloudinary ? undefined : (event) => setCoverOther(isCroppableShape(event.currentTarget.naturalWidth, event.currentTarget.naturalHeight))}
          className={`block h-full w-full object-center ${coverOther ? "object-cover" : "object-contain"} ${imageClassName}`}
        />
      ) : fallback}
    </span>
  );
};

export default ProductPhoto;
