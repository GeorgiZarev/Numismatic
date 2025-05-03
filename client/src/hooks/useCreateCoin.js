import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCoin } from "../api/coins";

export const useCreateCoin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCoin,
    onSuccess: () => {
      queryClient.invalidateQueries(["coins"]);
    },
  });
};
