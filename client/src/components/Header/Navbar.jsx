import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiMenu, FiShoppingBag } from "react-icons/fi";
import zarevLogo from "../../Assets/images/zarev-horizontal-light.svg";
import { useAuth } from "../../Contexts/authContext";
import { useCart } from "../../Contexts/cartContext";
import LanguageSwitch from "./LanguageSwitch";
import MobileMenu from "./MobileMenu";
import NavLinks from "./NavLinks";
import AccountMenu from "./AccountMenu";
import CatalogSearch from "./CatalogSearch";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const adminEmails = (process.env.REACT_APP_ADMIN_EMAILS || "admin@gmail.com")
    .split(",")
    .map((email) => email.trim().toLowerCase());
  const isAdmin = adminEmails.includes(user?.email?.toLowerCase());
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 -mx-4 border-b border-[#e7eae8] bg-white px-4 sm:-mx-[5vw] sm:px-[5vw] md:-mx-[7vw] md:px-[7vw] lg:-mx-[9vw] lg:px-[9vw]">
      <div className="flex h-[84px] items-center justify-between gap-4 2xl:h-[100px] 2xl:gap-5">
        <Link to="/" aria-label="Zarev Gold & Coins home" className="shrink-0 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#235b50]">
          <img src={zarevLogo} alt="Zarev Gold & Coins" className="h-12 w-auto object-contain sm:h-14 2xl:h-16" />
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 2xl:flex">
          <NavLinks t={t} isAdmin={isAdmin} />
        </nav>

        <div className="flex shrink-0 items-center gap-2 2xl:gap-3">
          <div className="hidden 2xl:block"><CatalogSearch t={t} /></div>
          <div className="hidden 2xl:block">
            <LanguageSwitch language={i18n.language} onChange={i18n.changeLanguage.bind(i18n)} />
          </div>
          <Link to="/cart" aria-label={`Cart, ${itemCount} items`} title="Cart" className="relative grid h-12 w-12 place-items-center rounded-md text-[#273b35] transition-colors hover:bg-[#f1f3f2] 2xl:h-14 2xl:w-14">
            <FiShoppingBag size={26} strokeWidth={1.8} />
            {itemCount > 0 && <span className="absolute right-0 top-0 grid h-5 min-w-5 place-items-center rounded-full bg-[#c3683e] px-1 text-[11px] font-semibold text-white">{itemCount}</span>}
          </Link>
          <div className="hidden 2xl:block"><AccountMenu user={user} isAdmin={isAdmin} onLogout={handleLogout} t={t} /></div>
          <button type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen} className="grid h-12 w-12 place-items-center rounded-md text-[#273b35] hover:bg-[#f1f3f2] 2xl:hidden">
            <FiMenu size={27} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      <MobileMenu
        open={menuOpen}
        onClose={closeMenu}
        user={user}
        isAdmin={isAdmin}
        itemCount={itemCount}
        language={i18n.language}
        onLanguageChange={i18n.changeLanguage.bind(i18n)}
        onLogout={handleLogout}
        t={t}
      />
    </header>
  );
};

export default Navbar;
