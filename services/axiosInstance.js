import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://api3.pulsecare.my.id/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Tambahkan token sebelum setiap request
axiosInstance.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("@token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
