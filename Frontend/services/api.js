import axios from "axios";

const api = axios.create({
  baseURL: "http://72.60.104.179:5000/api/v1/",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["x-access-token"] = token;
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
