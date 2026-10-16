import { NavLink, useLocation } from "react-router-dom";
import { MobileShopMenu, navItemClass } from "./ShopMenu";

const links = [
  ["/", "nav.home"],
  ["/all-products", "nav.products"],
  ["/delivery", "nav.delivery"],
  ["/about", "nav.about"],
];

const NavLinks = ({ t, isAdmin, mobile = false, onNavigate }) => {
  const { search } = useLocation();
  // "Products" is only highlighted for the whole shop, not a Gold/Silver view.
  const filtered = /product_type|composition_metal/.test(search);
  const items = isAdmin ? [...links, ["/admin", "nav.admin"]] : links;
  const renderLink = ([path, label]) => (
    <NavLink key={path} to={path} end={path === "/"} onClick={onNavigate} className={({ isActive }) => navItemClass(isActive && !(path === "/all-products" && filtered), mobile)}>
      {t(label)}
    </NavLink>
  );

  if (!mobile) return items.map(renderLink);
  return (
    <>
      {items.slice(0, 2).map(renderLink)}
      <MobileShopMenu t={t} onNavigate={onNavigate} />
      {items.slice(2).map(renderLink)}
    </>
  );
};

export default NavLinks;
