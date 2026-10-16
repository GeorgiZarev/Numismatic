import { NavLink } from "react-router-dom";
import { MobileShopMenu, navItemClass } from "./ShopMenu";

const links = [
  ["/", "nav.home"],
  ["/delivery", "nav.delivery"],
  ["/about", "nav.about"],
  ["/contact", "nav.contact"],
];

const NavLinks = ({ t, isAdmin, mobile = false, onNavigate }) => {
  const items = isAdmin ? [...links, ["/admin", "nav.admin"]] : links;
  const renderLink = ([path, label]) => (
    <NavLink key={path} to={path} end={path === "/"} onClick={onNavigate} className={({ isActive }) => navItemClass(isActive, mobile)}>
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
