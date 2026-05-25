import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Icon from "../../components/Icon.jsx";
import { AdminLayout } from "../../components/Charts.jsx";
import { LoadingState, ErrorState, Spinner } from "../../components/Shared.jsx";
import { BRL2 } from "../../lib/format.js";
import {
  useCampaigns,
  useCreateCampaign,
  useArchiveCampaign,
  useReactivateCampaign,
} from "../../hooks/useQueries.js";

const schema = z.object({
  title: z.string().min(3, "Mínimo 3 caracteres"),
  description: z.string().min(10, "Mínimo 10 caracteres"),
  target_amount: z.coerce.number().positive("Valor precisa ser maior que zero"),
  deadline: z.string().min(1, "Defina um prazo"),
  campaign_type: z.enum(["avulsa", "recorrente", "emergencial"]),
  submetas: z.array(
    z.object({
      title: z.string().min(1, "Título obrigatório"),
      target_amount: z.coerce.number().positive("Valor inválido"),
    })
  ),
});

const TYPE_LABEL = {
  avulsa: "Avulsa",
  recorrente: "Recorrente",
  emergencial: "Emergencial",
};

const STATUS_LABEL = {
  active: "Ativa",
  archived: "Arquivada",
  completed: "Concluída",
};

const STATUS_TAG = {
  active: "tag tag-red tag-dot",
  archived: "tag",
  completed: "tag",
};

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("pt-BR");
}

export default function AdminCampaigns() {
  const [filter, setFilter] = useState("");
  const [submitError, setSubmitError] = useState(null);

  const { data: campaigns, isLoading, isError, refetch } = useCampaigns(filter || undefined);
  const create = useCreateCampaign();
  const archive = useArchiveCampaign();
  const reactivate = useReactivateCampaign();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      target_amount: "",
      deadline: "",
      campaign_type: "avulsa",
      submetas: [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "submetas" });

  const onSubmit = async (data) => {
    setSubmitError(null);
    try {
      await create.mutateAsync({
        ...data,
        deadline: new Date(data.deadline).toISOString(),
      });
      reset();
    } catch (err) {
      setSubmitError(
        err.response?.data?.detail || err.message || "Falha ao salvar a campanha."
      );
    }
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
            Cadastre, arquive e gerencie as campanhas da ONG.
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
            <option value="active">Ativas</option>
            <option value="archived">Arquivadas</option>
            <option value="completed">Concluídas</option>
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
              <label className="label" htmlFor="title">Título</label>
              <input
                id="title"
                className={"input" + (errors.title ? " error" : "")}
                placeholder="Mutirão Praia de Maracaípe"
                {...register("title")}
              />
              {errors.title && <div className="field-error">{errors.title.message}</div>}
            </div>

            <div>
              <label className="label" htmlFor="description">Descrição</label>
              <textarea
                id="description"
                className={"input" + (errors.description ? " error" : "")}
                rows={3}
                placeholder="O que essa campanha faz e quem ela beneficia"
                {...register("description")}
              />
              {errors.description && (
                <div className="field-error">{errors.description.message}</div>
              )}
            </div>

            <div className="row gap-12">
              <div style={{ flex: 1 }}>
                <label className="label" htmlFor="target_amount">Valor-alvo (R$)</label>
                <input
                  id="target_amount"
                  type="number"
                  step="0.01"
                  min="1"
                  className={"input" + (errors.target_amount ? " error" : "")}
                  {...register("target_amount")}
                />
                {errors.target_amount && (
                  <div className="field-error">{errors.target_amount.message}</div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <label className="label" htmlFor="deadline">Prazo</label>
                <input
                  id="deadline"
                  type="datetime-local"
                  className={"input" + (errors.deadline ? " error" : "")}
                  {...register("deadline")}
                />
                {errors.deadline && (
                  <div className="field-error">{errors.deadline.message}</div>
                )}
              </div>
            </div>

            <div>
              <label className="label" htmlFor="campaign_type">Tipo</label>
              <select
                id="campaign_type"
                className="input"
                {...register("campaign_type")}
              >
                <option value="avulsa">Avulsa</option>
                <option value="recorrente">Recorrente (mínimo 30 dias)</option>
                <option value="emergencial">Emergencial (máximo 60 dias)</option>
              </select>
            </div>

            <div>
              <div className="row" style={{ justifyContent: "space-between", marginBottom: 8 }}>
                <span className="label" style={{ margin: 0 }}>Submetas</span>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => append({ title: "", target_amount: "" })}
                >
                  <Icon name="plus" size={13} /> Adicionar
                </button>
              </div>
              <div className="col gap-8">
                {fields.length === 0 && (
                  <div style={{ fontSize: 12, color: "var(--ink-3)" }}>
                    Opcional. Divida a meta em etapas (ex.: por mês de mutirão).
                  </div>
                )}
                {fields.map((f, i) => (
                  <div key={f.id} className="row gap-8">
                    <input
                      className="input"
                      placeholder="Título"
                      {...register(`submetas.${i}.title`)}
                      style={{ flex: 2 }}
                    />
                    <input
                      className="input"
                      type="number"
                      step="0.01"
                      placeholder="Valor"
                      {...register(`submetas.${i}.target_amount`)}
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => remove(i)}
                      aria-label="Remover submeta"
                    >
                      ×
                    </button>
                  </div>
                ))}
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
              {campaigns?.length ?? 0} no total
            </span>
          </div>

          {isLoading && <LoadingState label="Carregando campanhas…" />}
          {isError && <ErrorState onRetry={refetch} />}

          {!isLoading && !isError && campaigns?.length === 0 && (
            <div style={{ padding: "48px 28px", textAlign: "center", color: "var(--ink-3)", fontSize: 14 }}>
              Nenhuma campanha cadastrada ainda.
            </div>
          )}

          {!isLoading && !isError && campaigns?.length > 0 && (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "var(--bg)" }}>
                  {["Título", "Tipo", "Status", "Progresso", "Prazo", ""].map((h, i) => (
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
                {campaigns.map((c, i) => {
                  const busy =
                    (archive.isPending && archive.variables === c.id) ||
                    (reactivate.isPending && reactivate.variables === c.id);
                  return (
                    <tr
                      key={c.id}
                      style={{
                        borderBottom:
                          i === campaigns.length - 1 ? "none" : "1px solid var(--line)",
                      }}
                    >
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ fontWeight: 600 }}>{c.title}</div>
                        <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>
                          {c.submetas?.length || 0} submeta(s)
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span className="tag" style={{ fontSize: 10 }}>
                          {TYPE_LABEL[c.campaign_type]}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span className={STATUS_TAG[c.status] || "tag"} style={{ fontSize: 10 }}>
                          {STATUS_LABEL[c.status] || c.status}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div className="mono tnum" style={{ fontWeight: 600 }}>
                          {c.progress_pct?.toFixed(1)}%
                        </div>
                        <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>
                          {BRL2(c.current_amount)} / {BRL2(c.target_amount)}
                        </div>
                      </td>
                      <td className="mono" style={{ padding: "14px 16px", color: "var(--ink-3)", fontSize: 12 }}>
                        {fmtDate(c.deadline)}
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "right" }}>
                        {c.status === "active" ? (
                          <button
                            className="btn btn-secondary btn-sm"
                            disabled={busy}
                            onClick={() => {
                              if (confirm(`Arquivar "${c.title}"?`)) {
                                archive.mutate(c.id);
                              }
                            }}
                          >
                            Arquivar
                          </button>
                        ) : (
                          <button
                            className="btn btn-dark btn-sm"
                            disabled={busy}
                            onClick={() => reactivate.mutate(c.id)}
                          >
                            Reativar
                          </button>
                        )}
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
