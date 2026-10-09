import { useEffect, useRef, useState } from "react";
import { FiX } from "react-icons/fi";
import { getProductStatus, productStatuses } from "../../utils/productStatus";

const ProductStatusModal = ({ product, saving, error, onClose, onSave }) => {
  const [status, setStatus] = useState(product.status || "active");
  const firstOptionRef = useRef(null);

  useEffect(() => {
    firstOptionRef.current?.focus();
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "Escape" && !saving) onClose();
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-[#142521]/50 p-4" role="presentation" onKeyDown={handleKeyDown}>
      <div role="dialog" aria-modal="true" aria-labelledby="product-status-title" className="w-full max-w-md rounded-md bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#e7ece8] px-5 py-4">
          <h2 id="product-status-title" className="text-lg font-semibold text-[#203730]">Change status</h2>
          <button type="button" onClick={onClose} disabled={saving} aria-label="Close status dialog" className="grid h-9 w-9 place-items-center rounded text-[#53655b] hover:bg-[#f1f4f1] disabled:opacity-50"><FiX size={20} /></button>
        </div>
        <form onSubmit={(event) => { event.preventDefault(); onSave(status); }} className="p-5">
          <p className="mb-4 truncate text-sm text-[#53655b]">{product.name}</p>
          <fieldset className="space-y-2">
            <legend className="sr-only">Product status</legend>
            {productStatuses.map((option, index) => (
              <label key={option.value} className="flex cursor-pointer items-center gap-3 rounded border border-[#e3e9e5] px-3 py-3 hover:bg-[#f8faf8]">
                <input ref={index === 0 ? firstOptionRef : undefined} type="radio" name="product_status" value={option.value} checked={status === option.value} onChange={() => setStatus(option.value)} className="accent-[#235b50]" />
                <span className={`rounded border px-2.5 py-1 text-xs font-semibold ${getProductStatus(option.value).className}`}>{option.label}</span>
              </label>
            ))}
          </fieldset>
          {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} disabled={saving} className="min-h-11 rounded border border-[#cbd6ce] px-4 text-sm font-semibold text-[#203730] disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={saving || status === product.status} className="min-h-11 rounded bg-[#235b50] px-5 text-sm font-semibold text-white hover:bg-[#19473e] disabled:cursor-not-allowed disabled:opacity-50">{saving ? "Saving..." : "Save status"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductStatusModal;
