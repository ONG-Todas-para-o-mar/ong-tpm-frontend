import { useState } from "react";
import Icon from "../../components/Icon.jsx";
import SEO from "../../components/SEO.jsx";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  WaveLine,
} from "../../components/Shared.jsx";
import { usePostsInstagram } from "../../hooks/useQueries.js";

const PERFIL = "tpmtodasparaomar";
const PERFIL_URL = `https://www.instagram.com/${PERFIL}/`;
const LOTE = 6;

export default function Feed() {
  const { data, isLoading, isError, refetch } = usePostsInstagram();
  const [visiveis, setVisiveis] = useState(LOTE);

  const posts = data || [];
  const lista = posts.slice(0, visiveis);

  return (
    <div data-screen-label="Public — Fique por dentro" className="fade-up">
      <SEO
        title="Fique por dentro"
        description="Os últimos posts da Todas Para o Mar no Instagram: bastidores das aulas, formações e ações na Baía de Maracaípe."
      />

      <section style={{ padding: "64px 0 32px", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <div className="row gap-8" style={{ marginBottom: 24, maxWidth: 320 }}>
            <WaveLine />
          </div>
          <span className="eyebrow">Fique por dentro</span>
          <h1 className="display" style={{ fontSize: "clamp(34px, 5vw, 72px)", margin: "18px 0 24px" }}>
            O dia a dia da TPM.
          </h1>
          <div
            className="row"
            style={{ justifyContent: "space-between", alignItems: "flex-end", gap: 24, flexWrap: "wrap" }}
          >
            <p style={{ fontSize: 17, color: "var(--ink-2)", maxWidth: 620, margin: 0 }}>
              Bastidores das aulas de sábado, formações, mutirões e o que mais acontece na Baía de
              Maracaípe — direto do nosso Instagram.
            </p>
            <a
              href={PERFIL_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="btn btn-primary"
            >
              <Icon name="instagram" size={16} /> Seguir @{PERFIL}
            </a>
          </div>
        </div>
      </section>

      <section style={{ padding: "40px 0 96px" }}>
        <div className="wrap">
          {isLoading && <LoadingState label="Carregando publicações…" />}
          {isError && <ErrorState onRetry={refetch} />}

          {!isLoading && !isError && posts.length === 0 && (
            <EmptyState
              title="Nenhuma publicação cadastrada"
              description="A equipe escolhe no painel quais posts do Instagram aparecem aqui."
              action={
                <a
                  href={PERFIL_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn btn-primary btn-sm"
                >
                  <Icon name="instagram" size={14} /> Ir para o Instagram
                </a>
              }
            />
          )}

          {lista.length > 0 && (
            <div className="g3" style={{ gap: 24 }}>
              {lista.map((post) => (
                <figure key={post.id} className="post-instagram">
                  <iframe
                    src={post.embed_url}
                    title={post.legenda || `Publicação ${post.codigo} no Instagram`}
                    loading="lazy"
                    scrolling="no"
                  />
                  {post.legenda && (
                    <figcaption
                      style={{
                        fontSize: 13,
                        color: "var(--ink-3)",
                        lineHeight: 1.55,
                        padding: "12px 4px 0",
                      }}
                    >
                      {post.legenda}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}

          {posts.length > visiveis && (
            <div style={{ textAlign: "center", marginTop: 32 }}>
              <button
                className="btn btn-secondary"
                onClick={() => setVisiveis((n) => n + LOTE)}
              >
                Ver mais publicações <Icon name="chevronDown" size={14} />
              </button>
            </div>
          )}

          <div
            className="card"
            style={{
              padding: 28,
              marginTop: 48,
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 32,
              alignItems: "center",
            }}
          >
            <div>
              <span className="eyebrow">Acompanhe de perto</span>
              <h2 className="display" style={{ fontSize: 24, margin: "10px 0 8px" }}>
                Tem muito mais no Instagram.
              </h2>
              <p style={{ color: "var(--ink-2)", margin: 0, fontSize: 14, maxWidth: 600 }}>
                Os stories mostram as aulas acontecendo em tempo real e é por lá que abrimos as
                inscrições das formações.
              </p>
            </div>
            <a
              href={PERFIL_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="btn btn-primary"
            >
              <Icon name="instagram" size={16} /> Seguir
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
