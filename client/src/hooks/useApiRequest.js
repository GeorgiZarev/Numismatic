import { useCallback, useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://localhost:5000/api";

export const useApiRequest = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchData = useCallback(
    async (method, endpoint, body = null, requestAuth = false) => {
      setLoading(true);
      setError(null);

      try {
        const headers = {
          "Content-Type": "application/json",
          ...(requestAuth ? getAuthHeader() : {}),
        };

        const response = await axios({
          method,
          url: `${API_BASE_URL}/${endpoint}`,
          headers,
          ...(body && { data: body }),
        });

        setData(response.data);
        return response.data;
      } catch (error) {
        setError(error.response?.data?.message || "Something went wrong!");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getData = async (endpoint) => await fetchData("GET", endpoint);
  const postData = async (endpoint, body) =>
    await fetchData("POST", endpoint, body, true);
  const putData = async (endpoint, body) =>
    await fetchData("PUT", endpoint, body, true);
  const deleteData = async (endpoint) =>
    await fetchData("DELETE", endpoint, null, true);

  return {
    data,
    error,
    loading,
    fetchData,
    getData,
    postData,
    putData,
    deleteData,
  };
};
