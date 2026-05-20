import { useNavigate } from "react-router-dom";
import Icon from "../../components/Icon.jsx";
import SEO from "../../components/SEO.jsx";
import { PH, WaveLine, Progress, StatBlock } from "../../components/Shared.jsx";
import { TPM_PROJECTS } from "../../data/mock.js";
import { useTheme } from "../../hooks/useTheme.jsx";

export default function Home() {
  const navigate = useNavigate();
  const { variant } = useTheme();

  return (
    <div data-screen-label="Public — Home" className="fade-up">
      <SEO title="Início" />
      {/* HERO */}
      <section style={{ padding: "64px 0 32px", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 64, alignItems: "end" }}>
            <div>
              <div className="row gap-8" style={{ marginBottom: 28 }}>
                <WaveLine />
              </div>
              <h1 className="display" style={{ fontSize: "clamp(48px, 5.8vw, 86px)", margin: "0 0 28px" }}>
                Surf como ferramenta,
                <br />
                <em style={{ color: "var(--red)", fontStyle: variant === "editorial" ? "italic" : "normal" }}>
                  justiça social como destino.
                </em>
              </h1>
              <p style={{ fontSize: 18, lineHeight: 1.55, color: "var(--ink-2)", maxWidth: 560, margin: 0 }}>
                A TPM <strong style={{ color: "var(--ink)" }}>(Todas Para o Mar)</strong> é uma
                organização feminista e antirracista que empodera mulheres negras e seus filhos no
                Litoral Sul de Pernambuco através da democratização do surf e de práticas
                socioeducativas.
              </p>
              <div className="row gap-12" style={{ marginTop: 36 }}>
                <button className="btn btn-primary btn-lg" onClick={() => navigate("/doar")}>
                  <Icon name="heart" size={16} /> Fazer uma doação
                </button>
                <button className="btn btn-secondary btn-lg" onClick={() => navigate("/sobre")}>
                  Como funciona
                </button>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 1,
                background: "var(--line)",
                border: "1px solid var(--line)",
                borderRadius: "var(--r-card)",
                overflow: "hidden",
              }}
            >
              {[
                { v: "—", l: "Arrecadado", s: "Atualizado em tempo real" },
                { v: "—", l: "Doadores ativos", s: "Pessoas e empresas" },
                { v: "—", l: "Mulheres negras impactadas", s: "Na Baía de Maracaípe e arredores" },
                { v: "—", l: "Crianças e adolescentes no surf", s: "Aulas gratuitas desde 2016" },
              ].map((s, i) => (
                <div key={i} style={{ background: "var(--bg-1)", padding: "26px 22px" }}>
                  <StatBlock value={s.v} label={s.l} sub={s.s} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MISSION BAR */}
      <section style={{ padding: "56px 0", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 64, alignItems: "start" }}>
            <span className="eyebrow">Missão</span>
            <p
              className="display"
              style={{ fontSize: "clamp(24px, 2.4vw, 36px)", margin: 0, color: "var(--ink)", lineHeight: 1.25 }}
            >
              Transformar a realidade social de mulheres negras e seus filhos por meio da
              democratização do surf e de práticas socioeducativas e culturais — garantindo que{" "}
              <span style={{ color: "var(--red)" }}>cada real doado</span> seja rastreável até o
              projeto que financia.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section style={{ padding: "72px 0" }}>
        <div className="wrap">
          <div className="row" style={{ justifyContent: "space-between", alignItems: "end", marginBottom: 32 }}>
            <div>
              <span className="eyebrow">Em destaque</span>
              <h2 className="display" style={{ fontSize: "clamp(28px, 3vw, 44px)", margin: "10px 0 0" }}>
                Projetos ativos
              </h2>
            </div>
            <button className="btn btn-ghost" onClick={() => navigate("/projetos")}>
              Ver todos <Icon name="arrow" size={15} />
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {TPM_PROJECTS.filter((p) => p.status !== "Em breve")
              .slice(0, 3)
              .map((p) => (
                <article key={p.id} className="card" style={{ display: "flex", flexDirection: "column" }}>
                  <PH label={"foto — " + p.title} src={p.image} ratio="16/10" style={{ borderRadius: 0, border: 0 }} />
                  <div style={{ padding: 22, flex: 1, display: "flex", flexDirection: "column" }}>
                    <div className="row gap-8" style={{ marginBottom: 10 }}>
                      <span className="tag mono">{p.region}</span>
                    </div>
                    <h3 className="display" style={{ fontSize: 22, margin: "6px 0 8px" }}>
                      {p.title}
                    </h3>
                    <p style={{ color: "var(--ink-3)", fontSize: 14, margin: 0, lineHeight: 1.5 }}>{p.focus}</p>

                    <div style={{ marginTop: 22 }}>
                      <Progress value={p.raised} max={p.goal} />
                    </div>
                  </div>
                </article>
              ))}
          </div>
        </div>
      </section>

      {/* TRANSPARENCY STRIP */}
      <section style={{ padding: "16px 0 96px" }}>
        <div className="wrap">
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 280 }}>
              <div style={{ padding: "44px 48px", borderRight: "1px solid var(--line)" }}>
                <span className="eyebrow">Transparência ativa</span>
                <h3 className="display" style={{ fontSize: 32, margin: "14px 0 16px" }}>
                  Cada doação tem rastro.
                </h3>
                <p style={{ color: "var(--ink-2)", margin: "0 0 24px", maxWidth: 460 }}>
                  Publicamos relatórios trimestrais auditados, extratos bancários e a alocação exata de
                  cada centavo recebido. Doadores acompanham pelo painel.
                </p>
                <div className="row gap-12">
                  <button className="btn btn-dark" onClick={() => navigate("/sobre")}>
                    <Icon name="file" size={15} /> Ver último relatório
                  </button>
                  <button className="btn btn-ghost" onClick={() => navigate("/noticias")}>
                    Auditorias <Icon name="arrow" size={14} />
                  </button>
                </div>
              </div>
              <div
                style={{
                  padding: "44px 48px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 32,
                  background: "var(--bg)",
                }}
              >
                {[
                  { v: "—", l: "Aplicado em projetos", s: "Custos operacionais" },
                  { v: "—", l: "Em despesas com marketing", s: "Doadores chegam por indicação" },
                  { v: "Trimestral", l: "Frequência dos relatórios", s: "Auditoria independente" },
                  { v: "—", l: "Tempo até alocação", s: "Da doação ao projeto" },
                ].map((s, i) => (
                  <StatBlock key={i} value={s.v} label={s.l} sub={s.s} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
