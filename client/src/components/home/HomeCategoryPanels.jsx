import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiArrowRight } from "react-icons/fi";
import coinsImage from "../../Assets/images/category-coins.jpg";
import investmentImage from "../../Assets/images/category-investment.jpg";
import accessoriesImage from "../../Assets/images/category-accessories.jpg";

const categories = [
  { type: "coin", label: "nav.coins", image: coinsImage },
  { type: "investment", label: "nav.investment", image: investmentImage },
  { type: "consumable", label: "nav.accessories", image: accessoriesImage },
];

const HomeCategoryPanels = () => {
  const { t } = useTranslation();

  return (
    <nav
      aria-label={t("nav.products")}
      className="-mx-4 grid grid-cols-1 gap-px bg-white sm:-mx-[5vw] md:-mx-[7vw] lg:-mx-[9vw] lg:grid-cols-3"
    >
      {categories.map(({ type, label, image }, index) => (
        <Link
          key={type}
          to={`/all-products?product_type=${type}`}
          className="group relative isolate block h-[230px] overflow-hidden bg-gray-900 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white sm:h-[300px] lg:h-[650px]"
          aria-label={t(label)}
        >
          <img
            src={image}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] ${type === "investment" ? "object-[center_20%] lg:object-top" : type === "consumable" ? "object-top" : "object-center"}`}
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" aria-hidden="true" />
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
