import axios from "axios";

const isLocalhost =
  typeof window !== "undefined" && window.location.hostname === "localhost";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (isLocalhost ? "http://localhost:3001/api" : "/api");

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});
