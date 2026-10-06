import { axiosInstance } from "../utils/axios";
import { buildQueryString } from "../utils/queryHelpers";

export const fetchCoins = async (params = {}) => {
  const queryString = buildQueryString(params);
  const res = await axiosInstance.get(`/coins?${queryString}`);
  if (!Array.isArray(res.data)) {
    throw new Error("The product service returned an unexpected response.");
  }
  return res.data;
};

export const fetchCoinById = async (id) => {
  const res = await axiosInstance.get(`/coins/${id}`);
  return res.data;
};

export const createCoin = async (data) => {
  const res = await axiosInstance.post("/coins", data);
  return res.data;
};

export const updateCoin = async (id, data) => {
  const res = await axiosInstance.put(`/coins/${id}`, data);
  return res.data;
};

export const deleteCoin = async (id) => {
  const res = await axiosInstance.delete(`/coins/${id}`);
  return res.data;
};
