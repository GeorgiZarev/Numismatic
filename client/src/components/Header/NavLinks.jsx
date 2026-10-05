import { NavLink } from "react-router-dom";

const links = [
  ["/", "nav.home"],
  ["/all-products", "nav.products"],
  ["/about", "nav.about"],
  ["/contact", "nav.contact"],
];

const NavLinks = ({ t, isAdmin, mobile = false, onNavigate }) => {
  const items = isAdmin ? [...links, ["/admin", "nav.admin"]] : links;

  return items.map(([path, label]) => (
    <NavLink
      key={path}
      to={path}
      end={path === "/"}
      onClick={onNavigate}
      className={({ isActive }) => mobile
        ? `block rounded-md px-4 py-3 text-base font-medium transition-colors ${isActive ? "bg-[#edf3f0] text-[#235b50]" : "text-[#34413e] hover:bg-[#f5f6f5]"}`
        : `rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${isActive ? "bg-[#edf3f0] text-[#235b50]" : "text-[#46514e] hover:bg-[#f5f6f5] hover:text-[#172c28]"}`
      }
    >
      {label.startsWith("nav.") ? t(label) : label}
    </NavLink>
  ));
};

export default NavLinks;
