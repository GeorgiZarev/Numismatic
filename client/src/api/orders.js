import { axiosInstance } from "../utils/axios";

const cleanParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== "" && value != null)
  );

export const createOrder = async (payload) => {
  const res = await axiosInstance.post("/orders", payload);
  return res.data;
};

export const fetchMyOrders = async () => {
  const res = await axiosInstance.get("/orders/my");
  return res.data;
};

export const fetchAllOrders = async (params = {}) => {
  const res = await axiosInstance.get("/orders", { params: cleanParams(params) });
  return res.data;
};

export const updateOrderStatus = async (id, status) => {
  const res = await axiosInstance.patch(`/orders/${id}/status`, { status });
  return res.data;
};
