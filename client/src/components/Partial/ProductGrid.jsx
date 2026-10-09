import React from "react";
import ProductItem from "./ProductItem";

const ProductGrid = ({ products }) => {
  return (
    <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
      {products.map((coin) => (
          <ProductItem
            key={coin.id}
            id={coin.id}
            image={coin.photo_url}
            name={coin.name}
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
