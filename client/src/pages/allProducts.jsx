import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCoins } from "../api/coins";
import FilterSideBar from "../components/filters/FilterSideBar";
import BannerProducts from "../components/cards/BannerProducts";
import SmallCoinCard from "../components/cards/SmallCoinCard";
import Title from "../components/Partial/Title";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";

const parseParamsToFilters = (params) => ({
  country: params.get("country") || "All",
  material: params.get("material") || "",
  coin_grading: params.get("coin_grading") || "",
  minPrice: params.get("minPrice") || "",
  maxPrice: params.get("maxPrice") || "",
  sort: params.get("sort") || "",
  order: params.get("order") || "",
  search: params.get("search") || "",
});

const ITEMS_PER_PAGE = 12;

const AllProducts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(() =>
    parseParamsToFilters(searchParams)
  );
  const [liveSearch, setLiveSearch] = useState(filters.search || "");
  const [page, setPage] = useState(1);
  const [visibleCoins, setVisibleCoins] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const newFilters = parseParamsToFilters(searchParams);
    setFilters(newFilters);
    setLiveSearch(newFilters.search);
    setPage(1);
  }, [searchParams]);

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

  useEffect(() => {
    if (coins) {
      setVisibleCoins(coins.slice(0, ITEMS_PER_PAGE));
    }
  }, [coins]);

  const fetchMoreData = () => {
    const nextPage = page + 1;
    const nextSlice = coins.slice(0, nextPage * ITEMS_PER_PAGE);
    setVisibleCoins(nextSlice);
    setPage(nextPage);
  };

  const updateFilter = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
    setSearchParams((prev) => {
      const updated = { ...parseParamsToFilters(prev), [field]: value };
      if (updated.country === "All") delete updated.country;
      return updated;
    });
  };

  const resetFilters = () => {
    const defaultFilters = {
      country: "All",
      material: "",
      coin_grading: "",
      minPrice: "",
      maxPrice: "",
      sort: "",
      order: "",
      search: "",
    };
    setFilters(defaultFilters);
    setSearchParams({});
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

        <div className="flex-1">
          <div className="flex justify-between items-center text-base sm:text-xl mb-4">
            <Title
              text1={(filters.country === "All"
                ? t("products.All")
                : filters.country
              ).toUpperCase()}
              text2={t("products.Items").toUpperCase()}
            />
          </div>

          <input
            type="text"
            placeholder="Search coins..."
            className="border px-3 py-2 rounded w-full sm:w-1/2 mb-6"
            value={liveSearch}
            onChange={(e) => {
              const value = e.target.value;
              setLiveSearch(value);

              if (value.trim() === "") {
                const newFilters = { ...filters, search: "" };
                if (newFilters.country === "All") delete newFilters.country;
                setSearchParams(newFilters);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const newFilters = { ...filters, search: liveSearch };
                if (newFilters.country === "All") delete newFilters.country;
                setSearchParams(newFilters);
              }
            }}
          />

          {isLoading && <p>Loading...</p>}
          {isError && <p className="text-red-500">{error.message}</p>}
          {!isLoading && visibleCoins.length === 0 && (
            <p className="text-red-500 text-lg font-medium">
              {t("products.noResults")}
            </p>
          )}

          <InfiniteScroll
            dataLength={visibleCoins.length}
            next={fetchMoreData}
            hasMore={visibleCoins.length < (coins?.length || 0)}
            loader={<p className="text-center py-4">Loading more...</p>}
            endMessage={
              visibleCoins.length > 0 ? (
                <p className="text-center text-gray-500 py-4">
                  {t("products.noMore")}
                </p>
              ) : null
            }
          >
            {visibleCoins.map((coin) => (
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
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
