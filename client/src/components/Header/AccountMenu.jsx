import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronDown, FiLogOut, FiUser } from "react-icons/fi";

const AccountMenu = ({ user, isAdmin, onLogout, t }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const closeOutside = (event) => { if (!rootRef.current?.contains(event.target)) setOpen(false); };
    const closeEscape = (event) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeEscape);
    return () => { document.removeEventListener("pointerdown", closeOutside); document.removeEventListener("keydown", closeEscape); };
  }, [open]);

  if (!user) return <Link to="/login" aria-label={t("nav.login")} title={t("nav.login")} className="hidden h-12 items-center gap-2 whitespace-nowrap rounded-md border border-[#d9e0dc] px-3 text-base font-semibold text-[#244139] transition-colors hover:border-[#9db4a9] hover:bg-[#f7f9f7] sm:inline-flex xl:px-4"><FiUser size={21} className="shrink-0" /><span className="hidden xl:inline">{t("nav.login")}</span></Link>;

  return <div ref={rootRef} className="relative hidden sm:block">
    <button type="button" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((value) => !value)} aria-label={user.full_name || user.email || "Profile"} title={user.full_name || user.email || "Profile"} className="flex h-12 items-center gap-1.5 whitespace-nowrap rounded-md border border-[#d9e0dc] px-2.5 text-base font-semibold text-[#244139] hover:border-[#9db4a9] hover:bg-[#f7f9f7] xl:gap-2 xl:px-3">
      <FiUser size={21} className="shrink-0" /> <span className="hidden max-w-24 truncate min-[1800px]:inline">{user.full_name || user.email || "Profile"}</span> <FiChevronDown size={18} className={open ? "rotate-180" : ""} />
    </button>
    {open && <div role="menu" className="absolute right-0 mt-2 w-52 rounded-md border border-[#e2e8e3] bg-white p-2 shadow-lg">
      <Link role="menuitem" to="/profile" onClick={() => setOpen(false)} className="block rounded px-3 py-2.5 text-sm text-[#34413e] hover:bg-[#f1f4f2]">{t("nav.profile")}</Link>
      <Link role="menuitem" to="/orders" onClick={() => setOpen(false)} className="block rounded px-3 py-2.5 text-sm text-[#34413e] hover:bg-[#f1f4f2]">{t("nav.orders")}</Link>
      {isAdmin && <Link role="menuitem" to="/admin" onClick={() => setOpen(false)} className="block rounded px-3 py-2.5 text-sm text-[#34413e] hover:bg-[#f1f4f2]">{t("nav.admin")}</Link>}
      <div className="my-1 border-t border-[#e7eae8]" />
      <button type="button" role="menuitem" onClick={() => { setOpen(false); onLogout(); }} className="flex w-full items-center gap-2 rounded px-3 py-2.5 text-left text-sm text-[#56625c] hover:bg-[#f1f4f2]"><FiLogOut size={16} />{t("nav.logout")}</button>
    </div>}
  </div>;
};

export default AccountMenu;
