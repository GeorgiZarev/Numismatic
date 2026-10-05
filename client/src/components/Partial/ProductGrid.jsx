import React, { useEffect } from "react";
import ProductItem from "./ProductItem";
import { useCoins } from "../../hooks/useCoins";

const ProductGrid = () => {
  const { coins, loading, error, fetchCoins } = useCoins();

  useEffect(() => {
    fetchCoins({ product_type: "coin" });
  }, [fetchCoins]);

  if (loading) return <p>Loading coins...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!coins || coins.length === 0) return <p>No coins found.</p>;

  return (
    <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
      {coins.slice(0, 8).map((coin) => (
          <ProductItem
            key={coin.id}
            id={coin.id}
            image={coin.photo_url}
            name={coin.name}
            price={coin.price}
          />
      ))}
    </div>
  );
};

export default ProductGrid;
