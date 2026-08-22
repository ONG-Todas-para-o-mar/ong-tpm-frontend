import axios from "axios";

const STORAGE_KEY = "tpm.auth";
const BASE_URL = import.meta.env.VITE_API_URL || "/api";

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
  baseURL: BASE_URL,
  timeout: 20000,
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

let refreshing = null;

async function renovarToken(refreshToken) {
  refreshing =
    refreshing ||
    axios
      .post(`${BASE_URL}/auth/refresh/`, { refresh: refreshToken })
      .then(({ data }) => {
        const auth = authStorage.read() || {};
        const next = {
          ...auth,
          accessToken: data.access,
          refreshToken: data.refresh || auth.refreshToken,
        };
        authStorage.write(next);
        return next.accessToken;
      })
      .finally(() => {
        refreshing = null;
      });
  return refreshing;
}

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    const auth = authStorage.read();

    if (
      err.response?.status === 401 &&
      original &&
      !original._retry &&
      auth?.refreshToken &&
      !original.url?.includes("/auth/")
    ) {
      original._retry = true;
      try {
        const token = await renovarToken(auth.refreshToken);
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      } catch {
        // token de refresh também expirou — cai para o logout abaixo
      }
    }

    if (err.response?.status === 401) {
      authStorage.clear();
      onUnauthorized?.();
    }
    return Promise.reject(err);
  }
);

export function mensagemDeErro(err, fallback = "Não foi possível concluir a operação.") {
  const data = err?.response?.data;
  if (!data) return err?.message || fallback;
  if (typeof data === "string") return data;
  if (data.detail) return data.detail;
  const primeiro = Object.values(data)[0];
  if (Array.isArray(primeiro)) return primeiro[0];
  if (typeof primeiro === "string") return primeiro;
  return fallback;
}

export async function baixarArquivo(url, nomePadrao) {
  const { data, headers } = await api.get(url, { responseType: "blob" });
  const disposition = headers["content-disposition"] || "";
  const match = disposition.match(/filename="?([^"]+)"?/);
  const href = URL.createObjectURL(data);
  const link = document.createElement("a");
  link.href = href;
  link.download = match ? match[1] : nomePadrao;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(href);
}
