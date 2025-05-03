import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCoins } from "../api/coins";
import FilterSideBar from "../components/filters/FilterSideBar";
import BannerProducts from "../components/cards/BannerProducts";
import SmallCoinCard from "../components/cards/SmallCoinCard";
import Title from "../components/Partial/Title";

const parseParamsToFilters = (params) => ({
  country: params.get("country") || "All",
  material: params.get("material") || "",
  coin_grading: params.get("coin_grading") || "",
  minPrice: params.get("minPrice") || "",
  maxPrice: params.get("maxPrice") || "",
  sort: params.get("sort") || "",
  order: params.get("order") || "",
});

const AllProducts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(() =>
    parseParamsToFilters(searchParams)
  );

  useEffect(() => {
    const clean = { ...filters };
    Object.keys(clean).forEach((key) => {
      if (clean[key] === "" || clean[key] === "All") {
        delete clean[key];
      }
    });
    setSearchParams(clean);
  }, [filters, setSearchParams]);

  const {
    data: coins,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["coins", filters],
    queryFn: () => {
      const query = { ...filters };
      if (query.country === "All") delete query.country;
      return fetchCoins(query);
    },
    staleTime: 1000 * 60 * 5,
  });

  const updateFilter = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      country: "All",
      material: "",
      coin_grading: "",
      minPrice: "",
      maxPrice: "",
      sort: "",
      order: "",
    });
  };

  return (
    <div>
      <BannerProducts />
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 pt-10 border-t">
        <div className="min-w-[15rem] sticky top-[7rem] self-start h-fit">
          <FilterSideBar
            filters={filters}
            onChange={updateFilter}
            onReset={resetFilters}
          />
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center text-base sm:text-xl mb-4">
            <Title
              text1={(filters.country || "All").toUpperCase()}
              text2="ITEMS"
            />
          </div>

          {isLoading && <p>Loading...</p>}
          {isError && <p className="text-red-500">{error.message}</p>}
          {!isLoading && coins?.length === 0 && (
            <p className="text-red-500 text-lg font-medium">
              No products found in this category
            </p>
          )}

          {coins?.map((coin) => (
            <SmallCoinCard
              key={coin.id}
              id={coin.id}
              name={coin.name}
              price={coin.price}
              image={coin.photo_url}
              description={`${coin.denomination}. ${coin.year} . ${coin.country} . ${coin.material}`}
              flagImage={coin.country}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
