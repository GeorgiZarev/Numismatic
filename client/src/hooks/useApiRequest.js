import { useCallback, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const useApiRequest = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(
    async (method, endpoint, body = null, isMultipart = false) => {
      setLoading(true);
      setError(null);

      try {
        const headers = {};

        if (isMultipart) {
          headers["Content-Type"] = "multipart/form-data";
        } else {
          headers["Content-Type"] = "application/json";
        }

        const response = await axiosInstance.request({
          method,
          url: endpoint,
          data: body,
          headers,
        });

        setData(response.data);
        return response.data;
      } catch (err) {
        const errMsg =
          err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Something went wrong!";
        setError(errMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getData = useCallback(
    async (endpoint) => {
      return await fetchData("GET", endpoint);
    },
    [fetchData]
  );
  const postData = async (endpoint, body, isMultipart = false) =>
    await fetchData("POST", endpoint, body, isMultipart);
  const putData = async (endpoint, body, isMultipart = false) =>
    await fetchData("PUT", endpoint, body, isMultipart);
  const deleteData = async (endpoint) => await fetchData("DELETE", endpoint);

  return {
    data,
    error,
    loading,
    getData,
    postData,
    putData,
    deleteData,
    fetchData,
  };
};
