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

export const useCampaigns = (status) =>
  useQuery({
    queryKey: ["campaigns", status || "all"],
    queryFn: () =>
      api.get("/campaigns", { params: status ? { status } : {} }).then((r) => r.data),
  });

export const useCampaign = (id) =>
  useQuery({
    queryKey: ["campaigns", id],
    queryFn: () => api.get(`/campaigns/${id}`).then((r) => r.data),
    enabled: !!id,
  });

export const useCreateCampaign = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api.post("/campaigns", payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["campaigns"] }),
  });
};

export const useArchiveCampaign = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.post(`/campaigns/${id}/archive`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["campaigns"] }),
  });
};

export const useReactivateCampaign = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.post(`/campaigns/${id}/reactivate`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["campaigns"] }),
  });
};
