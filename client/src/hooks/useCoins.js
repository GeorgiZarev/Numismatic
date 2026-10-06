import { useState, useCallback } from "react";
import { axiosInstance } from "../utils/axios.js";
import { fetchCoins as fetchCoinList } from "../api/coins.js";

export const useCoins = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCoins = useCallback(async (filterParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      setCoins(await fetchCoinList(filterParams));
    } catch (err) {
      setCoins([]);
      setError(err.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, []);

  const getCoin = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/coins/${id}`);
      return response.data;
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Failed to fetch coin"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createCoin = useCallback(
    async (coinData) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.post("/coins", coinData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        await fetchCoins();
        return response.data;
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            "Failed to create coin"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchCoins]
  );

  const updateCoin = useCallback(
    async (id, coinData) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.put(`/coins/${id}`, coinData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        await fetchCoins();
        return response.data;
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            "Failed to update coin"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchCoins]
  );

  const deleteCoin = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);
      try {
        await axiosInstance.delete(`/coins/${id}`);
        await fetchCoins();
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            "Failed to delete coin"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchCoins]
  );

  return {
    coins,
    loading,
    error,
    fetchCoins,
    getCoin,
    createCoin,
    updateCoin,
    deleteCoin,
  };
};
