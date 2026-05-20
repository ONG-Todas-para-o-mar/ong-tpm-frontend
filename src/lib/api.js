import axios from "axios";

const STORAGE_KEY = "tpm.auth";

export const authStorage = {
  read() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  write(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },
  clear() {
    localStorage.removeItem(STORAGE_KEY);
  },
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const auth = authStorage.read();
  if (auth?.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`;
  }
  return config;
});

let onUnauthorized = null;
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn;
};

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      authStorage.clear();
      onUnauthorized?.();
    }
    return Promise.reject(err);
  }
);
