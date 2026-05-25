import { useMemo, useState } from "react";
import { PH, Progress, LoadingState, ErrorState } from "../../components/Shared.jsx";
import SEO from "../../components/SEO.jsx";
import { useMetas } from "../../hooks/useQueries.js";
import { PHOTO_BY_ID, PROJECT_REGION } from "../../data/mock.js";

const FILTERS = ["Todos", "Próximas a vencer"];

function isUpcoming(prazo) {
  if (!prazo) return false;
  const days = (new Date(prazo) - Date.now()) / (1000 * 60 * 60 * 24);
  return days >= 0 && days <= 60;
}

export default function Projects() {
  const [filter, setFilter] = useState("Todos");
  const { data: metas, isLoading, isError, refetch } = useMetas();

  const ativas = useMemo(
    () => (metas || []).filter((m) => m.ativa),
    [metas]
  );

  const list = useMemo(() => {
    if (filter === "Próximas a vencer") return ativas.filter((m) => isUpcoming(m.prazo));
    return ativas;
  }, [ativas, filter]);

  return (
    <div data-screen-label="Public — Projetos" className="fade-up">
      <SEO
        title="Projetos"
        description="Conheça os programas ativos da TPM com metas, indicadores de impacto e relatórios dedicados."
      />
      <section style={{ padding: "64px 0 32px", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <span className="eyebrow">Projetos</span>
          <h1 className="display" style={{ fontSize: "clamp(40px, 5vw, 72px)", margin: "18px 0 24px" }}>
            Onde sua doação chega.
          </h1>
          <p style={{ fontSize: 17, color: "var(--ink-2)", maxWidth: 620, margin: 0 }}>
            Programas com metas financeiras claras, indicadores de impacto e relatório dedicado.
          </p>
        </div>
      </section>

      <section style={{ padding: "32px 0 96px" }}>
        <div className="wrap">
          <div className="row gap-8" style={{ padding: "16px 0 24px", borderBottom: "1px solid var(--line)" }}>
            {FILTERS.map((f) => (
              <button
                key={f}
                className={"btn btn-sm " + (filter === f ? "btn-dark" : "btn-ghost")}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
            <div className="spacer" />
            <span className="mono muted" style={{ fontSize: 12 }}>
              {list.length} {list.length === 1 ? "projeto" : "projetos"}
            </span>
          </div>

          {isLoading && <LoadingState label="Carregando projetos…" />}
          {isError && <ErrorState onRetry={refetch} />}

          {!isLoading && !isError && list.length === 0 && (
            <div style={{ padding: "64px 0", textAlign: "center", color: "var(--ink-3)" }}>
              Nenhum projeto ativo no momento.
            </div>
          )}

          {!isLoading && !isError && list.length > 0 && (
            <div style={{ display: "grid", gap: 0 }}>
              {list.map((m) => {
                const titulo = m.titulo;
                const focus = m.descricao || m.categoria?.nome || "";
                const region = PROJECT_REGION[titulo] || "Ipojuca · PE";
                const image = m.imagem || PHOTO_BY_ID[titulo];
                const raised = Number(m.valor_atual || 0);
                const goal = Number(m.valor_alvo || 0);
                return (
                  <article
                    key={m.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "220px 1fr 280px",
                      gap: 32,
                      padding: "32px 0",
                      borderBottom: "1px solid var(--line)",
                      alignItems: "center",
                    }}
                  >
                    <PH label={titulo} src={image} ratio="4/3" />
                    <div>
                      <div className="row gap-8" style={{ marginBottom: 10 }}>
                        {m.categoria?.nome && (
                          <span className="tag">{m.categoria.nome}</span>
                        )}
                        <span className="tag mono">{region}</span>
                      </div>
                      <h3 className="display" style={{ fontSize: 28, margin: "4px 0 10px" }}>
                        {titulo}
                      </h3>
                      <p style={{ color: "var(--ink-3)", margin: 0, fontSize: 15, maxWidth: 520 }}>
                        {focus}
                      </p>
                    </div>
                    <div>
                      <Progress value={raised} max={goal || 1} />
                      <button className="btn btn-primary btn-sm" style={{ marginTop: 16, width: "100%" }}>
                        Apoiar este projeto
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
