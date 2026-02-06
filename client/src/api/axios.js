import axios from "axios";
// export const serverAPI = import.meta.env.VITE_API_URL
export const serverAPI = "http://localhost:5000";
// export const serverAPI = "https://mern-movie-api-gray.vercel.app";

const api = axios.create({
  // baseURL: `${import.meta.env.VITE_API_URL}/api`,
  baseURL: `http://localhost:5000/api`,
  // baseURL: `https://mern-movie-api-gray.vercel.app/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
