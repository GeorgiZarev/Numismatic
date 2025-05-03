import { useState, useCallback } from "react";
import { buildQueryString } from "../utils/queryHelpers.js";
import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const useCoins = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCoins = useCallback(async (filterParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const queryString = buildQueryString(filterParams);
      const response = await axiosInstance.get(`/coins?${queryString}`);
      setCoins(response.data);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch coins");
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
