import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api.js";

const lista = (r) => r.data.results || r.data;

const qs = (params = {}) => {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ""
  );
  return entries.length ? `?${new URLSearchParams(entries)}` : "";
};

/* ── Campanhas / projetos ─────────────────────────────────────────── */

export const useMetas = (params) =>
  useQuery({
    queryKey: ["metas", params || null],
    queryFn: () => api.get(`/metas/${qs(params)}`).then(lista),
  });

export const useMeta = (id) =>
  useQuery({
    queryKey: ["meta", id],
    queryFn: () => api.get(`/metas/${id}/`).then((r) => r.data),
    enabled: !!id,
  });

export const useCategorias = () =>
  useQuery({
    queryKey: ["categorias"],
    queryFn: () => api.get("/categorias/").then(lista),
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
    mutationFn: ({ id, payload }) => api.patch(`/metas/${id}/`, payload).then((r) => r.data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["metas"] });
      qc.invalidateQueries({ queryKey: ["meta", vars.id] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useDeleteMeta = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/metas/${id}/`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["metas"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

/* ── Notícias ─────────────────────────────────────────────────────── */

export const useNoticias = (params) =>
  useQuery({
    queryKey: ["noticias", params || null],
    queryFn: () => api.get(`/noticias/${qs(params)}`).then(lista),
  });

export const useNoticia = (slug) =>
  useQuery({
    queryKey: ["noticia", slug],
    queryFn: () => api.get(`/noticias/${slug}/`).then((r) => r.data),
    enabled: !!slug,
  });

export const useCreateNoticia = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api.post("/noticias/", payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["noticias"] }),
  });
};

export const useUpdateNoticia = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, payload }) =>
      api.patch(`/noticias/${slug}/`, payload).then((r) => r.data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["noticias"] });
      qc.invalidateQueries({ queryKey: ["noticia", vars.slug] });
    },
  });
};

export const useDeleteNoticia = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (slug) => api.delete(`/noticias/${slug}/`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["noticias"] }),
  });
};

/* ── TPM na Mídia (vídeos) ────────────────────────────────────────── */

export const useVideos = (params) =>
  useQuery({
    queryKey: ["videos", params || null],
    queryFn: () => api.get(`/videos/${qs(params)}`).then(lista),
  });

export const useCreateVideo = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api.post("/videos/", payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["videos"] }),
  });
};

export const useUpdateVideo = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => api.patch(`/videos/${id}/`, payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["videos"] }),
  });
};

export const useDeleteVideo = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/videos/${id}/`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["videos"] }),
  });
};

/* ── Fique por dentro (Instagram) ─────────────────────────────────── */

export const usePostsInstagram = (params) =>
  useQuery({
    queryKey: ["instagram", params || null],
    queryFn: () => api.get(`/instagram/${qs(params)}`).then(lista),
  });

export const useCreatePostInstagram = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api.post("/instagram/", payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["instagram"] }),
  });
};

export const useUpdatePostInstagram = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => api.patch(`/instagram/${id}/`, payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["instagram"] }),
  });
};

export const useDeletePostInstagram = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/instagram/${id}/`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["instagram"] }),
  });
};

/* ── Selos de sócio ───────────────────────────────────────────────── */

export const useBadges = () =>
  useQuery({
    queryKey: ["badges"],
    queryFn: () => api.get("/badges/").then(lista),
  });

export const useSocios = () =>
  useQuery({
    queryKey: ["socios"],
    queryFn: () => api.get("/socios/").then((r) => r.data),
  });

export const useCreateBadge = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api.post("/badges/", payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["badges"] });
      qc.invalidateQueries({ queryKey: ["socios"] });
    },
  });
};

export const useUpdateBadge = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => api.patch(`/badges/${id}/`, payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["badges"] });
      qc.invalidateQueries({ queryKey: ["socios"] });
    },
  });
};

export const useDeleteBadge = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/badges/${id}/`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["badges"] });
      qc.invalidateQueries({ queryKey: ["socios"] });
    },
  });
};

export const useAtribuirBadge = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, doador }) =>
      api.post(`/badges/${id}/atribuir/`, { doador }).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["badges"] });
      qc.invalidateQueries({ queryKey: ["socios"] });
      qc.invalidateQueries({ queryKey: ["ranking"] });
    },
  });
};

/* ── Doações ──────────────────────────────────────────────────────── */

export const useDoacoes = (params) =>
  useQuery({
    queryKey: ["doacoes", params || null],
    queryFn: () => api.get(`/doacoes/${qs(params)}`).then(lista),
  });

export const useCreateDoacao = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api.post("/doacoes/", payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      qc.invalidateQueries({ queryKey: ["metas"] });
      qc.invalidateQueries({ queryKey: ["doacoes"] });
      qc.invalidateQueries({ queryKey: ["painel"] });
    },
  });
};

const invalidarDoacoes = (qc) => {
  qc.invalidateQueries({ queryKey: ["doacoes"] });
  qc.invalidateQueries({ queryKey: ["dashboard"] });
  qc.invalidateQueries({ queryKey: ["metas"] });
  qc.invalidateQueries({ queryKey: ["ranking"] });
  qc.invalidateQueries({ queryKey: ["socios"] });
};

export const useConfirmarDoacao = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.post(`/doacoes/${id}/confirmar/`).then((r) => r.data),
    onSuccess: () => invalidarDoacoes(qc),
  });
};

export const useFalharDoacao = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, observacao }) =>
      api.post(`/doacoes/${id}/falhar/`, { observacao }).then((r) => r.data),
    onSuccess: () => invalidarDoacoes(qc),
  });
};

/* ── Impacto ──────────────────────────────────────────────────────── */

export const useImpactos = (params) =>
  useQuery({
    queryKey: ["impacto", params || null],
    queryFn: () => api.get(`/impacto/${qs(params)}`).then(lista),
  });

export const useCreateImpacto = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api.post("/impacto/", payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["impacto"] });
      qc.invalidateQueries({ queryKey: ["meta"] });
    },
  });
};

export const useDeleteImpacto = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/impacto/${id}/`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["impacto"] });
      qc.invalidateQueries({ queryKey: ["meta"] });
    },
  });
};

/* ── Contato ──────────────────────────────────────────────────────── */

export const useEnviarMensagem = () =>
  useMutation({
    mutationFn: (payload) => api.post("/mensagens/", payload).then((r) => r.data),
  });

export const useMensagens = (params) =>
  useQuery({
    queryKey: ["mensagens", params || null],
    queryFn: () => api.get(`/mensagens/${qs(params)}`).then(lista),
  });

export const useUpdateMensagem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => api.patch(`/mensagens/${id}/`, payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mensagens"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useDeleteMensagem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/mensagens/${id}/`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mensagens"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

/* ── Doadores (admin) ─────────────────────────────────────────────── */

export const useDoadores = (params) =>
  useQuery({
    queryKey: ["doadores", params || null],
    queryFn: () => api.get(`/doadores/${qs(params)}`).then(lista),
  });

/* ── Dashboards e ranking ─────────────────────────────────────────── */

export const useRanking = (params) =>
  useQuery({
    queryKey: ["ranking", params || null],
    queryFn: () => api.get(`/ranking/${qs(params)}`).then((r) => r.data),
  });

export const useDashboardPublico = () =>
  useQuery({
    queryKey: ["dashboard", "publico"],
    queryFn: () => api.get("/dashboard/publico/").then((r) => r.data),
  });

export const useDashboardAdmin = (dias = 14) =>
  useQuery({
    queryKey: ["dashboard", "admin", dias],
    queryFn: () => api.get(`/dashboard/admin/?dias=${dias}`).then((r) => r.data),
  });

/* ── Conta ────────────────────────────────────────────────────────── */

export const useMe = (enabled = true) =>
  useQuery({
    queryKey: ["me"],
    queryFn: () => api.get("/me/").then((r) => r.data),
    enabled,
  });

export const usePainelDoador = (enabled = true) =>
  useQuery({
    queryKey: ["painel"],
    queryFn: () => api.get("/doadores/me/").then((r) => r.data),
    enabled,
  });

export const useUpdateMe = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api.patch("/me/", payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["me"] });
      qc.invalidateQueries({ queryKey: ["painel"] });
      qc.invalidateQueries({ queryKey: ["ranking"] });
    },
  });
};

export const useUpdatePerfilDoador = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api.patch("/doadores/me/", payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["painel"] }),
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

export const useTrocarSenha = () =>
  useMutation({
    mutationFn: (payload) => api.post("/auth/senha/", payload).then((r) => r.data),
  });

export const useRecuperarSenha = () =>
  useMutation({
    mutationFn: (payload) => api.post("/auth/senha/recuperar/", payload).then((r) => r.data),
  });

export const useRedefinirSenha = () =>
  useMutation({
    mutationFn: (payload) => api.post("/auth/senha/redefinir/", payload).then((r) => r.data),
  });
