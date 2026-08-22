import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../../components/Icon.jsx";
import SEO from "../../components/SEO.jsx";
import {
  PH,
  Progress,
  LoadingState,
  ErrorState,
  EmptyState,
} from "../../components/Shared.jsx";
import { imagemDe, REGIAO_PADRAO } from "../../data/fotos.js";
import { BRL, PCT, diasRestantes } from "../../lib/format.js";
import { useCategorias, useMetas } from "../../hooks/useQueries.js";

export default function Projects() {
  const [categoria, setCategoria] = useState("");
  const [busca, setBusca] = useState("");
  const [prazoCurto, setPrazoCurto] = useState(false);

  const { data: metas, isLoading, isError, refetch } = useMetas({ ativa: true });
  const { data: categorias } = useCategorias();

  const lista = useMemo(() => {
    let resultado = metas || [];
    if (categoria) resultado = resultado.filter((m) => String(m.categoria?.id) === categoria);
    if (prazoCurto) {
      resultado = resultado.filter((m) => {
        const dias = diasRestantes(m.prazo);
        return dias !== null && dias >= 0 && dias <= 60;
      });
    }
    if (busca.trim()) {
      const termo = busca.trim().toLowerCase();
      resultado = resultado.filter(
        (m) =>
          m.titulo.toLowerCase().includes(termo) ||
          (m.descricao || "").toLowerCase().includes(termo)
      );
    }
    return resultado;
  }, [metas, categoria, prazoCurto, busca]);

  return (
    <div data-screen-label="Public — Projetos" className="fade-up">
      <SEO
        title="Projetos"
        description="Conheça os programas ativos da TPM com metas, indicadores de impacto e relatórios dedicados."
      />
      <section style={{ padding: "64px 0 32px", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <span className="eyebrow">Projetos</span>
          <h1 className="display" style={{ fontSize: "clamp(34px, 5vw, 72px)", margin: "18px 0 24px" }}>
            Onde sua doação chega.
          </h1>
          <p style={{ fontSize: 17, color: "var(--ink-2)", maxWidth: 620, margin: 0 }}>
            Programas com metas financeiras claras, indicadores de impacto e relatório dedicado.
          </p>
        </div>
      </section>

      <section style={{ padding: "32px 0 96px" }}>
        <div className="wrap">
          <div
            className="row gap-8"
            style={{
              padding: "16px 0 24px",
              borderBottom: "1px solid var(--line)",
              flexWrap: "wrap",
            }}
          >
            <button
              className={"btn btn-sm " + (!categoria && !prazoCurto ? "btn-dark" : "btn-ghost")}
              onClick={() => {
                setCategoria("");
                setPrazoCurto(false);
              }}
            >
              Todos
            </button>
            {(categorias || []).map((c) => (
              <button
                key={c.id}
                className={"btn btn-sm " + (categoria === String(c.id) ? "btn-dark" : "btn-ghost")}
                onClick={() => setCategoria(categoria === String(c.id) ? "" : String(c.id))}
              >
                {c.nome}
              </button>
            ))}
            <button
              className={"btn btn-sm " + (prazoCurto ? "btn-dark" : "btn-ghost")}
              onClick={() => setPrazoCurto((v) => !v)}
            >
              Próximas a vencer
            </button>

            <div className="spacer" />

            <div style={{ position: "relative", width: 240 }}>
              <Icon
                name="search"
                size={15}
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--ink-3)",
                }}
              />
              <input
                className="input"
                placeholder="Buscar projeto…"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                style={{ paddingLeft: 36 }}
                aria-label="Buscar projeto"
              />
            </div>
          </div>

          <div className="row" style={{ padding: "16px 0" }}>
            <span className="mono muted" style={{ fontSize: 12 }}>
              {lista.length} {lista.length === 1 ? "projeto" : "projetos"}
            </span>
          </div>

          {isLoading && <LoadingState label="Carregando projetos…" />}
          {isError && <ErrorState onRetry={refetch} />}

          {!isLoading && !isError && lista.length === 0 && (
            <EmptyState
              title="Nenhum projeto encontrado"
              description="Ajuste os filtros ou volte mais tarde — novas campanhas entram no ar com frequência."
            />
          )}

          {!isLoading && !isError && lista.length > 0 && (
            <div style={{ display: "grid", gap: 0 }}>
              {lista.map((m) => {
                const arrecadado = Number(m.valor_atual || 0);
                const meta = Number(m.valor_alvo || 0);
                const dias = diasRestantes(m.prazo);
                return (
                  <article key={m.id} className="projeto-linha">
                    <Link to={`/projetos/${m.id}`}>
                      <PH label={m.titulo} src={imagemDe(m)} ratio="4/3" />
                    </Link>
                    <div>
                      <div className="row gap-8" style={{ marginBottom: 10, flexWrap: "wrap" }}>
                        {m.categoria?.nome && <span className="tag">{m.categoria.nome}</span>}
                        <span className="tag mono">{m.regiao || REGIAO_PADRAO}</span>
                        {dias !== null && dias >= 0 && dias <= 60 && (
                          <span className="tag tag-red">
                            <Icon name="calendar" size={11} /> {dias} dias
                          </span>
                        )}
                      </div>
                      <h3 className="display" style={{ fontSize: 26, margin: "4px 0 10px" }}>
                        <Link to={`/projetos/${m.id}`}>{m.titulo}</Link>
                      </h3>
                      <p style={{ color: "var(--ink-3)", margin: 0, fontSize: 15, maxWidth: 520 }}>
                        {m.descricao || m.categoria?.nome}
                      </p>
                    </div>
                    <div>
                      <div
                        className="row"
                        style={{ justifyContent: "space-between", marginBottom: 8 }}
                      >
                        <span className="mono tnum" style={{ fontWeight: 600 }}>
                          {BRL(arrecadado)}
                        </span>
                        <span className="mono muted" style={{ fontSize: 12 }}>
                          {meta > 0 ? PCT(m.progresso_pct) : "meta aberta"}
                        </span>
                      </div>
                      <Progress
                        value={arrecadado}
                        max={meta || 1}
                        label={`Progresso de ${m.titulo}`}
                      />
                      <Link
                        to={`/doar?projeto=${m.id}`}
                        className="btn btn-primary btn-sm"
                        style={{ marginTop: 16, width: "100%" }}
                      >
                        Apoiar este projeto
                      </Link>
                      <Link
                        to={`/projetos/${m.id}`}
                        className="btn btn-ghost btn-sm"
                        style={{ marginTop: 8, width: "100%" }}
                      >
                        Ver detalhes <Icon name="arrow" size={13} />
                      </Link>
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
