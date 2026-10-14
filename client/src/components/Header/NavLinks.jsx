import { Fragment } from "react";
import { NavLink, useLocation } from "react-router-dom";
import ProductMenu, { productLinks } from "./ProductMenu";

const links = [
  ["/", "nav.home"],
  ["/delivery", "nav.delivery"],
  ["/about", "nav.about"],
  ["/contact", "nav.contact"],
];

const NavLinks = ({ t, isAdmin, mobile = false, onNavigate }) => {
  const location = useLocation();
  const items = isAdmin ? [...links, ["/admin", "nav.admin"]] : links;
  const productItems = mobile
    ? [["/all-products", "nav.products"], ...productLinks.map(({ type, label }) => ["/all-products?product_type=" + type, label])]
    : [];
  const orderedItems = [items[0], items[1], ...productItems, ...items.slice(2)];

  return orderedItems.map(([path, label], index) => (
    <Fragment key={path}>
      {!mobile && index === 2 && <ProductMenu t={t} />}
      <NavLink
        to={path}
        end={path === "/"}
        onClick={onNavigate}
        className={({ isActive }) => {
          const selectedType = new URL(path, window.location.origin).searchParams.get("product_type");
          const currentType = new URLSearchParams(location.search).get("product_type");
          const selected = path.startsWith("/all-products")
            ? location.pathname === "/all-products" && selectedType === currentType
            : isActive;
          return mobile
            ? `block rounded-md px-4 py-3 text-base font-medium transition-colors ${selected ? "bg-[#edf3f0] text-[#235b50]" : "text-[#34413e] hover:bg-[#f5f6f5]"}`
            : `whitespace-nowrap rounded-md px-1.5 py-3 text-[15px] font-medium transition-colors xl:px-3 xl:text-base ${selected ? "bg-[#edf3f0] text-[#235b50]" : "text-[#46514e] hover:bg-[#f5f6f5] hover:text-[#172c28]"}`;
        }}
      >
        {t(label)}
      </NavLink>
    </Fragment>
  ));
};

export default NavLinks;
