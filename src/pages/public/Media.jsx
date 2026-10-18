import { useMemo, useState } from "react";
import Icon from "../../components/Icon.jsx";
import SEO from "../../components/SEO.jsx";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  WaveLine,
} from "../../components/Shared.jsx";
import { dataBR } from "../../lib/format.js";
import { useVideos } from "../../hooks/useQueries.js";
import { IMPRENSA } from "../../data/imprensa.js";

// "2022-08-26" -> "26/08/2022" sem passar por Date: new Date() leria meia-noite
// UTC e, no horário de Brasília, a matéria apareceria com a data do dia anterior.
const dataDaMateria = (iso) => iso.split("-").reverse().join("/");

// O iframe do YouTube só entra depois do clique: seis players carregados de uma
// vez deixam a página lenta e já plantam cookies antes de a pessoa pedir vídeo.
function CardVideo({ video }) {
  const [tocando, setTocando] = useState(false);

  return (
    <article className="card video-card">
      <div className="video-frame">
        {tocando ? (
          <iframe
            src={`${video.embed_url}?autoplay=1&rel=0`}
            title={video.titulo}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <button
            type="button"
            className="video-capa"
            onClick={() => setTocando(true)}
            aria-label={`Assistir: ${video.titulo}`}
          >
            <img src={video.thumbnail} alt="" loading="lazy" />
            <span className="video-play" aria-hidden>
              <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
      </div>

      <div style={{ padding: 20 }}>
        <div className="row gap-8" style={{ marginBottom: 10, flexWrap: "wrap" }}>
          {video.veiculo && <span className="tag tag-red">{video.veiculo}</span>}
          {video.publicado_em && (
            <span className="mono muted" style={{ fontSize: 12 }}>
              {dataBR(video.publicado_em)}
            </span>
          )}
        </div>
        <h2 className="display" style={{ fontSize: 18, margin: "0 0 8px", lineHeight: 1.3 }}>
          {video.titulo}
        </h2>
        {video.descricao && (
          <p style={{ color: "var(--ink-3)", fontSize: 14, margin: "0 0 12px", lineHeight: 1.55 }}>
            {video.descricao}
          </p>
        )}
        <a
          href={video.url}
          target="_blank"
          rel="noreferrer noopener"
          className="mono"
          style={{
            fontSize: 11,
            color: "var(--red)",
            letterSpacing: ".08em",
            textTransform: "uppercase",
            display: "inline-flex",
            gap: 6,
            alignItems: "center",
          }}
        >
          Ver no YouTube <Icon name="arrow" size={13} />
        </a>
      </div>
    </article>
  );
}

export default function Media() {
  const { data, isLoading, isError, refetch } = useVideos();
  const [veiculo, setVeiculo] = useState("");

  const videos = useMemo(() => data || [], [data]);

  const veiculos = useMemo(
    () => [...new Set(videos.map((v) => v.veiculo).filter(Boolean))].sort(),
    [videos]
  );

  const lista = veiculo ? videos.filter((v) => v.veiculo === veiculo) : videos;

  return (
    <div data-screen-label="Public — TPM na Mídia" className="fade-up">
      <SEO
        title="TPM na Mídia"
        description="Reportagens e documentários sobre a Todas Para o Mar na imprensa e nos canais de surf."
      />

      <section style={{ padding: "64px 0 32px", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <div className="row gap-8" style={{ marginBottom: 24, maxWidth: 320 }}>
            <WaveLine />
          </div>
          <span className="eyebrow">TPM na Mídia</span>
          <h1 className="display" style={{ fontSize: "clamp(34px, 5vw, 72px)", margin: "18px 0 24px" }}>
            O que contaram sobre a gente.
          </h1>
          <p style={{ fontSize: 17, color: "var(--ink-2)", maxWidth: 660, margin: 0 }}>
            Reportagens, entrevistas e documentários produzidos por veículos de imprensa e canais de
            surf sobre a Baía de Maracaípe e o trabalho da TPM.
          </p>
        </div>
      </section>

      <section style={{ padding: "32px 0 96px" }}>
        <div className="wrap">
          {veiculos.length > 1 && (
            <div
              className="row gap-8"
              style={{
                padding: "16px 0 24px",
                borderBottom: "1px solid var(--line)",
                flexWrap: "wrap",
              }}
            >
              <button
                className={"btn btn-sm " + (veiculo === "" ? "btn-dark" : "btn-ghost")}
                onClick={() => setVeiculo("")}
              >
                Todos
              </button>
              {veiculos.map((v) => (
                <button
                  key={v}
                  className={"btn btn-sm " + (veiculo === v ? "btn-dark" : "btn-ghost")}
                  onClick={() => setVeiculo(v)}
                >
                  {v}
                </button>
              ))}
              <div className="spacer" />
              <span className="mono muted" style={{ fontSize: 12 }}>
                {lista.length} {lista.length === 1 ? "vídeo" : "vídeos"}
              </span>
            </div>
          )}

          {isLoading && <LoadingState label="Carregando vídeos…" />}
          {isError && <ErrorState onRetry={refetch} />}

          {!isLoading && !isError && lista.length === 0 && (
            <EmptyState
              title="Nenhum vídeo publicado ainda"
              description="A equipe cadastra aqui as reportagens e entrevistas sobre a ONG."
            />
          )}

          {lista.length > 0 && (
            <div className="g3" style={{ marginTop: 32, gap: 24 }}>
              {lista.map((v) => (
                <CardVideo key={v.id} video={v} />
              ))}
            </div>
          )}
        </div>
      </section>

      {IMPRENSA.length > 0 && (
        <section style={{ padding: "0 0 96px" }}>
          <div className="wrap">
            <span className="eyebrow">Na imprensa</span>
            <h2 className="display" style={{ fontSize: "clamp(24px, 2.6vw, 36px)", margin: "10px 0 24px" }}>
              Matérias e reportagens
            </h2>
            <div style={{ borderTop: "1px solid var(--line)" }}>
              {IMPRENSA.map((m) => (
                <a
                  key={m.url}
                  href={m.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  style={{ display: "block", padding: "22px 0", borderBottom: "1px solid var(--line)" }}
                >
                  <div className="row gap-8" style={{ marginBottom: 8, flexWrap: "wrap" }}>
                    <span className="tag tag-red">{m.veiculo}</span>
                    <span className="mono muted" style={{ fontSize: 12 }}>
                      {dataDaMateria(m.data)}
                    </span>
                  </div>
                  <h3 className="display" style={{ fontSize: 20, margin: "0 0 6px", lineHeight: 1.3 }}>
                    {m.titulo} <Icon name="arrow" size={15} />
                  </h3>
                  <p style={{ color: "var(--ink-3)", fontSize: 14, margin: 0, lineHeight: 1.55, maxWidth: 760 }}>
                    {m.resumo}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
