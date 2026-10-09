import { useEffect, useRef, useState } from "react";
import { FiX } from "react-icons/fi";
import { getZeroStockAction, ZERO_STOCK_ACTIONS } from "../../utils/zeroStockAction";

const ProductMethodModal = ({ product, saving, error, onClose, onSave }) => {
  const [method, setMethod] = useState(product.zero_stock_action || "hide");
  const firstOptionRef = useRef(null);

  useEffect(() => {
    firstOptionRef.current?.focus();
  }, []);

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-[#142521]/50 p-4" role="presentation" onKeyDown={(event) => { if (event.key === "Escape" && !saving) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="product-method-title" className="w-full max-w-md rounded-md bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#e7ece8] px-5 py-4">
          <h2 id="product-method-title" className="text-lg font-semibold text-[#203730]">Change method</h2>
          <button type="button" onClick={onClose} disabled={saving} aria-label="Close method dialog" className="grid h-9 w-9 place-items-center rounded text-[#53655b] hover:bg-[#f1f4f1] disabled:opacity-50"><FiX size={20} /></button>
        </div>
        <form onSubmit={(event) => { event.preventDefault(); onSave(method); }} className="p-5">
          <p className="mb-4 truncate text-sm text-[#53655b]">{product.name}</p>
          <fieldset className="space-y-2">
            <legend className="sr-only">When quantity reaches zero</legend>
            {ZERO_STOCK_ACTIONS.map((option, index) => (
              <label key={option.value} className="flex cursor-pointer items-center gap-3 rounded border border-[#e3e9e5] px-3 py-3 hover:bg-[#f8faf8]">
                <input ref={index === 0 ? firstOptionRef : undefined} type="radio" name="zero_stock_action" value={option.value} checked={method === option.value} onChange={() => setMethod(option.value)} className="accent-[#235b50]" />
                <span className={`rounded border px-2.5 py-1 text-xs font-semibold ${option.className}`}>{option.label}</span>
              </label>
            ))}
          </fieldset>
          <p className="mt-4 text-xs text-[#53655b]">Review for deletion never deletes a product automatically.</p>
          {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} disabled={saving} className="min-h-11 rounded border border-[#cbd6ce] px-4 text-sm font-semibold text-[#203730] disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={saving || method === getZeroStockAction(product.zero_stock_action).value} className="min-h-11 rounded bg-[#235b50] px-5 text-sm font-semibold text-white hover:bg-[#19473e] disabled:cursor-not-allowed disabled:opacity-50">{saving ? "Saving..." : "Save method"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductMethodModal;
