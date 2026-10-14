import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

const CatalogSearch = ({ t, onSearch, compact = false, autoFocus = false }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    navigate(`/all-products?search=${encodeURIComponent(value)}`);
    onSearch?.();
  };

  return (
    <form role="search" onSubmit={handleSubmit} className={`flex min-w-0 items-center rounded-md border border-[#dce4df] bg-[#f8faf8] focus-within:border-[#4b8a70] ${compact ? "w-full" : "w-56"}`}>
      <label htmlFor={compact ? "catalog-search-mobile" : "catalog-search-desktop"} className="sr-only">{t("nav.search")}</label>
      <input
        id={compact ? "catalog-search-mobile" : "catalog-search-desktop"}
        type="search"
        autoFocus={autoFocus}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t("nav.search")}
        className="h-12 min-w-0 flex-1 bg-transparent px-3 text-base text-[#203730] outline-none placeholder:text-[#75837b]"
      />
      <button type="submit" title={t("nav.search")} aria-label={t("nav.search")} className="grid h-12 w-12 shrink-0 place-items-center text-[#235b50] hover:bg-[#edf3f0]">
        <FiSearch size={23} aria-hidden="true" />
      </button>
    </form>
  );
};

export default CatalogSearch;
