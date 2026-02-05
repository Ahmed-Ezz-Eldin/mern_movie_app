import axios from "axios";
// export const serverAPI = import.meta.env.VITE_API_URL
export const serverAPI = "http://localhost:5000";

const api = axios.create({
  // baseURL: `${import.meta.env.VITE_API_URL}/api`,
  baseURL: `http://localhost:5000/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
