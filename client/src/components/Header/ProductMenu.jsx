import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";

export const productLinks = [
  { type: "coin", label: "nav.coins" },
  { type: "investment", label: "nav.investment" },
  { type: "consumable", label: "nav.accessories" },
];

const ProductMenu = ({ t }) => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const highlighted = open || pathname === "/all-products";

  return (
    <div className={`relative inline-flex items-center rounded-md transition-colors ${highlighted ? "bg-[#edf3f0] text-[#235b50]" : "text-[#34413e] hover:bg-[#f5f6f5]"}`} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); }}>
      <NavLink
        to="/all-products"
        onClick={() => setOpen(false)}
        className="inline-flex min-h-12 items-center whitespace-nowrap rounded-l-md pl-1.5 pr-1 text-[15px] font-medium xl:pl-3 xl:text-base text-inherit focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#235b50]"
      >
        {t("nav.products")}
      </NavLink>
      <button type="button" aria-label={t("shop.productCategories")} aria-expanded={open} aria-controls="product-menu" onClick={() => setOpen((value) => !value)} className="grid min-h-12 min-w-8 place-items-center rounded-r-md text-inherit focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#235b50]">
        <FiChevronDown size={19} aria-hidden="true" />
      </button>
      {open && (
        <div id="product-menu" className="absolute left-0 top-full z-50 min-w-56 rounded-md border border-[#dfe6e1] bg-white p-1.5 shadow-lg">
          {productLinks.map(({ type, label }) => (
            <NavLink
              key={type}
              to={`/all-products?product_type=${type}`}
              onClick={() => setOpen(false)}
              className="block rounded px-3 py-3 text-base text-[#34413e] hover:bg-[#edf3f0] hover:text-[#235b50]"
            >
              {t(label)}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductMenu;
