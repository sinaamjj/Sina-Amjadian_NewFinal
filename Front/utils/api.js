import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:6500",
  timeout: 8000,
});

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token =
      localStorage.getItem("accessToken") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      const decoded = parseJwt(token);
      if (decoded) console.log("🧩 محتوای JWT:", decoded);
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isOffline =
      !navigator.onLine ||
      error.code === "ERR_NETWORK" ||
      (error.message && error.message.includes("Network Error")) ||
      (error.request && !error.response);

    if (isOffline) {
      console.error("🚫 اتصال به سرور ممکن نیست یا اینترنت قطع است.");
      if (typeof window !== "undefined") {
        window.location.href = "/ErrorConnection";
      }
      return;
    }

    if (error.response && error.response.status === 403) {
      console.warn("⛔ توکن نامعتبر است — هدایت به ورود");
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("token");
        window.location.href = "/Login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
