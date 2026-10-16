import { useEffect, useId, useState } from "react";
import { FiImage, FiUploadCloud } from "react-icons/fi";

const ProductPhotoField = ({ title = "Photo", name = "photo", photo, photoUrl, onChange }) => {
  const inputId = useId();
  const [preview, setPreview] = useState(photoUrl || "");

  useEffect(() => {
    if (!photo) {
      setPreview(photoUrl || "");
      return undefined;
    }

    const url = URL.createObjectURL(photo);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photo, photoUrl]);

  return (
    <section>
      <h3 className="text-base font-semibold text-[#203730]">{title}</h3>
      <div className="mt-4 flex aspect-square w-full items-center justify-center overflow-hidden rounded-md border border-[#dce4df] bg-[#f6f7f5]">
        {preview ? (
          <img src={preview} alt={`${title} preview`} className="h-full w-full object-contain p-3" />
        ) : (
          <FiImage size={42} strokeWidth={1.2} className="text-[#a8b7ae]" aria-hidden="true" />
        )}
      </div>
      <input id={inputId} type="file" name={name} accept="image/*" onChange={onChange} className="peer sr-only" />
      <label htmlFor={inputId} className="mt-4 flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-[#cbd8d0] bg-white px-4 text-sm font-semibold text-[#235b50] transition-colors hover:bg-[#edf3f0] peer-focus-visible:ring-2 peer-focus-visible:ring-[#b2cfc0]">
        <FiUploadCloud size={18} aria-hidden="true" /> {preview ? "Replace photo" : "Add photo"}
      </label>
      {photo && <p className="mt-2 truncate text-xs text-[#68756e]" title={photo.name}>{photo.name}</p>}
    </section>
  );
};

export default ProductPhotoField;
