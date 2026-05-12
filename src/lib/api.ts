import axios from "axios";

// Helper to determine the backend base URL
const getBaseURL = () => {
  if (typeof window === "undefined") return "/api";

  const { hostname } = window.location;
  // If we're on localhost, hit the backend directly (port 5001) to bypass proxy flakiness
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://127.0.0.1:5001/api";
  }

  return "/api";
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true, // Required for secure cookies
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
  (error) => Promise.reject(error),
);

// Response interceptor to handle token refresh and non-JSON errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the response is HTML (indicates proxy/server mismatch)
    const contentType = error.response?.headers?.["content-type"];
    if (contentType && contentType.includes("text/html")) {
      console.error(
        "API Connection Error: Received HTML instead of JSON. Ensure the backend server is running on port 5001.",
      );
      return Promise.reject(new Error("Internal Server Error (HTML Response)"));
    }

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${getBaseURL()}/auth/refresh-token`,
          {},
          { withCredentials: true },
        );
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
  },
);

export default api;
