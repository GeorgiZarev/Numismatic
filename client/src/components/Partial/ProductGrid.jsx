import React from "react";
import { useTranslation } from "react-i18next";
import ProductItem from "./ProductItem";
import { productName } from "../../utils/productName";

const ProductGrid = ({ products }) => {
  const { i18n } = useTranslation();
  return (
    <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
      {products.map((coin) => (
          <ProductItem
            key={coin.id}
            id={coin.id}
            image={coin.photo_url}
            name={productName(coin, i18n.language)}
            price={coin.price}
            type={coin.product_type}
            category={coin.consumable_category}
            stockQuantity={coin.stock_quantity}
          />
      ))}
    </div>
  );
};

export default ProductGrid;
