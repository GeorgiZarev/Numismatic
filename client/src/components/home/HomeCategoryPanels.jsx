import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiChevronRight } from "react-icons/fi";
import goldImage from "../../Assets/images/category-investment.jpg";
import silverImage from "../../Assets/images/category-coins.jpg";
import accessoriesImage from "../../Assets/images/category-accessories.jpg";
import { consumableCategories } from "../../utils/consumableCategories";
import { METALS, SECTIONS, shopUrl } from "../../utils/productMenu";

const metalTile = ({ value, tile }, image, imageClass) => ({
  key: value,
  title: tile,
  url: shopUrl({ composition_metal: value }),
  image,
  imageClass,
  links: SECTIONS.map(({ type, label }) => ({ label, url: shopUrl({ product_type: type, composition_metal: value }) })),
});

// Gold and Silver come from the same lists as the header menus.
const tiles = [
  metalTile(METALS[0], goldImage, "object-[center_20%] lg:object-top"),
  metalTile(METALS[1], silverImage, "object-center"),
  {
    key: "accessories",
    title: "nav.accessories",
    url: shopUrl({ product_type: "consumable" }),
    image: accessoriesImage,
    imageClass: "object-top",
    links: consumableCategories.map(({ value, label }) => ({
      label: `shop.accessoryCategories.${value}`,
      defaultLabel: label,
      url: shopUrl({ product_type: "consumable", consumable_category: value }),
    })),
  },
];

const focusClass = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

const HomeCategoryPanels = () => {
  const { t } = useTranslation();

  return (
    <nav
      aria-label={t("nav.products")}
      className="-mx-4 grid grid-cols-1 gap-px bg-white sm:-mx-[5vw] md:-mx-[7vw] lg:-mx-[9vw] lg:grid-cols-3"
    >
      {tiles.map(({ key, title, url, image, imageClass, links }, index) => (
        <div key={key} className="group relative isolate block h-[260px] overflow-hidden bg-gray-900 text-white sm:h-[320px] lg:h-[650px]">
          <img
            src={image}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] ${imageClass}`}
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" aria-hidden="true" />
          <div className="absolute inset-x-5 bottom-5 sm:inset-x-8 sm:bottom-8">
            <Link
              to={url}
              className={`group/title inline-flex items-center gap-2 font-serif text-[30px] font-semibold leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)] sm:text-4xl lg:text-[clamp(32px,3.2vw,52px)] ${focusClass}`}
            >
              <span className="border-b-2 border-transparent transition-colors group-hover/title:border-white">{t(title)}</span>
              <FiChevronRight className="h-7 w-7 shrink-0 transition-transform group-hover/title:translate-x-1 lg:h-9 lg:w-9" aria-hidden="true" />
            </Link>
            <ul className="mt-2 flex flex-col gap-1.5 sm:mt-3 lg:mt-4 lg:gap-2.5">
              {links.map(({ label, defaultLabel, url: linkUrl }) => (
                <li key={linkUrl}>
                  <Link
                    to={linkUrl}
                    className={`group/link inline-flex items-center gap-1.5 text-base font-medium text-white/90 hover:text-white sm:text-lg ${focusClass}`}
                  >
                    <span className="border-b border-transparent transition-colors group-hover/link:border-white">{t(label, { defaultValue: defaultLabel })}</span>
                    <FiChevronRight className="h-4 w-4 shrink-0 transition-transform group-hover/link:translate-x-1" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </nav>
  );
};

export default HomeCategoryPanels;
