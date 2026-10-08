import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCoins } from "../api/coins";
import { filterLocalProducts, readShopFilters, toApiFilters } from "../utils/shopFilters";

const TYPE_SPECIFIC_FILTERS = [
  "country", "composition_metal", "coin_grading", "minYear", "maxYear",
  "denomination", "consumable_category",
];

export const useShopCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(24);
  const [view, setView] = useState("grid");
  const filters = useMemo(() => readShopFilters(searchParams), [searchParams]);
  const apiFilters = useMemo(() => toApiFilters(filters), [filters]);

  const { data = [], isLoading, isError, error } = useQuery({
    queryKey: ["shop-products", apiFilters],
    queryFn: () => fetchCoins(apiFilters),
    staleTime: 5 * 60 * 1000,
  });

  const products = useMemo(() => {
    const matching = filterLocalProducts(data, filters);
    return filters.sort ? matching : matching.sort((a, b) =>
      new Date(b.created_at || 0) - new Date(a.created_at || 0));
  }, [data, filters]);
  const pageCount = Math.max(1, Math.ceil(products.length / pageSize));
  const pageProducts = products.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => setPage(1), [searchParams, pageSize]);

  const updateFilter = (name, value) => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      if (name === "product_type") TYPE_SPECIFIC_FILTERS.forEach((field) => next.delete(field));
      if (value === "" || value === null || value === undefined || value === "all") next.delete(name);
      else next.set(name, String(value));
      return next;
    });
  };

  const updateSort = (value) => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      if (!value) {
        next.delete("sort");
        next.delete("order");
      } else {
        const [sort, order] = value.split("-");
        next.set("sort", sort);
        next.set("order", order);
      }
      return next;
    });
  };

  const changePageSize = (value) => {
    setPageSize(Number(value));
    setPage(1);
  };

  return {
    filters, products, pageProducts, page, setPage, pageSize, changePageSize,
    pageCount, view, setView, isLoading, isError, error,
    updateFilter, updateSort, resetFilters: () => setSearchParams({}),
  };
};
