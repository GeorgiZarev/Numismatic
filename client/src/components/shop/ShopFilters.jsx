import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiChevronDown, FiSliders } from "react-icons/fi";
import { consumableCategories } from "../../utils/consumableCategories";

const materials = ["Silver", "Gold", "Copper", "Bronze"];

const FilterSection = ({ title, children }) => (
  <details className="group border-b border-[#e4e8e6] py-1">
    <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 py-2 text-[15px] font-medium text-[#20312e] marker:hidden [&::-webkit-details-marker]:hidden">
      {title}
      <FiChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
    </summary>
    <div className="pb-4 pt-1">{children}</div>
  </details>
);

const SelectFilter = ({ label, value, options, onChange, allLabel }) => (
  <>
    <label className="sr-only" htmlFor={`shop-${label}`}>{label}</label>
    <select
      id={`shop-${label}`}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="min-h-11 w-full rounded-sm border border-[#cdd5d1] bg-white px-3 text-sm text-[#20312e] focus:border-[#295d52] focus:outline-none"
    >
      <option value="">{allLabel}</option>
      {options.map(({ value: optionValue, label: optionLabel }) => (
        <option key={optionValue} value={optionValue}>{optionLabel}</option>
      ))}
    </select>
  </>
);

const ShopFilters = ({ filters, countries = [], grades = [], onChange, onReset }) => {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const showCoinFilters = filters.product_type === "all" || filters.product_type === "coin";
  const showMaterial = filters.product_type !== "consumable";
  const showAccessories = filters.product_type === "all" || filters.product_type === "consumable";
  const countryOptions = [...new Set([filters.country, ...countries].filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const gradeOptions = [...new Set([filters.coin_grading, ...grades].filter(Boolean))].sort((a, b) => a.localeCompare(b));

  return (
    <div className="lg:w-[250px] lg:shrink-0 xl:w-[270px]">
      <button type="button" aria-expanded={mobileOpen} onClick={() => setMobileOpen((open) => !open)} className="mb-4 flex min-h-12 w-full items-center justify-between border border-[#cdd5d1] px-4 text-[#20312e] lg:hidden">
        <span className="flex items-center gap-2"><FiSliders aria-hidden="true" />{t("shop.filters")}</span>
        <FiChevronDown className={mobileOpen ? "rotate-180" : ""} aria-hidden="true" />
      </button>

      <aside aria-label={t("shop.filters")} className={`${mobileOpen ? "block" : "hidden"} border-t border-[#dce2df] pb-5 lg:block lg:border-0 lg:pb-0`}>
        <div className="hidden items-center justify-between border-b border-[#dce2df] pb-3 lg:flex">
          <h2 className="text-lg font-semibold text-[#142c28]">{t("shop.filters")}</h2>
          <FiSliders className="h-4 w-4 text-[#5d7069]" aria-hidden="true" />
        </div>

        <FilterSection title={t("shop.productType")}>
          <div className="space-y-1">
            {[["all", "shop.allTypes"], ["coin", "nav.coins"], ["investment", "nav.investment"], ["consumable", "nav.accessories"]].map(([value, label]) => (
              <label key={value} className="flex min-h-10 cursor-pointer items-center gap-3 text-sm text-[#33443e]">
                <input type="radio" name="shop-product-type" checked={filters.product_type === value} onChange={() => onChange("product_type", value)} className="h-4 w-4 accent-[#235b50]" />
                {t(label)}
              </label>
            ))}
          </div>
        </FilterSection>

        {showCoinFilters && <FilterSection title={t("filters.country")}>
          <SelectFilter label="country" value={filters.country} options={countryOptions.map((country) => ({ value: country, label: country }))} onChange={(value) => onChange("country", value)} allLabel={t("shop.allCountries")} />
        </FilterSection>}

        {showCoinFilters && <FilterSection title={t("shop.year")}>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs text-[#64736e]">{t("filters.min")}<input type="number" min="1700" inputMode="numeric" value={filters.minYear} onChange={(event) => onChange("minYear", event.target.value)} className="mt-1 min-h-11 w-full rounded-sm border border-[#cdd5d1] px-3 text-sm text-[#20312e] focus:border-[#295d52] focus:outline-none" /></label>
            <label className="text-xs text-[#64736e]">{t("filters.max")}<input type="number" min="1700" inputMode="numeric" value={filters.maxYear} onChange={(event) => onChange("maxYear", event.target.value)} className="mt-1 min-h-11 w-full rounded-sm border border-[#cdd5d1] px-3 text-sm text-[#20312e] focus:border-[#295d52] focus:outline-none" /></label>
          </div>
        </FilterSection>}

        {showMaterial && <FilterSection title={t("filters.material")}>
          <SelectFilter label="material" value={filters.composition_metal} options={materials.map((material) => ({ value: material, label: material }))} onChange={(value) => onChange("composition_metal", value)} allLabel={t("shop.allMaterials")} />
        </FilterSection>}

        <FilterSection title={t("filters.price_range")}>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs text-[#64736e]">{t("shop.minEuro")}<input type="number" min="0" inputMode="decimal" value={filters.minPrice} onChange={(event) => onChange("minPrice", event.target.value)} className="mt-1 min-h-11 w-full rounded-sm border border-[#cdd5d1] px-3 text-sm text-[#20312e] focus:border-[#295d52] focus:outline-none" /></label>
            <label className="text-xs text-[#64736e]">{t("shop.maxEuro")}<input type="number" min="0" inputMode="decimal" value={filters.maxPrice} onChange={(event) => onChange("maxPrice", event.target.value)} className="mt-1 min-h-11 w-full rounded-sm border border-[#cdd5d1] px-3 text-sm text-[#20312e] focus:border-[#295d52] focus:outline-none" /></label>
          </div>
        </FilterSection>

        {showCoinFilters && <FilterSection title={t("filters.grading")}>
          <SelectFilter label="grade" value={filters.coin_grading} options={gradeOptions.map((grade) => ({ value: grade, label: grade }))} onChange={(value) => onChange("coin_grading", value)} allLabel={t("shop.allGrades")} />
        </FilterSection>}

        {showCoinFilters && <FilterSection title={t("shop.denomination")}>
          <label className="sr-only" htmlFor="shop-denomination">{t("shop.denomination")}</label>
          <input id="shop-denomination" type="search" value={filters.denomination} onChange={(event) => onChange("denomination", event.target.value)} placeholder={t("shop.denominationPlaceholder")} className="min-h-11 w-full rounded-sm border border-[#cdd5d1] px-3 text-sm text-[#20312e] focus:border-[#295d52] focus:outline-none" />
        </FilterSection>}

        {showAccessories && <FilterSection title={t("shop.accessoryType")}>
          <SelectFilter label="accessory-type" value={filters.consumable_category} options={consumableCategories.map(({ value, label }) => ({ value, label: t(`shop.accessoryCategories.${value}`, { defaultValue: label }) }))} onChange={(value) => onChange("consumable_category", value)} allLabel={t("shop.allAccessories")} />
        </FilterSection>}

        <button type="button" onClick={onReset} className="mt-5 min-h-11 w-full border border-[#86958f] px-4 text-sm font-semibold text-[#20312e] hover:bg-[#f1f5f3]">{t("filters.reset")}</button>
      </aside>
    </div>
  );
};

export default ShopFilters;
