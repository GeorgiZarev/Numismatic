import React from "react";
import { Link } from "react-router-dom";
import zarevLogo from "../../Assets/images/zarev-horizontal-light.svg";
import { useTranslation } from "react-i18next";
import { contactEmail, contactPhones } from "../../utils/contactDetails";

function Footer() {
  const { t } = useTranslation();

  return (
    <div>
      <hr />
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-20 text-sm">
        <div>
          <div className="flex items-center h-16">
            <img
              src={zarevLogo}
              className="h-12 w-auto object-contain"
              alt="Zarev Gold & Coins"
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
            {contactPhones.map((phone) => (
              <li key={phone.href}>
                <a className="inline-flex min-h-11 items-center hover:text-gray-900" href={phone.href}>{phone.label}</a>
              </li>
            ))}
            <li>
              <a className="inline-flex min-h-11 items-center hover:text-gray-900" href={contactEmail.href}>{contactEmail.label}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 py-5 text-center">
        <hr />
        <br />
        <p className="text-xs sm:text-sm text-gray-500">
          © 2026 Zarev Gold & Coins
        </p>
      </div>
    </div>
  );
}

export default Footer;
