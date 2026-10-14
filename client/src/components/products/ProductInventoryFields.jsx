import { ZERO_STOCK_ACTIONS } from "../../utils/zeroStockAction";

const inputClass = "mt-2 h-11 w-full rounded-md border border-[#dce4df] bg-white px-3.5 text-sm text-[#203730] outline-none focus:border-[#4b8a70] focus:ring-2 focus:ring-[#d9e9de]";

const ProductInventoryFields = ({ formData, onChange }) => {
  const sized = formData.product_type === "consumable" && ["capsules", "cardboard_holders"].includes(formData.consumable_category);
  const quantity = sized ? (formData.size_stock || []).reduce((sum, row) => sum + (Number(row.stock_quantity) || 0), 0) : Number(formData.stock_quantity);
  const outOfStock = quantity === 0;

  return (
    <section className="space-y-4 border-t border-[#e7ece8] pt-6">
      <h3 className="text-sm font-semibold text-[#203730]">Inventory</h3>
      {sized ? <p className="text-sm text-[#354840]">Total boxes in stock: <strong>{quantity}</strong></p> : (
        <label className="block">
          <span className="text-sm font-medium text-[#354840]">Quantity *</span>
          <input type="number" name="stock_quantity" min="0" step="1" required value={formData.stock_quantity} onChange={onChange} onFocus={(event) => event.currentTarget.select()} className={inputClass} />
        </label>
      )}
      <label className="block">
        <span className="text-sm font-medium text-[#354840]">When quantity reaches zero</span>
        <select name="zero_stock_action" value={formData.zero_stock_action} onChange={onChange} className={inputClass}>
          {ZERO_STOCK_ACTIONS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      {outOfStock && formData.zero_stock_action === "show" && (
        <label className="block">
          <span className="text-sm font-medium text-[#354840]">Expected delivery (optional)</span>
          <input type="date" name="expected_delivery_date" value={formData.expected_delivery_date || ""} onChange={onChange} className={inputClass} />
        </label>
      )}
    </section>
  );
};

export default ProductInventoryFields;
