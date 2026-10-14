import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiLogOut, FiX } from "react-icons/fi";
import NavLinks from "./NavLinks";
import LanguageSwitch from "./LanguageSwitch";
import CatalogSearch from "./CatalogSearch";

const MobileMenu = ({ open, onClose, user, isAdmin, itemCount, language, onLanguageChange, onLogout, t }) => {
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => { if (event.key === "Escape") onClose(); };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] lg:hidden" role="presentation">
      <button type="button" aria-label="Close menu" className="absolute inset-0 bg-[#142521]/35" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label={t("nav.menu")} className="absolute inset-y-0 right-0 w-[min(22rem,90vw)] overflow-y-auto bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between border-b border-[#e7eae8] px-5 py-5">
          <span className="font-semibold text-[#223b35]">{t("nav.menu")}</span>
          <button type="button" onClick={onClose} aria-label="Close menu" className="grid h-11 w-11 place-items-center rounded-md text-[#42504a] hover:bg-[#f1f3f2]"><FiX size={22} /></button>
        </div>
        <nav aria-label="Mobile navigation" className="grid gap-1 px-3 py-5">
          <div className="mb-3 px-1"><CatalogSearch t={t} compact onSearch={onClose} /></div>
          <NavLinks t={t} isAdmin={isAdmin} mobile onNavigate={onClose} />
          <Link to="/cart" onClick={onClose} className="flex items-center justify-between rounded-md px-4 py-3 text-base font-medium text-[#34413e] hover:bg-[#f5f6f5]">
            {t("nav.cart")} <span className="text-sm text-[#6a7570]">{itemCount}</span>
          </Link>
          {user && <Link to="/orders" onClick={onClose} className="rounded-md px-4 py-3 text-base font-medium text-[#34413e] hover:bg-[#f5f6f5]">{t("nav.orders")}</Link>}
        </nav>
        <div className="mt-auto border-t border-[#e7eae8] px-5 py-6 space-y-5">
          <LanguageSwitch language={language} onChange={onLanguageChange} />
          {user ? (
            <div className="space-y-2">
              <Link to="/profile" onClick={onClose} className="flex items-center justify-between rounded-md bg-[#edf3f0] px-4 py-3 font-semibold text-[#235b50]">{t("nav.profile")} <FiArrowRight size={18} /></Link>
              <button type="button" onClick={() => { onClose(); onLogout(); }} className="flex w-full items-center gap-3 rounded-md px-4 py-3 text-left text-[#46514e] hover:bg-[#f5f6f5]"><FiLogOut size={18} />{t("nav.logout")}</button>
            </div>
          ) : <Link to="/login" onClick={onClose} className="flex items-center justify-between rounded-md bg-[#235b50] px-4 py-3 font-semibold text-white">{t("nav.login")} <FiArrowRight size={18} /></Link>}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
