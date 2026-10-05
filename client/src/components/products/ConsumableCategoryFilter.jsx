import { consumableCategories } from "../../utils/consumableCategories";

const ConsumableCategoryFilter = ({ value, onChange }) => (
  <div className="mb-6 flex flex-wrap gap-2" aria-label="Consumable categories">
    {[{ value: "", label: "All consumables" }, ...consumableCategories].map((category) => (
      <button
        key={category.value}
        type="button"
        onClick={() => onChange(category.value)}
        aria-pressed={value === category.value}
        className={`min-h-11 rounded-md border px-4 py-2 text-sm font-medium transition-colors ${value === category.value ? "border-[#235b50] bg-[#edf3f0] text-[#235b50]" : "border-gray-200 bg-white text-gray-700 hover:border-[#9fbbad]"}`}
      >
        {category.label}
      </button>
    ))}
  </div>
);

export default ConsumableCategoryFilter;
