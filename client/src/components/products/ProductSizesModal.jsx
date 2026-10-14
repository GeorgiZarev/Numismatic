import { useState } from "react";
import { FiX } from "react-icons/fi";
import AccessorySizesField from "./AccessorySizesField";

const ProductSizesModal = ({ product, saving, error, onClose, onSave }) => {
  const [sizes, setSizes] = useState(Array.isArray(product.size_stock) ? product.size_stock : []);
  const total = sizes.reduce((sum, row) => sum + (Number(row.stock_quantity) || 0), 0);

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center overflow-y-auto bg-[#142521]/50 p-4" role="presentation" onKeyDown={(event) => { if (event.key === "Escape" && !saving) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="product-sizes-title" className="w-full max-w-lg rounded-md bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#e7ece8] px-5 py-4">
          <h2 id="product-sizes-title" className="text-lg font-semibold text-[#203730]">Sizes and quantities</h2>
          <button type="button" onClick={onClose} disabled={saving} aria-label="Close sizes dialog" className="grid h-9 w-9 place-items-center rounded text-[#53655b] hover:bg-[#f1f4f1] disabled:opacity-50"><FiX size={20} /></button>
        </div>
        <form onSubmit={(event) => { event.preventDefault(); onSave(sizes); }} className="p-5">
          <p className="mb-4 truncate text-sm text-[#53655b]">{product.name}</p>
          <AccessorySizesField sizes={sizes} recordedQuantity={product.stock_quantity} onChange={setSizes} />
          <p className="mt-4 text-sm text-[#354840]">Total boxes in stock: <strong>{total}</strong></p>
          {Number(product.reserved_quantity) > 0 && (
            <p className="mt-2 text-sm text-[#a36b00]">
              Reserved in pending orders (still counted above until you approve them):{" "}
              {(product.reserved_sizes || []).map((row) => `${row.size_mm} mm × ${row.quantity}`).join(", ")}
            </p>
          )}
          {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} disabled={saving} className="min-h-11 rounded border border-[#cbd6ce] px-4 text-sm font-semibold text-[#203730] disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={saving || sizes.length === 0} className="min-h-11 rounded bg-[#235b50] px-5 text-sm font-semibold text-white hover:bg-[#19473e] disabled:cursor-not-allowed disabled:opacity-50">{saving ? "Saving..." : "Save stock"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductSizesModal;
