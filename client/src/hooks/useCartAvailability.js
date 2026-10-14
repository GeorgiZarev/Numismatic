import { useQuery } from "@tanstack/react-query";
import { fetchCoinById } from "../api/coins";
import { availableForSize, cartItemKey, hasProductSizes } from "../utils/productSizes";

export const useCartAvailability = (items) => {
  const ids = [...new Set(items.map(({ id }) => id))].sort();
  const query = useQuery({
    queryKey: ["cart-availability", ids],
    enabled: ids.length > 0,
    staleTime: 0,
    refetchOnMount: "always",
    queryFn: async () => Promise.all(ids.map(async (id) => {
      try {
        return await fetchCoinById(id);
      } catch (error) {
        if (error.response?.status === 404) return null;
        throw error;
      }
    })),
  });
  const byId = new Map((query.data || []).filter(Boolean).map((product) => [product.id, product]));
  const issues = items.filter((item) => {
    const product = byId.get(item.id);
    return !product || (hasProductSizes(product) && item.size_mm == null) || (!hasProductSizes(product) && item.size_mm != null) || availableForSize(product, item.size_mm) < item.quantity;
  });

  return { ...query, byId, issues, issueKeys: new Set(issues.map(cartItemKey)) };
};
