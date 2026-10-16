import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { fetchCoins } from "../../api/coins";

// The whole shop menu comes from these two lists: each metal is a menu in the
// top bar, each section is a row inside it. Adding one is a one-line change.
export const METALS = [
  { value: "Gold", label: "nav.goldCoins" },
  { value: "Silver", label: "nav.silverCoins" },
];
const SECTIONS = [
  { type: "coin", label: "home.numismaticCoins" },
  { type: "investment", label: "home.investmentCoins" },
];
const ACCESSORIES_URL = "/all-products?product_type=consumable";

export const shopUrl = (params) => `/all-products?${new URLSearchParams(params)}`;

export const navItemClass = (selected, mobile = false) => mobile
  ? `block rounded-md px-4 py-3 text-base font-medium transition-colors ${selected ? "bg-[#edf3f0] text-[#235b50]" : "text-[#34413e] hover:bg-[#f5f6f5]"}`
  : `whitespace-nowrap rounded-md px-1.5 py-3 text-[15px] font-medium transition-colors xl:px-3 xl:text-base ${selected ? "bg-[#edf3f0] text-[#235b50]" : "text-[#46514e] hover:bg-[#f5f6f5] hover:text-[#172c28]"}`;

// Countries come from the products themselves, so a coin from a new country
// appears in the menu by itself. Shares its cache with the unfiltered shop page.
export const useMenuCountries = () => {
  const { data = [] } = useQuery({
    queryKey: ["shop-products", {}],
    queryFn: () => fetchCoins({}),
    staleTime: 5 * 60 * 1000,
  });
  return useMemo(() => {
    const groups = {};
    data.forEach(({ product_type, composition_metal, country }) => {
      if (!country) return;
      const key = `${product_type}:${composition_metal}`;
      (groups[key] ||= new Set()).add(country);
    });
    return (type, metal) => [...(groups[`${type}:${metal}`] || [])].sort((a, b) => a.localeCompare(b));
  }, [data]);
};

const useShopSelection = () => {
  const { pathname, search } = useLocation();
  if (pathname !== "/all-products") return {};
  const params = new URLSearchParams(search);
  return { type: params.get("product_type"), metal: params.get("composition_metal") };
};

// Desktop shop bar items, styled after the Künker category bar.
const barItemClass = (selected) => `inline-flex h-12 items-center gap-1.5 whitespace-nowrap border-b-2 px-3 text-[14px] font-semibold uppercase tracking-[0.04em] transition-colors ${selected ? "border-[#235b50] text-[#235b50]" : "border-transparent text-[#223b35] hover:text-[#235b50]"}`;

const countryLinkClass = "flex items-center gap-2 rounded px-3 py-1.5 text-[15px] text-[#34413e] hover:bg-[#edf3f0] hover:text-[#235b50] focus-visible:bg-[#edf3f0] focus-visible:outline-none";

const CountryLinks = ({ type, metal, countries, onNavigate, className }) => (
  <div className={className}>
    {countries.map((country) => (
      <Link key={country} to={shopUrl({ product_type: type, composition_metal: metal, country })} onClick={onNavigate} className={countryLinkClass}>
        <span aria-hidden="true" className="text-[#9aa5a0]">—</span>{country}
      </Link>
    ))}
  </div>
);

const MetalMenu = ({ metal, label, t, getCountries, selected }) => {
  const [open, setOpen] = useState(false);
  const [activeType, setActiveType] = useState(null);
  const closeTimer = useRef(null);
  const { pathname, search } = useLocation();
  const id = `shop-menu-${metal.toLowerCase()}`;
  const activeCountries = activeType ? getCountries(activeType, metal) : [];

  const close = () => { setOpen(false); setActiveType(null); };
  const show = () => { clearTimeout(closeTimer.current); setOpen(true); };
  // A short delay lets the pointer cross the gap between the tab and the panel.
  const hideSoon = () => { clearTimeout(closeTimer.current); closeTimer.current = setTimeout(close, 150); };

  useEffect(() => () => clearTimeout(closeTimer.current), []);
  useEffect(() => { setOpen(false); setActiveType(null); }, [pathname, search]);

  return (
    <div
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hideSoon}
      onFocus={show}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) hideSoon(); }}
      onKeyDown={(event) => { if (event.key === "Escape") close(); }}
    >
      <Link to={shopUrl({ composition_metal: metal })} aria-haspopup="true" aria-expanded={open} aria-controls={id} className={barItemClass(selected || open)}>
        {t(label)}
        <FiChevronDown size={17} aria-hidden="true" className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </Link>
      {open && (
        <div id={id} className="absolute left-0 top-full z-50">
          <div className="flex items-start rounded-b-md border border-t-0 border-[#dfe6e1] bg-white shadow-lg">
            <ul className="w-64 p-1.5">
              {SECTIONS.map(({ type, label: sectionLabel }) => {
                const hasCountries = getCountries(type, metal).length > 0;
                const active = activeType === type;
                const pick = () => setActiveType(hasCountries ? type : null);
                return (
                  <li key={type} onMouseEnter={pick} onFocus={pick}>
                    <Link to={shopUrl({ product_type: type, composition_metal: metal })} className={`flex items-center justify-between rounded px-3 py-3 text-base transition-colors ${active ? "bg-[#edf3f0] text-[#235b50]" : "text-[#34413e] hover:bg-[#edf3f0] hover:text-[#235b50]"}`}>
                      {t(sectionLabel)}
                      {hasCountries && <FiChevronRight size={18} aria-hidden="true" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
            {activeCountries.length > 0 && (
              <div className={`max-h-[70vh] overflow-y-auto border-l border-[#e7eae8] p-1.5 ${activeCountries.length > 12 ? "w-96" : "w-56"}`}>
                <CountryLinks type={activeType} metal={metal} countries={activeCountries} className={activeCountries.length > 12 ? "grid grid-cols-2" : ""} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Desktop: a bar under the header whose menus open on hover. Clicking a name
// opens everything in it, so the country lists need no "view all" link.
const ShopMenu = ({ t }) => {
  const getCountries = useMenuCountries();
  const selection = useShopSelection();
  return (
    <nav aria-label={t("nav.products")} className="-mx-[9vw] hidden items-center gap-2 border-t border-[#e7eae8] bg-[#f6f7f6] px-[9vw] lg:flex">
      {METALS.map(({ value, label }) => (
        <MetalMenu key={value} metal={value} label={label} t={t} getCountries={getCountries} selected={selection.metal === value} />
      ))}
      <Link to={ACCESSORIES_URL} className={barItemClass(selection.type === "consumable")}>{t("nav.accessories")}</Link>
    </nav>
  );
};

// Phones have no hover, so the same menus open with a tap.
export const MobileShopMenu = ({ t, onNavigate }) => {
  const [openMetal, setOpenMetal] = useState(null);
  const getCountries = useMenuCountries();
  const selection = useShopSelection();

  return (
    <>
      {METALS.map(({ value: metal, label }) => {
        const open = openMetal === metal;
        const id = `mobile-shop-menu-${metal.toLowerCase()}`;
        return (
          <div key={metal}>
            <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpenMetal(open ? null : metal)} className={`flex w-full items-center justify-between text-left ${navItemClass(selection.metal === metal, true)}`}>
              {t(label)}
              <FiChevronDown size={20} aria-hidden="true" className={`transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
              <div id={id} className="mb-2 ml-4 border-l border-[#e7eae8] pl-2">
                {SECTIONS.map(({ type, label: sectionLabel }) => {
                  const countries = getCountries(type, metal);
                  const url = shopUrl({ product_type: type, composition_metal: metal });
                  return (
                    <div key={type} className="py-1">
                      <Link to={url} onClick={onNavigate} className="block rounded-md px-3 py-2.5 text-base font-medium text-[#235b50] hover:bg-[#f5f6f5]">{t(sectionLabel)}</Link>
                      {countries.length > 0 && <CountryLinks type={type} metal={metal} countries={countries} onNavigate={onNavigate} className="grid grid-cols-2" />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
      <Link to={ACCESSORIES_URL} onClick={onNavigate} className={navItemClass(selection.type === "consumable", true)}>{t("nav.accessories")}</Link>
    </>
  );
};

export default ShopMenu;
