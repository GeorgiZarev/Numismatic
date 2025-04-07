import React, { useEffect, useState } from "react";
import { assets } from "../Assets/ObjFile.js";
import Title from "../components/Partial/Title.jsx";
import BannerProducts from "../components/cards/BannerProducts.jsx";
import SmallCoinCard from "../components/cards/SmallCoinCard.jsx";
import { useCoins } from "../hooks/useCoins.js";

const AllProducts = () => {
  const { coins, loading, error, fetchCoins } = useCoins();

  const [filterActive, setFilterActive] = useState(false);

  useEffect(() => {
    fetchCoins();
  }, [fetchCoins]);

  const handleAllItems = () => {
    //setFilterCoins(coins);
    console.log(coins);
  };

  return (
    <div>
      <BannerProducts />
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 pt-10 border-t">
        {/* Filters */}
        <div className="min-w-[15rem]">
          <p
            className="my-2 text-xl flex items-center cursor-pointer gap-2"
            onClick={() => setFilterActive(!filterActive)}
          >
            FILTER
            <img
              className={`h-3 sm:hidden transform ${
                filterActive ? "rotate-90" : ""
              }`}
              src={assets.dropdown_icon}
              alt="toggle"
            />
          </p>

          <div
            className={`border border-gray-300 sm:border-2 pl-3 py-2 mt-4 sm:pl-5 sm:py-3 sm:mt-6 
            ${filterActive ? "block" : "hidden sm:block"}`}
          >
            <p className="mb-3 text-sm font-medium">CATEGORIES</p>
            <div className="flex flex-col gap-2 text-base font-light text-gray-700">
              <p className="cursor-pointer" onClick={handleAllItems}>
                All Items
              </p>
              <p className="cursor-pointer">Bulgarian</p>
              <p className="cursor-pointer">Country2</p>
              <p className="cursor-pointer">Country3</p>
              <p className="cursor-pointer">Other</p>
            </div>
          </div>
        </div>

        {/* Coin Items */}
        <div className="flex-1">
          <div className="flex justify-between items-center text-base sm:text-xl mb-4">
            <Title text1="ALL" text2="ITEMS" />
            {/*<select className="border-2 border-gray-300 text-sm px-2">
              <option value="low-high-price">
                Sort by: Price (Low to High)
              </option>
              <option value="high-low-price">
                Sort by: Price (High to Low)
              </option>
              <option value="low-high-year">Sort by: Year (Low to High)</option>
              <option value="high-low-year">Sort by: Year (High to Low)</option>
            </select>*/}
          </div>

          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          <div>
            {coins?.map((coin) => (
              <SmallCoinCard
                key={coin.id}
                id={coin.id}
                name={coin.name}
                price={coin.price}
                image={coin.photo_url}
                description={coin.denomination}
                flagImage={coin.country}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
