import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiArrowRight, FiChevronRight } from "react-icons/fi";
import coinsImage from "../../Assets/images/category-coins.jpg";
import investmentImage from "../../Assets/images/category-investment.jpg";
import accessoriesImage from "../../Assets/images/category-accessories.jpg";

const METALS = [
  { value: "Gold", label: "home.gold" },
  { value: "Silver", label: "home.silver" },
];

const categories = [
  { type: "coin", label: "home.numismaticCoins", image: coinsImage, metals: true },
  { type: "investment", label: "home.investmentCoins", image: investmentImage, metals: true },
  { type: "consumable", label: "nav.accessories", image: accessoriesImage },
];

const tileClass = "group relative isolate block h-[230px] overflow-hidden bg-gray-900 text-white sm:h-[300px] lg:h-[650px]";
const focusClass = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

const TileImage = ({ type, image, index }) => (
  <>
    <img
      src={image}
      alt=""
      className={`absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] ${type === "investment" ? "object-[center_20%] lg:object-top" : type === "consumable" ? "object-top" : "object-center"}`}
      loading={index === 0 ? "eager" : "lazy"}
      decoding="async"
    />
    <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" aria-hidden="true" />
  </>
);

const HomeCategoryPanels = () => {
  const { t } = useTranslation();

  return (
    <nav
      aria-label={t("nav.products")}
      className="-mx-4 grid grid-cols-1 gap-px bg-white sm:-mx-[5vw] md:-mx-[7vw] lg:-mx-[9vw] lg:grid-cols-3"
    >
      {categories.map(({ type, label, image, metals }, index) => metals ? (
        <div key={type} className={tileClass}>
          <TileImage type={type} image={image} index={index} />
          <div className="absolute inset-x-5 bottom-5 sm:inset-x-8 sm:bottom-8">
            <Link
              to={`/all-products?product_type=${type}`}
              className={`text-sm font-medium uppercase tracking-[0.14em] text-white/85 hover:text-white hover:underline sm:text-base ${focusClass}`}
            >
              {t(label)}
            </Link>
            <ul className="mt-2 flex gap-8 sm:mt-3 lg:mt-4 lg:flex-col lg:gap-3">
              {METALS.map((metal) => (
                <li key={metal.value}>
                  <Link
                    to={`/all-products?product_type=${type}&composition_metal=${metal.value}`}
                    className={`group/metal inline-flex items-center gap-2 font-serif text-[27px] font-semibold leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)] sm:text-3xl lg:text-[clamp(30px,3vw,48px)] ${focusClass}`}
                  >
                    <span className="border-b-2 border-transparent transition-colors group-hover/metal:border-white">
                      {t(metal.label)}
                    </span>
                    <FiChevronRight className="h-6 w-6 shrink-0 transition-transform group-hover/metal:translate-x-1 lg:h-8 lg:w-8" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <Link
          key={type}
          to={`/all-products?product_type=${type}`}
          className={`${tileClass} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white`}
          aria-label={t(label)}
        >
          <TileImage type={type} image={image} index={index} />
          <span className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 sm:inset-x-8 sm:bottom-8">
            <span className="max-w-[85%] font-serif text-[27px] font-semibold leading-tight sm:text-3xl lg:text-[clamp(24px,2.3vw,38px)]">
              {t(label)}
            </span>
            <FiArrowRight className="mb-1 h-6 w-6 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </Link>
      ))}
    </nav>
  );
};

export default HomeCategoryPanels;
