import { Link, useParams } from "react-router-dom";
import Icon from "../../components/Icon.jsx";
import SEO from "../../components/SEO.jsx";
import { PH, LoadingState, ErrorState, RichText } from "../../components/Shared.jsx";
import { imagemDe } from "../../data/fotos.js";
import { dataExtensoBR } from "../../lib/format.js";
import { useNoticia, useNoticias } from "../../hooks/useQueries.js";

export default function PostDetail() {
  const { slug } = useParams();
  const { data: noticia, isLoading, isError, refetch } = useNoticia(slug);
  const { data: outras } = useNoticias({ publicada: true });

  if (isLoading) {
    return (
      <div className="wrap" style={{ padding: "96px 0" }}>
        <LoadingState label="Carregando matéria…" />
      </div>
    );
  }

  if (isError || !noticia) {
    return (
      <div className="wrap" style={{ padding: "96px 0" }}>
        <ErrorState message="Matéria não encontrada." onRetry={refetch} />
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Link to="/noticias" className="btn btn-secondary btn-sm">
            <Icon name="arrowLeft" size={14} /> Voltar às notícias
          </Link>
        </div>
      </div>
    );
  }

  const relacionadas = (outras || []).filter((n) => n.slug !== slug).slice(0, 3);

  return (
    <div data-screen-label="Public — Matéria" className="fade-up">
      <SEO
        title={noticia.titulo}
        description={noticia.resumo}
        image={noticia.imagem || undefined}
      />

      <article>
        <section style={{ padding: "32px 0 0" }}>
          <div className="wrap-narrow">
            <Link
              to="/noticias"
              className="mono"
              style={{ fontSize: 12, color: "var(--ink-3)", display: "inline-flex", gap: 6 }}
            >
              <Icon name="arrowLeft" size={13} /> Notícias
            </Link>
          </div>
        </section>

        <header style={{ padding: "24px 0 32px" }}>
          <div className="wrap-narrow">
            <div className="row gap-8" style={{ marginBottom: 18, flexWrap: "wrap" }}>
              <span className="tag tag-red">{noticia.categoria_display}</span>
              <span className="mono muted" style={{ fontSize: 12 }}>
                {dataExtensoBR(noticia.publicada_em || noticia.criada_em)}
              </span>
              {noticia.autor_nome && (
                <span className="mono muted" style={{ fontSize: 12 }}>
                  por {noticia.autor_nome}
                </span>
              )}
            </div>
            <h1
              className="display"
              style={{ fontSize: "clamp(30px, 4.6vw, 56px)", margin: "0 0 20px", lineHeight: 1.1 }}
            >
              {noticia.titulo}
            </h1>
            {noticia.resumo && (
              <p style={{ fontSize: 19, color: "var(--ink-2)", lineHeight: 1.6, margin: 0 }}>
                {noticia.resumo}
              </p>
            )}
          </div>
        </header>

        <div className="wrap" style={{ paddingBottom: 40 }}>
          <PH
            label={noticia.titulo}
            src={imagemDe({ imagem: noticia.imagem, titulo: noticia.slug })}
            ratio="16/9"
          />
        </div>

        <div className="wrap-narrow" style={{ paddingBottom: 56 }}>
          <RichText>{noticia.conteudo || noticia.resumo}</RichText>

          {noticia.meta && (
            <div className="card" style={{ padding: 24, marginTop: 40 }}>
              <span className="eyebrow">Projeto relacionado</span>
              <h3 className="display" style={{ fontSize: 22, margin: "10px 0 14px" }}>
                {noticia.meta_titulo}
              </h3>
              <Link to={`/projetos/${noticia.meta}`} className="btn btn-secondary btn-sm">
                Ver o projeto <Icon name="arrow" size={13} />
              </Link>
            </div>
          )}
        </div>
      </article>

      {relacionadas.length > 0 && (
        <section
          style={{ padding: "56px 0 96px", borderTop: "1px solid var(--line)" }}
        >
          <div className="wrap">
            <span className="eyebrow">Leia também</span>
            <div className="g3" style={{ marginTop: 24 }}>
              {relacionadas.map((n) => (
                <article key={n.id}>
                  <Link to={`/noticias/${n.slug}`}>
                    <PH
                      label={n.titulo}
                      src={imagemDe({ imagem: n.imagem, titulo: n.slug })}
                      ratio="4/3"
                    />
                  </Link>
                  <div className="row gap-8" style={{ marginTop: 14 }}>
                    <span className="tag">{n.categoria_display}</span>
                  </div>
                  <h3 className="display" style={{ fontSize: 19, margin: "10px 0 0" }}>
                    <Link to={`/noticias/${n.slug}`}>{n.titulo}</Link>
                  </h3>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
