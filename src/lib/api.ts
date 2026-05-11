import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// Request interceptor to add the access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh and non-JSON errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the response is HTML (likely a 404/500 from the dev server)
    const contentType = error.response?.headers?.["content-type"];
    if (contentType && contentType.includes("text/html")) {
        const htmlSnippet = typeof error.response.data === 'string' ? error.response.data.substring(0, 200) : '[Binary/Object]';
        console.error("API Error: Received HTML instead of JSON.", htmlSnippet);
        return Promise.reject(new Error("Internal Server Error (Received HTML)"));
    }

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post("/api/auth/refresh-token", {}, { withCredentials: true });
        const { accessToken } = res.data;

        localStorage.setItem("accessToken", accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("auth-failure"));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
