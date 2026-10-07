import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";

export const productLinks = [
  { type: "coin", label: "nav.coins" },
  { type: "investment", label: "nav.investment" },
  { type: "consumable", label: "nav.accessories" },
];

const ProductMenu = ({ t }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="product-menu"
        onClick={() => setOpen(true)}
        onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); }}
        className="inline-flex min-h-11 items-center gap-1 rounded-md px-3 text-sm font-medium text-[#34413e] hover:bg-[#f5f6f5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#235b50]"
      >
        {t("nav.products")} <FiChevronDown size={16} aria-hidden="true" />
      </button>
      {open && (
        <div id="product-menu" className="absolute left-0 top-full z-50 min-w-56 rounded-md border border-[#dfe6e1] bg-white p-1.5 shadow-lg">
          {productLinks.map(({ type, label }) => (
            <NavLink
              key={type}
              to={`/all-products?product_type=${type}`}
              onClick={() => setOpen(false)}
              className="block rounded px-3 py-2.5 text-sm text-[#34413e] hover:bg-[#edf3f0] hover:text-[#235b50]"
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
