import { Fragment } from "react";
import { NavLink } from "react-router-dom";
import ProductMenu, { productLinks } from "./ProductMenu";

const links = [
  ["/", "nav.home"],
  ["/delivery", "nav.delivery"],
  ["/about", "nav.about"],
  ["/contact", "nav.contact"],
];

const NavLinks = ({ t, isAdmin, mobile = false, onNavigate }) => {
  const items = isAdmin ? [...links, ["/admin", "nav.admin"]] : links;
  const productItems = mobile
    ? productLinks.map(({ type, label }) => ["/all-products?product_type=" + type, label])
    : [];
  const orderedItems = [items[0], items[1], ...productItems, ...items.slice(2)];

  return orderedItems.map(([path, label], index) => (
    <Fragment key={path}>
      {!mobile && index === 2 && <ProductMenu t={t} />}
      <NavLink
        to={path}
        end={path === "/"}
        onClick={onNavigate}
        className={({ isActive }) => mobile
          ? `block rounded-md px-4 py-3 text-base font-medium transition-colors ${isActive ? "bg-[#edf3f0] text-[#235b50]" : "text-[#34413e] hover:bg-[#f5f6f5]"}`
          : `rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? "bg-[#edf3f0] text-[#235b50]" : "text-[#46514e] hover:bg-[#f5f6f5] hover:text-[#172c28]"}`
        }
      >
        {t(label)}
      </NavLink>
    </Fragment>
  ));
};

export default NavLinks;
