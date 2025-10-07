import axios from "axios";
import { BASE_URL } from "./apiEndpoints";
// import {API_ENDPOINTS} from "./apiEndpoints"


const axiosConfig = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// list of end points to exclude from interceptor
const excludeEndPoints = [
  "/login",
  "/register",
  "/activate",
  "/status",
  "/health",
];

// request interceptors

axiosConfig.interceptors.request.use(
  (config) => {
    const shouldSkipToken = excludeEndPoints.some((endPoint) => {
      return config.url?.includes(endPoint);
    });

    if (!shouldSkipToken) {
      const accessToken = localStorage.getItem("token");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response interceptors
axiosConfig.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      window.location.href = "/login";
    } else if (error.response.status === 500) {
      console.log("Internal Server Error : Please try again later");
    } else if (error.code === "ECONNABORTED") {
      console.log("Request timed out : Please try again later");
    }
    return Promise.reject(error);
  }
);

export default axiosConfig;
