import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import { navItemClass } from "./ShopMenu";

// The pages under "Information". Adding one is a one-line change.
export const INFO_PAGES = [
  ["/delivery", "nav.delivery"],
  ["/about", "nav.about"],
  ["/contact", "nav.contact"],
];

const useInfoSelected = () => {
  const { pathname } = useLocation();
  return INFO_PAGES.some(([path]) => path === pathname);
};

const pageLinkClass = ({ isActive }) => `block rounded px-3 py-2.5 text-[15px] transition-colors ${isActive ? "bg-[#edf3f0] text-[#235b50]" : "text-[#34413e] hover:bg-[#edf3f0] hover:text-[#235b50]"}`;

// Desktop: opens on hover or focus, like the shop menus, and also on click.
const InfoMenu = ({ t }) => {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef(null);
  const { pathname } = useLocation();
  const selected = useInfoSelected();

  const show = () => { clearTimeout(closeTimer.current); setOpen(true); };
  const hideSoon = () => { clearTimeout(closeTimer.current); closeTimer.current = setTimeout(() => setOpen(false), 150); };

  useEffect(() => () => clearTimeout(closeTimer.current), []);
  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <div
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hideSoon}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) hideSoon(); }}
      onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); }}
    >
      <button type="button" aria-haspopup="true" aria-expanded={open} aria-controls="info-menu" onClick={() => setOpen((value) => !value)} className={`inline-flex items-center gap-1 ${navItemClass(selected || open)}`}>
        {t("nav.information")}
        <FiChevronDown size={17} aria-hidden="true" className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div id="info-menu" className="absolute left-0 top-full z-50 w-52 rounded-md border border-[#dfe6e1] bg-white p-1.5 shadow-lg">
          {INFO_PAGES.map(([path, label]) => (
            <NavLink key={path} to={path} className={pageLinkClass}>{t(label)}</NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

// Phones: a tap opens the same list inside the side menu.
export const MobileInfoMenu = ({ t, onNavigate }) => {
  const selected = useInfoSelected();
  const [open, setOpen] = useState(selected);

  return (
    <div>
      <button type="button" aria-expanded={open} aria-controls="mobile-info-menu" onClick={() => setOpen((value) => !value)} className={`flex w-full items-center justify-between text-left ${navItemClass(selected, true)}`}>
        {t("nav.information")}
        <FiChevronDown size={20} aria-hidden="true" className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div id="mobile-info-menu" className="mb-2 ml-4 border-l border-[#e7eae8] pl-2">
          {INFO_PAGES.map(([path, label]) => (
            <NavLink key={path} to={path} onClick={onNavigate} className={({ isActive }) => `block rounded-md px-3 py-2.5 text-base font-medium ${isActive ? "bg-[#edf3f0] text-[#235b50]" : "text-[#34413e] hover:bg-[#f5f6f5]"}`}>{t(label)}</NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default InfoMenu;
