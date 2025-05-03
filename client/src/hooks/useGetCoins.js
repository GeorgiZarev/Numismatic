// src/hooks/useCoins.js (optional)
import { useQuery } from "@tanstack/react-query";
import { fetchCoins } from "../api/coins";

export const useCoins = (params = {}) => {
  return useQuery({
    queryKey: ["coins", params],
    queryFn: () => fetchCoins(params),
    staleTime: 1000 * 60 * 5,
  });
};
