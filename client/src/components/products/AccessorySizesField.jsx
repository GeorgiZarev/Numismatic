import { FiPlus, FiTrash2 } from "react-icons/fi";

const AccessorySizesField = ({ sizes = [], recordedQuantity, onChange }) => {
  const update = (index, field, value) => onChange(sizes.map((row, rowIndex) => rowIndex === index ? { ...row, [field]: value } : row));

  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-[#203730]">Sizes and box stock</h3>
        <button type="button" onClick={() => onChange([...sizes, { size_mm: "", stock_quantity: "" }])} className="inline-flex min-h-10 items-center gap-2 border border-[#b8c9c0] px-3 text-sm font-semibold text-[#235b50] hover:bg-[#edf3f0]"><FiPlus aria-hidden="true" /> Add size</button>
      </div>
      <div className="min-w-0 border border-[#dce4df] text-sm">
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_40px] gap-2 bg-[#f4f6f4] px-2 py-3 text-[#354840]">
          <span>Size (mm)</span><span>Boxes in stock</span><span className="sr-only">Remove</span>
        </div>
        {sizes.map((row, index) => (
          <div key={index} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_40px] items-center gap-2 border-t border-[#e7ece8] p-2">
            <input aria-label={`Size ${index + 1} in millimeters`} type="number" min="0.01" max="1000" step="0.01" required value={row.size_mm} onChange={(event) => update(index, "size_mm", event.target.value)} className="box-border h-10 min-w-0 w-full border border-[#dce4df] px-2" />
            <input aria-label={`Boxes in stock for size ${index + 1}`} type="number" min="0" step="1" required value={row.stock_quantity} onChange={(event) => update(index, "stock_quantity", event.target.value)} className="box-border h-10 min-w-0 w-full border border-[#dce4df] px-2" />
            <button type="button" aria-label={`Remove size ${index + 1}`} title="Remove size" onClick={() => onChange(sizes.filter((_, rowIndex) => rowIndex !== index))} className="grid h-10 w-10 place-items-center text-red-700 hover:bg-red-50"><FiTrash2 aria-hidden="true" /></button>
          </div>
        ))}
      </div>
      {sizes.length === 0 && <p className="mt-2 text-sm text-[#875b35]">Add at least one size.{Number(recordedQuantity) > 0 && ` The previous total was ${recordedQuantity} boxes; enter their actual sizes and quantities.`}</p>}
    </section>
  );
};

export default AccessorySizesField;
