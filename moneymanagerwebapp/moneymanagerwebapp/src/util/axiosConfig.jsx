import axios from "axios";
const axiosConfig = axios.create({
  baseURL: "http://localhost:8082/api/v1.0",
  withCredentials: true,
  timeout: 10000,
});

// Attach token to every request
axiosConfig.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      if (process.env.NODE_ENV !== "production") {
        console.debug("[axios] Using Authorization: Bearer <token present>");
      }
    }
    else if (process.env.NODE_ENV !== "production") {
      console.warn("[axios] No auth token found in storage; requests to protected endpoints will be 401/403.");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosConfig.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      const { status } = error.response;

      // Handle 401 - Try to refresh token
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken) {
          try {
            console.debug("[axios] Attempting to refresh token...");
            const response = await axios.post("http://localhost:8082/api/v1.0/refresh-token", {
              refreshToken: refreshToken,
            });

            const newToken = response.data.token;
            const newRefreshToken = response.data.refreshToken; // If rotated

            localStorage.setItem("token", newToken);
            if (newRefreshToken) localStorage.setItem("refreshToken", newRefreshToken);

            console.debug("[axios] Token refreshed successfully.");

            // Update header and retry original request
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axiosConfig(originalRequest);

          } catch (refreshError) {
            console.error("[axios] Refresh token failed:", refreshError);
            // Clear tokens and redirect to login
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            window.location.href = "/login";
            return Promise.reject(refreshError);
          }
        } else {
          console.warn("[axios] No refresh token available. Redirecting to login.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      } else if (status === 403) {
        console.warn("[axios] 403 Forbidden - token may be invalid or user lacks permission.");
      }
    } else {
      console.error("[axios] Network or CORS error:", error?.message || error);
    }
    return Promise.reject(error);
  }
);

export default axiosConfig;

