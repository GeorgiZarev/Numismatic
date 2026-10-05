import React from "react";
//import { Layout } from "antd";
//import GridForHeader from '../Partial/GridForHeader.jsx'
//import ProductItem from "./ProductItem.jsx";
import ProductGrid from "../Partial/ProductGrid.jsx";
// import CategoryGrid from "./CategoryGrid.jsx";
import Title from "./Title.jsx";
import { useTranslation } from "react-i18next";

// import SmallCoinCard from "../cards/SmallCoinCard.jsx";
import { Link } from "react-router-dom";

const CatalogGrid = () => {
  const { t } = useTranslation();

  return (
    <section className="my-12">
      <div className="text-center pb-7 text-2xl sm:text-3xl">
        <Title text1={t("home.our")} text2={t("home.coins")} />
      </div>
      <ProductGrid />
      <div className="text-center mt-8"><Link to="/all-products" className="inline-block border border-gray-900 px-6 py-3 text-gray-900 hover:bg-gray-900 hover:text-white">View all products</Link></div>
    </section>
  );
};

export default CatalogGrid;
