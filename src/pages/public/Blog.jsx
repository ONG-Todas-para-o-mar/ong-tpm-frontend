import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../../components/Icon.jsx";
import SEO from "../../components/SEO.jsx";
import {
  PH,
  LoadingState,
  ErrorState,
  EmptyState,
} from "../../components/Shared.jsx";
import { imagemDe } from "../../data/fotos.js";
import { dataBR } from "../../lib/format.js";
import { useNoticias } from "../../hooks/useQueries.js";

const CATEGORIAS = [
  { id: "", label: "Todas" },
  { id: "transparencia", label: "Transparência" },
  { id: "projeto", label: "Projeto" },
  { id: "formacao", label: "Formação" },
  { id: "parceria", label: "Parceria" },
  { id: "evento", label: "Evento" },
];

export default function Blog() {
  const [categoria, setCategoria] = useState("");
  const { data, isLoading, isError, refetch } = useNoticias({
    publicada: true,
    categoria: categoria || undefined,
  });

  const noticias = useMemo(() => data || [], [data]);
  const destaque = noticias.find((n) => n.destaque) || noticias[0];
  const restantes = noticias.filter((n) => n.id !== destaque?.id);

  return (
    <div data-screen-label="Public — Notícias" className="fade-up">
      <SEO
        title="Notícias"
        description="Atualizações, relatórios e bastidores dos projetos da TPM."
      />
      <section style={{ padding: "64px 0 32px", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <span className="eyebrow">Notícias e transparência</span>
          <h1 className="display" style={{ fontSize: "clamp(34px, 5vw, 72px)", margin: "18px 0 0" }}>
            Atualizações, relatórios e bastidores.
          </h1>
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
            {CATEGORIAS.map((c) => (
              <button
                key={c.id || "todas"}
                className={"btn btn-sm " + (categoria === c.id ? "btn-dark" : "btn-ghost")}
                onClick={() => setCategoria(c.id)}
              >
                {c.label}
              </button>
            ))}
            <div className="spacer" />
            <span className="mono muted" style={{ fontSize: 12 }}>
              {noticias.length} {noticias.length === 1 ? "publicação" : "publicações"}
            </span>
          </div>

          {isLoading && <LoadingState label="Carregando notícias…" />}
          {isError && <ErrorState onRetry={refetch} />}

          {!isLoading && !isError && noticias.length === 0 && (
            <EmptyState
              title="Nenhuma publicação nesta categoria"
              description="Assim que a equipe publicar novidades, elas aparecem aqui."
            />
          )}

          {destaque && (
            <article
              className="split"
              style={{
                gap: 56,
                alignItems: "center",
                padding: "40px 0 48px",
                borderBottom: restantes.length ? "1px solid var(--line)" : "none",
              }}
            >
              <Link to={`/noticias/${destaque.slug}`}>
                <PH
                  label={destaque.titulo}
                  src={imagemDe({ imagem: destaque.imagem, titulo: destaque.slug })}
                  ratio="4/3"
                />
              </Link>
              <div>
                <div className="row gap-8" style={{ marginBottom: 14, flexWrap: "wrap" }}>
                  <span className="tag tag-red">{destaque.categoria_display}</span>
                  <span className="mono muted" style={{ fontSize: 12 }}>
                    {dataBR(destaque.publicada_em)}
                  </span>
                </div>
                <h2
                  className="display"
                  style={{ fontSize: "clamp(26px, 3vw, 40px)", margin: "0 0 16px", lineHeight: 1.15 }}
                >
                  <Link to={`/noticias/${destaque.slug}`}>{destaque.titulo}</Link>
                </h2>
                <p
                  style={{
                    color: "var(--ink-2)",
                    fontSize: 16,
                    margin: 0,
                    lineHeight: 1.6,
                    maxWidth: 520,
                  }}
                >
                  {destaque.resumo}
                </p>
                <Link
                  to={`/noticias/${destaque.slug}`}
                  className="btn btn-secondary"
                  style={{ marginTop: 24 }}
                >
                  Ler matéria completa <Icon name="arrow" size={14} />
                </Link>
              </div>
            </article>
          )}

          {restantes.length > 0 && (
            <div className="g3" style={{ marginTop: 48, gap: 32 }}>
              {restantes.map((n) => (
                <article key={n.id}>
                  <Link to={`/noticias/${n.slug}`}>
                    <PH
                      label={n.titulo}
                      src={imagemDe({ imagem: n.imagem, titulo: n.slug })}
                      ratio="4/3"
                    />
                  </Link>
                  <div className="row gap-8" style={{ marginTop: 18, flexWrap: "wrap" }}>
                    <span className="tag">{n.categoria_display}</span>
                    <span className="mono muted" style={{ fontSize: 12 }}>
                      {dataBR(n.publicada_em)}
                    </span>
                  </div>
                  <h3
                    className="display"
                    style={{ fontSize: 21, margin: "10px 0 8px", lineHeight: 1.25 }}
                  >
                    <Link to={`/noticias/${n.slug}`}>{n.titulo}</Link>
                  </h3>
                  <p style={{ color: "var(--ink-3)", fontSize: 14, margin: 0, lineHeight: 1.55 }}>
                    {n.resumo}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
