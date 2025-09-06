import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token dynamically before each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // get latest token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
