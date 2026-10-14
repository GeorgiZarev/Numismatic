import { consumableCategories } from "../../utils/consumableCategories";

const productTypes = [
  ["all", "All products"],
  ["coin", "Coins"],
  ["investment", "Investment products"],
  ["consumable", "Accessories"],
];

const AdminProductFilters = ({ productType, category, onProductType, onCategory }) => (
  <div className="mb-5 flex flex-wrap items-center gap-3" aria-label="Filter products">
    <div className="inline-flex max-w-full flex-wrap rounded-md border border-[#dce4df] bg-[#f5f7f5] p-1">
      {productTypes.map(([value, label]) => (
        <button
          key={value}
          type="button"
          aria-pressed={productType === value}
          onClick={() => onProductType(value)}
          className={`min-h-9 rounded px-3 text-sm font-medium transition-colors ${productType === value ? "bg-white text-[#235b50] shadow-sm" : "text-[#52645b] hover:text-[#203730]"}`}
        >
          {label}
        </button>
      ))}
    </div>
    {productType === "consumable" && (
      <label className="flex items-center gap-2 text-sm text-[#354840]">
        <span>Type</span>
        <select value={category} onChange={(event) => onCategory(event.target.value)} className="min-h-10 rounded border border-[#dce4df] bg-white px-3 text-sm text-[#203730]">
          <option value="">All accessories</option>
          {consumableCategories.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
    )}
  </div>
);

export default AdminProductFilters;
