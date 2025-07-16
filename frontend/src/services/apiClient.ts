import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Đảm bảo interceptor chỉ khai báo 1 lần ở đây
apiClient.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("toeic_access_token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
