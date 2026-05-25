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

export const useCategorias = () =>
  useQuery({
    queryKey: ["categorias"],
    queryFn: () => api.get("/categorias/").then((r) => r.data.results || r.data),
    staleTime: 5 * 60_000,
  });

export const useCreateMeta = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api.post("/metas/", payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["metas"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useUpdateMeta = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) =>
      api.patch(`/metas/${id}/`, payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["metas"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useDeleteMeta = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/metas/${id}/`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["metas"] }),
  });
};
