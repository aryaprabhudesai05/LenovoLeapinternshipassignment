import axios from "axios";
import { mockApi } from "./mockApi";

// Mock mode is now opt-in (VITE_USE_MOCK=true). By default the app talks to the
// real backend so every user sees their own MongoDB-backed data. When the
// backend is unreachable, read calls fall back to mock data for resilience.
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function isNetworkError(err) {
  return !err.response || err.code === "ECONNREFUSED" || err.message?.includes("Network");
}

const api = USE_MOCK
  ? mockApi
  : {
      get: async (url) => {
        try {
          const { data } = await http.get(url);
          return data;
        } catch (err) {
          if (isNetworkError(err)) {
            console.warn("[api] backend unreachable, using mock fallback for", url);
            return mockApi.get(url);
          }
          throw err;
        }
      },
      post: async (url, body, cfg) => {
        try {
          const { data } = await http.post(url, body, cfg);
          return data;
        } catch (err) {
          // On network failure (backend/DB unreachable) fall back to the mock
          // backend so the app stays usable. Real HTTP error responses (e.g.
          // 401 invalid credentials) are still propagated to the caller.
          if (isNetworkError(err)) {
            console.warn("[api] backend unreachable, using mock fallback for", url);
            return mockApi.post(url, body);
          }
          throw err;
        }
      },
      put: async (url, body) => {
        const { data } = await http.put(url, body);
        return data;
      },
      delete: async (url) => {
        const { data } = await http.delete(url);
        return data;
      },
      upload: async (url, form, onProgress) => {
        const { data } = await http.post(url, form, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) => onProgress?.(Math.round((e.loaded / e.total) * 100)),
        });
        return data;
      },
    };

export default api;
