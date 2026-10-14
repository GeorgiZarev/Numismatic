import axios from "axios";

const localHosts = ["localhost", "127.0.0.1"];
const hostname = typeof window !== "undefined" ? window.location.hostname : "";

// Keep the API on the same hostname as the page so auth cookies stay same-site.
const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (localHosts.includes(hostname) ? `http://${hostname}:3001/api` : "/api");

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});
