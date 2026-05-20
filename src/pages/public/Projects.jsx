import { useState } from "react";
import { PH, Progress } from "../../components/Shared.jsx";
import SEO from "../../components/SEO.jsx";
import { TPM_PROJECTS } from "../../data/mock.js";

export default function Projects() {
  const [filter, setFilter] = useState("Todos");
  const filters = ["Todos", "Em breve"];
  const list = TPM_PROJECTS.filter((p) => {
    if (filter === "Todos") return true;
    if (filter === "Em breve") return p.status === "Em breve";
    return true;
  });

  return (
    <div data-screen-label="Public — Projetos" className="fade-up">
      <SEO title="Projetos" description="Conheça os programas ativos da TPM com metas, indicadores de impacto e relatórios dedicados." />
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
            {filters.map((f) => (
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
              {list.length} projetos
            </span>
          </div>

          <div style={{ display: "grid", gap: 0 }}>
            {list.map((p) => (
              <article
                key={p.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "220px 1fr 280px",
                  gap: 32,
                  padding: "32px 0",
                  borderBottom: "1px solid var(--line)",
                  alignItems: "center",
                }}
              >
                <PH label={p.title} src={p.image} ratio="4/3" />
                <div>
                  <div className="row gap-8" style={{ marginBottom: 10 }}>
                    {p.status === "Em breve" && <span className="tag">{p.status}</span>}
                    <span className="tag mono">{p.region}</span>
                  </div>
                  <h3 className="display" style={{ fontSize: 28, margin: "4px 0 10px" }}>
                    {p.title}
                  </h3>
                  <p style={{ color: "var(--ink-3)", margin: 0, fontSize: 15, maxWidth: 520 }}>{p.focus}</p>
                </div>
                <div>
                  <Progress value={p.raised} max={p.goal} />
                  <button className="btn btn-primary btn-sm" style={{ marginTop: 16, width: "100%" }}>
                    Apoiar este projeto
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
