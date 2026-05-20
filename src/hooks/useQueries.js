import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api.js";

export const useMetas = () =>
  useQuery({
    queryKey: ["metas"],
    queryFn: () => api.get("/metas/").then((r) => r.data.results || r.data),
  });

export const useBadges = () =>
  useQuery({
    queryKey: ["badges"],
    queryFn: () => api.get("/badges/").then((r) => r.data.results || r.data),
  });

export const useRanking = () =>
  useQuery({
    queryKey: ["ranking"],
    queryFn: () => api.get("/ranking/").then((r) => r.data),
  });

export const useDashboardPublico = () =>
  useQuery({
    queryKey: ["dashboard", "publico"],
    queryFn: () => api.get("/dashboard/publico/").then((r) => r.data),
  });

export const useMe = (enabled = true) =>
  useQuery({
    queryKey: ["me"],
    queryFn: () => api.get("/me/").then((r) => r.data),
    enabled,
  });

export const useCreateDoacao = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api.post("/doacoes/", payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      qc.invalidateQueries({ queryKey: ["metas"] });
    },
  });
};

export const useLogin = () =>
  useMutation({
    mutationFn: (creds) => api.post("/auth/login/", creds).then((r) => r.data),
  });

export const useRegister = () =>
  useMutation({
    mutationFn: (payload) => api.post("/auth/register/", payload).then((r) => r.data),
  });
