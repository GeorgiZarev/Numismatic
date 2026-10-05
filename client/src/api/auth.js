import { axiosInstance } from "../utils/axios";

export const loginUser = async (credentials) => {
  const res = await axiosInstance.post("/auth/login", credentials);
  return res.data;
};

export const registerUser = async (payload) => {
  const res = await axiosInstance.post("/auth/register", payload);
  return res.data;
};

export const logoutUser = async () => {
  const res = await axiosInstance.post("/auth/logout");
  return res.data;
};

export const fetchCurrentUser = async () => {
  const res = await axiosInstance.get("/auth/me");
  return res.data;
};

export const updateCurrentUser = async (payload) => {
  const res = await axiosInstance.patch("/auth/me", payload);
  return res.data;
};
