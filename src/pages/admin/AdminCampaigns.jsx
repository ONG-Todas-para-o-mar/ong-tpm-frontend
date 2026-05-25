import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Icon from "../../components/Icon.jsx";
import { AdminLayout } from "../../components/Charts.jsx";
import { LoadingState, ErrorState, Spinner } from "../../components/Shared.jsx";
import { BRL2 } from "../../lib/format.js";
import {
  useMetas,
  useCategorias,
  useCreateMeta,
  useUpdateMeta,
} from "../../hooks/useQueries.js";

const schema = z.object({
  titulo: z.string().min(3, "Mínimo 3 caracteres"),
  descricao: z.string().optional().default(""),
  categoria_id: z.coerce.number().int().positive("Selecione uma categoria"),
  valor_alvo: z.coerce.number().nonnegative("Valor inválido"),
  prazo: z.string().optional().default(""),
});

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR");
}

function isAuthMissing(err) {
  return err?.response?.status === 401 || err?.response?.status === 403;
}

export default function AdminCampaigns() {
  const [filter, setFilter] = useState("");
  const [submitError, setSubmitError] = useState(null);

  const { data: metas, isLoading, isError, error, refetch } = useMetas();
  const { data: categorias } = useCategorias();
  const create = useCreateMeta();
  const update = useUpdateMeta();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      titulo: "",
      descricao: "",
      categoria_id: "",
      valor_alvo: "",
      prazo: "",
    },
  });

  const visible = (metas || []).filter((m) => {
    if (filter === "ativa") return m.ativa === true;
    if (filter === "arquivada") return m.ativa === false;
    return true;
  });

  const onSubmit = async (data) => {
    setSubmitError(null);
    try {
      const payload = {
        titulo: data.titulo,
        descricao: data.descricao || "",
        categoria_id: data.categoria_id,
        valor_alvo: data.valor_alvo,
      };
      if (data.prazo) payload.prazo = data.prazo;
      await create.mutateAsync(payload);
      reset();
    } catch (err) {
      if (isAuthMissing(err)) {
        setSubmitError(
          "Sessão sem token válido. Faça login com um admin de verdade (não use o modo demo)."
        );
      } else {
        setSubmitError(
          err.response?.data?.detail ||
            JSON.stringify(err.response?.data) ||
            err.message ||
            "Falha ao salvar."
        );
      }
    }
  };

  const toggle = (m) => {
    update.mutate({ id: m.id, ativa: !m.ativa });
  };

  return (
    <AdminLayout label="Campanhas">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "end", marginBottom: 32 }}>
        <div>
          <span className="eyebrow">Gestão</span>
          <h1 className="display" style={{ fontSize: 38, margin: "10px 0 4px" }}>
            Campanhas
          </h1>
          <p style={{ color: "var(--ink-3)", margin: 0, fontSize: 14 }}>
            Cadastre e gerencie as metas/campanhas da ONG.
          </p>
        </div>
        <div className="row gap-12">
          <select
            className="input"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ width: 200 }}
          >
            <option value="">Todas</option>
            <option value="ativa">Ativas</option>
            <option value="arquivada">Arquivadas</option>
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 16 }}>
        <div className="card" style={{ padding: 28 }}>
          <span className="eyebrow">Nova campanha</span>
          <h2 className="display" style={{ fontSize: 22, margin: "10px 0 22px" }}>
            Cadastrar
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "grid", gap: 16 }} noValidate>
            <div>
              <label className="label" htmlFor="titulo">Título</label>
              <input
                id="titulo"
                className={"input" + (errors.titulo ? " error" : "")}
                placeholder="Mutirão Praia de Maracaípe"
                {...register("titulo")}
              />
              {errors.titulo && <div className="field-error">{errors.titulo.message}</div>}
            </div>

            <div>
              <label className="label" htmlFor="descricao">Descrição</label>
              <textarea
                id="descricao"
                className="input"
                rows={3}
                placeholder="O que essa campanha faz e quem ela beneficia"
                {...register("descricao")}
              />
            </div>

            <div>
              <label className="label" htmlFor="categoria_id">Categoria</label>
              <select
                id="categoria_id"
                className={"input" + (errors.categoria_id ? " error" : "")}
                {...register("categoria_id")}
              >
                <option value="">Selecione…</option>
                {(categorias || []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
              {errors.categoria_id && (
                <div className="field-error">{errors.categoria_id.message}</div>
              )}
            </div>

            <div className="row gap-12">
              <div style={{ flex: 1 }}>
                <label className="label" htmlFor="valor_alvo">Valor-alvo (R$)</label>
                <input
                  id="valor_alvo"
                  type="number"
                  step="0.01"
                  min="0"
                  className={"input" + (errors.valor_alvo ? " error" : "")}
                  {...register("valor_alvo")}
                />
                {errors.valor_alvo && (
                  <div className="field-error">{errors.valor_alvo.message}</div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <label className="label" htmlFor="prazo">Prazo (opcional)</label>
                <input
                  id="prazo"
                  type="date"
                  className="input"
                  {...register("prazo")}
                />
              </div>
            </div>

            {submitError && <div className="field-error" role="alert">{submitError}</div>}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || create.isPending}
              style={{ marginTop: 8 }}
            >
              {isSubmitting || create.isPending ? (
                <><Spinner size={14} /> Salvando…</>
              ) : (
                <>Cadastrar campanha <Icon name="arrow" size={14} /></>
              )}
            </button>
          </form>
        </div>

        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div
            className="row"
            style={{
              justifyContent: "space-between",
              padding: "22px 28px",
              borderBottom: "1px solid var(--line)",
            }}
          >
            <span className="eyebrow">Campanhas cadastradas</span>
            <span className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>
              {visible.length} {filter ? "filtradas" : "no total"}
            </span>
          </div>

          {isLoading && <LoadingState label="Carregando campanhas…" />}
          {isError && (
            <div style={{ padding: "32px 16px" }}>
              <ErrorState
                message={
                  isAuthMissing(error)
                    ? "Sessão sem token válido. Faça login com um admin real."
                    : "Erro ao carregar metas do backend."
                }
                onRetry={refetch}
              />
            </div>
          )}

          {!isLoading && !isError && visible.length === 0 && (
            <div style={{ padding: "48px 28px", textAlign: "center", color: "var(--ink-3)", fontSize: 14 }}>
              Nenhuma campanha cadastrada{filter ? " neste filtro" : ""}.
            </div>
          )}

          {!isLoading && !isError && visible.length > 0 && (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "var(--bg)" }}>
                  {["Título", "Categoria", "Status", "Progresso", "Prazo", ""].map((h, i) => (
                    <th
                      key={h + i}
                      className="mono"
                      style={{
                        textAlign: "left",
                        padding: "10px 16px",
                        fontSize: 10,
                        letterSpacing: ".1em",
                        textTransform: "uppercase",
                        fontWeight: 600,
                        color: "var(--ink-3)",
                        borderBottom: "1px solid var(--line)",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((m, i) => {
                  const busy = update.isPending && update.variables?.id === m.id;
                  return (
                    <tr
                      key={m.id}
                      style={{
                        borderBottom:
                          i === visible.length - 1 ? "none" : "1px solid var(--line)",
                      }}
                    >
                      <td style={{ padding: "14px 16px", fontWeight: 600 }}>{m.titulo}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <span className="tag" style={{ fontSize: 10 }}>
                          {m.categoria?.nome || "—"}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span
                          className={m.ativa ? "tag tag-red tag-dot" : "tag"}
                          style={{ fontSize: 10 }}
                        >
                          {m.ativa ? "Ativa" : "Arquivada"}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div className="mono tnum" style={{ fontWeight: 600 }}>
                          {(m.progresso_pct ?? 0).toFixed(1)}%
                        </div>
                        <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>
                          {BRL2(Number(m.valor_atual || 0))} / {BRL2(Number(m.valor_alvo || 0))}
                        </div>
                      </td>
                      <td className="mono" style={{ padding: "14px 16px", color: "var(--ink-3)", fontSize: 12 }}>
                        {fmtDate(m.prazo)}
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "right" }}>
                        <button
                          className={m.ativa ? "btn btn-secondary btn-sm" : "btn btn-dark btn-sm"}
                          disabled={busy}
                          onClick={() => {
                            if (m.ativa && !confirm(`Arquivar "${m.titulo}"?`)) return;
                            toggle(m);
                          }}
                        >
                          {m.ativa ? "Arquivar" : "Reativar"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
