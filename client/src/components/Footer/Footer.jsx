import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../../Assets/ObjFile.js";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();

  return (
    <div>
      <hr />
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-20 text-sm">
        <div>
          <div className="flex items-center h-16">
            <img
              src={assets.logo2}
              className="h-12 w-auto object-contain"
              alt="Logo here"
            />
          </div>
          <p className="w-full md:w-2/3 text-gray-600">
            {t("footer.description")}
          </p>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">{t("footer.nav_title")}</p>
          <ul className="flex flex-col cursor-pointer gap-1 text-gray-600">
            <Link to="/">{t("footer.nav_links.home")}</Link>
            <Link to="/about">{t("footer.nav_links.about")}</Link>
            <Link to="/all-products">{t("footer.nav_links.products")}</Link>
            <Link to="/contact">{t("footer.nav_links.contact")}</Link>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">
            {t("footer.contact_title")}
          </p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>{t("footer.phone1")}</li>
            <li>{t("footer.phone2")}</li>
            <li>{t("footer.email")}</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 py-5 text-center">
        <hr />
        <br />
        <p className="text-xs sm:text-sm text-gray-500">
          © 2025 Numisora - {t("footer.copyright")}
        </p>
      </div>
    </div>
  );
}

export default Footer;
