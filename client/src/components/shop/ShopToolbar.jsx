import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiGrid, FiList, FiSearch } from "react-icons/fi";

const ShopToolbar = ({ search, onSearch, sort, onSort, count, pageSize, onPageSize, view, onView }) => {
  const { t } = useTranslation();
  const [draftSearch, setDraftSearch] = useState(search);

  useEffect(() => setDraftSearch(search), [search]);

  return (
    <div className="mb-7 border-b border-[#dce2df] pb-5">
      <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-center 2xl:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <form onSubmit={(event) => { event.preventDefault(); onSearch(draftSearch.trim()); }} className="flex min-h-12 w-full border border-[#cdd5d1] bg-white sm:w-[280px]">
            <label className="sr-only" htmlFor="shop-search">{t("shop.search")}</label>
            <input id="shop-search" type="search" value={draftSearch} onChange={(event) => { setDraftSearch(event.target.value); if (!event.target.value && search) onSearch(""); }} placeholder={t("shop.search")} className="min-w-0 flex-1 px-3 text-sm text-[#20312e] placeholder:text-[#718078] focus:outline-none" />
            <button type="submit" title={t("shop.searchButton")} aria-label={t("shop.searchButton")} className="grid w-12 shrink-0 place-items-center text-[#20312e] hover:bg-[#eef3f0]"><FiSearch size={20} aria-hidden="true" /></button>
          </form>

          <label className="flex min-h-12 items-center gap-2 text-sm text-[#52645b]">
            <span className="shrink-0">{t("shop.sortBy")}</span>
            <select value={sort} onChange={(event) => onSort(event.target.value)} className="min-h-12 min-w-44 flex-1 border border-[#cdd5d1] bg-white px-3 font-medium text-[#20312e] focus:border-[#295d52] focus:outline-none">
              <option value="">{t("shop.newest")}</option>
              <option value="price-asc">{t("shop.priceLow")}</option>
              <option value="price-desc">{t("shop.priceHigh")}</option>
              <option value="year-desc">{t("shop.yearNew")}</option>
              <option value="year-asc">{t("shop.yearOld")}</option>
            </select>
          </label>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
          <label className="flex items-center gap-2 text-sm text-[#52645b]">
            <span>{t("shop.perPage")}</span>
            <select value={pageSize} onChange={(event) => onPageSize(event.target.value)} className="min-h-11 border border-[#cdd5d1] bg-white px-2 text-[#20312e] focus:border-[#295d52] focus:outline-none">
              {[12, 24, 48, 72].map((size) => <option key={size} value={size}>{size}</option>)}
            </select>
          </label>
          <span className="text-sm text-[#52645b]" aria-live="polite">{t("shop.itemCount", { count })}</span>
          <div className="flex border border-[#cdd5d1]" role="group" aria-label={t("shop.viewMode")}>
            <button type="button" title={t("shop.gridView")} aria-label={t("shop.gridView")} aria-pressed={view === "grid"} onClick={() => onView("grid")} className={`grid h-11 w-11 place-items-center ${view === "grid" ? "bg-[#16342e] text-white" : "text-[#34463e] hover:bg-[#eef3f0]"}`}><FiGrid size={18} aria-hidden="true" /></button>
            <button type="button" title={t("shop.listView")} aria-label={t("shop.listView")} aria-pressed={view === "list"} onClick={() => onView("list")} className={`grid h-11 w-11 place-items-center ${view === "list" ? "bg-[#16342e] text-white" : "text-[#34463e] hover:bg-[#eef3f0]"}`}><FiList size={19} aria-hidden="true" /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopToolbar;
