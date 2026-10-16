import { FiCheck } from "react-icons/fi";
import CoinDetailFields from "./CoinDetailFields";
import ProductPhotoField from "./ProductPhotoField";
import ProductInventoryFields from "./ProductInventoryFields";
import AccessoryDetailFields from "./AccessoryDetailFields";
import AccessorySizesField from "./AccessorySizesField";
import { consumableCategories } from "../../utils/consumableCategories";

const statuses = [
  ["active", "Active"],
  ["draft", "Draft"],
  ["sold", "Sold"],
  ["hidden", "Hidden"],
];

const productTypes = [
  ["coin", "Numismatic Coin"],
  ["investment", "Investment Coin"],
  ["consumable", "Accessory"],
];

// Gold and Silver products appear in the header menus.
const metals = ["Gold", "Silver", "Copper", "Bronze"];

const inputClass = "mt-2 h-11 w-full rounded-md border border-[#dce4df] bg-white px-3.5 text-sm text-[#203730] outline-none transition-colors placeholder:text-[#96a19b] focus:border-[#4b8a70] focus:ring-2 focus:ring-[#d9e9de]";

const CoinAdminForm = ({ formData, loading, error, mode = "create", onChange, onFileChange, onSizesChange, onSubmit }) => {
  const isCoin = formData.product_type === "coin";
  const isConsumable = formData.product_type === "consumable";

  return (
    <form onSubmit={onSubmit} aria-busy={loading} className={`overflow-hidden bg-white font-sans ${mode === "edit" ? "" : "rounded-md border border-[#dfe6e1] shadow-sm"}`}>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0 space-y-8 p-5 sm:p-8">
          <section>
            <h3 className="mb-5 text-base font-semibold text-[#203730]">Product information</h3>
            <fieldset className="min-w-0">
              <legend className="mb-2 text-sm font-medium text-[#354840]">Product type</legend>
              <div className="grid w-full grid-cols-3 rounded-md bg-[#f1f4f1] p-1 sm:inline-flex sm:w-auto">
                {productTypes.map(([value, label]) => (
                  <label key={value} className="min-w-0 cursor-pointer sm:flex-none">
                    <input className="peer sr-only" type="radio" name="product_type" value={value} checked={(formData.product_type || "coin") === value} onChange={onChange} />
                    <span className="block rounded px-2 py-2.5 text-center text-xs font-semibold text-[#66746a] transition-colors peer-checked:bg-white peer-checked:text-[#235b50] peer-checked:shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-[#6a9c80] sm:px-5 sm:text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {isConsumable && <label className="block min-w-0 sm:col-span-2">
                <span className="text-sm font-medium text-[#354840]">Consumable category *</span>
                <select name="consumable_category" value={formData.consumable_category || ""} onChange={onChange} required className={inputClass}>
                  <option value="" disabled>Choose a category</option>
                  {consumableCategories.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>}
              <label className="block min-w-0">
                <span className="text-sm font-medium text-[#354840]">Product name (EN) *</span>
                <input type="text" name="name" lang="en" value={formData.name} onChange={onChange} required maxLength={255} className={inputClass} />
              </label>
              <label className="block min-w-0">
                <span className="text-sm font-medium text-[#354840]">Product name (BG)</span>
                <input type="text" name="name_bg" lang="bg" value={formData.name_bg || ""} onChange={onChange} maxLength={255} placeholder="Shows the English name if empty" className={inputClass} />
              </label>
              <label className="block min-w-0 sm:col-span-2">
                <span className="text-sm font-medium text-[#354840]">Description</span>
                <textarea name="description" value={formData.description || ""} onChange={onChange} rows="4" className="mt-2 min-h-28 w-full resize-y rounded-md border border-[#dce4df] bg-white px-3.5 py-3 text-sm text-[#203730] outline-none focus:border-[#4b8a70] focus:ring-2 focus:ring-[#d9e9de]" />
              </label>
              <label className="block min-w-0">
                <span className="text-sm font-medium text-[#354840]">{isConsumable ? "Price per box *" : "Price *"}</span>
                <span className="relative block">
                  <span aria-hidden="true" className="absolute left-3.5 top-[calc(50%+4px)] -translate-y-1/2 text-sm font-semibold text-[#64746a]">€</span>
                  <input type="number" name="price" min="0" step="0.01" value={formData.price} onChange={onChange} required className={`${inputClass} pl-8`} />
                </span>
              </label>
              {!isConsumable && <label className="block min-w-0">
                <span className="text-sm font-medium text-[#354840]">Metal *</span>
                <select name="composition_metal" value={formData.composition_metal || ""} onChange={onChange} required className={inputClass}>
                  <option value="" disabled>Choose a metal</option>
                  {metals.map((metal) => <option key={metal} value={metal}>{metal}</option>)}
                </select>
              </label>}
            </div>
          </section>

          {isCoin && <CoinDetailFields formData={formData} onChange={onChange} inputClass={inputClass} />}
          {isConsumable && <AccessoryDetailFields formData={formData} onChange={onChange} />}
          {isConsumable && ["capsules", "cardboard_holders"].includes(formData.consumable_category) && (
            <AccessorySizesField sizes={formData.size_stock} recordedQuantity={formData.stock_quantity} onChange={onSizesChange} />
          )}
        </div>

        <aside className="space-y-7 border-t border-[#e7ece8] bg-[#fbfcfa] p-5 sm:p-8 lg:border-l lg:border-t-0">
          <ProductPhotoField photo={formData.photo} photoUrl={formData.photo_url} onChange={onFileChange} />
          <ProductPhotoField title="Second photo" name="photo_2" photo={formData.photo_2} photoUrl={formData.photo_url_2} onChange={onFileChange} />
          <ProductInventoryFields formData={formData} onChange={onChange} />
          <label className="block border-t border-[#e7ece8] pt-6">
            <span className="text-sm font-semibold text-[#203730]">Status</span>
            <select name="status" value={formData.status} onChange={onChange} className={inputClass}>
              {statuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
        </aside>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e7ece8] bg-white px-5 py-5 sm:px-8">
        {error ? <p role="alert" className="text-sm text-red-700">{error}</p> : <span />}
        <button type="submit" disabled={loading} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-[#235b50] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#19473e] disabled:cursor-wait disabled:opacity-60 sm:w-auto">
          <FiCheck size={18} aria-hidden="true" />
          {loading ? "Saving..." : mode === "edit" ? "Save changes" : "Create product"}
        </button>
      </div>
    </form>
  );
};

export default CoinAdminForm;
