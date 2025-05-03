import React from "react";
import { IoSearch } from "react-icons/io5";
import { assets } from "../../Assets/ObjFile";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const [showMenu, setShowMenu] = React.useState(false);
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="sticky top-0 z-50 bg-white flex items-center justify-between py-5 font-medium shadow-sm">
      <div className="flex items-center h-16">
        <img
          src={assets.logo2}
          className="h-12 w-auto object-contain"
          alt="Logo here"
        />
      </div>

      {/* Desktop Nav */}
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>{t("nav.home")}</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink
          to="/all-products"
          className="flex flex-col items-center gap-1"
        >
          <p>{t("nav.products")}</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>{t("nav.about")}</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>{t("nav.contact")}</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>

      {/* Right Side Icons */}
      <div className="flex items-center gap-3">
        <IoSearch className="w-5 h-6 cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110" />

        {/* Language Switcher */}
        <div className="flex gap-1">
          <button
            onClick={() => changeLanguage("en")}
            className={`text-xs px-2 py-1 rounded ${
              i18n.language === "en" ? "bg-gray-200 font-bold" : ""
            }`}
          >
            🇬🇧
          </button>
          <button
            onClick={() => changeLanguage("bg")}
            className={`text-xs px-2 py-1 rounded ${
              i18n.language === "bg" ? "bg-gray-200 font-bold" : ""
            }`}
          >
            🇧🇬
          </button>
        </div>

        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5 min-w-5" alt="cart icon" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            0
          </p>
        </Link>

        <img
          onClick={() => setShowMenu(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt="menu"
        />

        <Link
          to="/login"
          className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1 rounded transition hidden sm:block"
        >
          {t("nav.login")}
        </Link>
      </div>

      {/* Mobile Menu */}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
          showMenu ? "w-full" : "w-0"
        }`}
      >
        <div className={`flex flex-col text-gray-600`}>
          <div
            onClick={() => setShowMenu(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img
              src={assets.dropdown_icon}
              className="h-4 rotate-180"
              alt="dropdown icon"
            />
            <p>Back</p>
          </div>
          <NavLink
            onClick={() => setShowMenu(false)}
            className="py-2 pl-6 border"
            to="/"
          >
            {t("nav.home")}
          </NavLink>
          <NavLink
            onClick={() => setShowMenu(false)}
            className="py-2 pl-6 border"
            to="/all-products"
          >
            {t("nav.products")}
          </NavLink>
          <NavLink
            onClick={() => setShowMenu(false)}
            className="py-2 pl-6 border"
            to="/about"
          >
            {t("nav.about")}
          </NavLink>
          <NavLink
            onClick={() => setShowMenu(false)}
            className="py-2 pl-6 border"
            to="/contact"
          >
            {t("nav.contact")}
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
