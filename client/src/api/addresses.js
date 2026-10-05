import { axiosInstance } from "../utils/axios";

export const fetchAddresses = async () => (await axiosInstance.get("/addresses")).data;
export const createAddress = async (data) => (await axiosInstance.post("/addresses", data)).data;
export const updateAddress = async (id, data) => (await axiosInstance.put(`/addresses/${id}`, data)).data;
export const deleteAddress = async (id) => (await axiosInstance.delete(`/addresses/${id}`)).data;
