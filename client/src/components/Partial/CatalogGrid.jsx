import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchCoins } from "../../api/coins";
import { selectHomeProducts } from "../../utils/homeProductSections";
import ProductGrid from "./ProductGrid";

const sectionLinks = {
  newlyAdded: "/all-products",
  coins: "/all-products?product_type=coin",
  accessories: "/all-products?product_type=consumable",
};

const CatalogGrid = () => {
  const { t } = useTranslation();
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["home-products"],
    queryFn: () => fetchCoins(),
    staleTime: 0,
  });

  if (isLoading) return <p className="my-12 text-center">{t("home.loading")}</p>;
  if (error) return <p className="my-12 text-center text-red-700" role="alert">{error.message}</p>;

  const sections = selectHomeProducts(data);

  return (
    <div className="space-y-10 py-12 sm:space-y-14 sm:py-16">
      {Object.entries(sections).map(([key, products]) => (
        <section key={key} aria-labelledby={`home-${key}`}>
          <div className="mb-7 flex items-center justify-between gap-4 border-b border-gray-200 pb-4">
            <h2 id={`home-${key}`} className="font-serif text-[22px] font-semibold text-[#17352d] sm:text-[26px]">
              {t(`home.${key}`)}
            </h2>
            {sectionLinks[key] && (
              <Link to={sectionLinks[key]} className="shrink-0 text-sm font-medium text-[#235b50] underline-offset-4 hover:underline">
                {t("home.viewAll")}
              </Link>
            )}
          </div>
          {products.length ? <ProductGrid products={products} /> : (
            <p className="py-4 text-sm text-gray-600">{t("home.noProducts")}</p>
          )}
        </section>
      ))}
    </div>
  );
};

export default CatalogGrid;
