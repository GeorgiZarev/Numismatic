import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCoins } from "../api/coins";
import FilterSideBar from "../components/filters/FilterSideBar";
import BannerProducts from "../components/cards/BannerProducts";
import ProductItem from "../components/Partial/ProductItem";
import Title from "../components/Partial/Title";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import ConsumableCategoryFilter from "../components/products/ConsumableCategoryFilter";

const parseParamsToFilters = (params) => ({
  country: params.get("country") || "All",
  composition_metal: params.get("composition_metal") || "",
  coin_grading: params.get("coin_grading") || "",
  minPrice: params.get("minPrice") || "",
  maxPrice: params.get("maxPrice") || "",
  sort: params.get("sort") || "",
  order: params.get("order") || "",
  search: params.get("search") || "",
  product_type: params.get("product_type") === "consumable" ? "consumable" : "coin",
  consumable_category: params.get("consumable_category") || "",
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
      if (query.product_type !== "consumable") delete query.consumable_category;
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
      composition_metal: "",
      coin_grading: "",
      minPrice: "",
      maxPrice: "",
      sort: "",
      order: "",
      search: "",
      product_type: filters.product_type,
      consumable_category: "",
    };
    setFilters(defaultFilters);
    setSearchParams({ product_type: filters.product_type });
  };

  return (
    <div>
      <BannerProducts />
      <div className="flex gap-2 border-b mt-8" role="tablist" aria-label="Product categories">
        {[["coin", "Coins"], ["consumable", "Consumables"]].map(([type, label]) => <button key={type} type="button" role="tab" aria-selected={filters.product_type === type} onClick={() => setSearchParams({ product_type: type })} className={`px-5 py-3 border-b-2 text-base font-medium ${filters.product_type === type ? "border-orange-600 text-gray-900" : "border-transparent text-gray-600"}`}>{label}</button>)}
      </div>
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 pt-10 border-t">
        {filters.product_type === "coin" && <div className="min-w-[15rem] sticky top-[7rem] self-start h-fit">
          <FilterSideBar
            filters={filters}
            onChange={updateFilter}
            onReset={resetFilters}
          />
        </div>}

        <div className="flex-1">
          {filters.product_type === "consumable" && <ConsumableCategoryFilter
            value={filters.consumable_category}
            onChange={(value) => setSearchParams((previous) => {
              const next = new URLSearchParams(previous);
              if (value) next.set("consumable_category", value);
              else next.delete("consumable_category");
              return next;
            })}
          />}
          <div className="flex justify-between items-center text-base sm:text-xl mb-4">
            <Title
              text1={(filters.product_type === "consumable" ? "All" : filters.country === "All"
                ? t("products.All")
                : filters.country
              ).toUpperCase()}
              text2={t("products.Items").toUpperCase()}
            />
          </div>

          <input
            type="text"
            placeholder={`Search ${filters.product_type === "coin" ? "coins" : "consumables"}...`}
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
          {!isLoading && !isError && visibleCoins.length === 0 && (
            <p className="text-gray-600 text-base mb-8">
              {t("products.noResults")}
            </p>
          )}

          {!isLoading && !isError && <InfiniteScroll
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
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5">{visibleCoins.map((coin) => (
              <ProductItem key={coin.id} id={coin.id} image={coin.photo_url} name={coin.name} price={coin.price} type={coin.product_type} category={coin.consumable_category} />
            ))}</div>
          </InfiniteScroll>}
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
