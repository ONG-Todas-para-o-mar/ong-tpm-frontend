import { Link, useNavigate } from "react-router-dom";
import Icon from "../../components/Icon.jsx";
import SEO from "../../components/SEO.jsx";
import { PH, WaveLine, StatBlock, LoadingState } from "../../components/Shared.jsx";
import { imagemDe, REGIAO_PADRAO } from "../../data/fotos.js";
import { NUM, dataBR } from "../../lib/format.js";
import { secaoVisivel } from "../../lib/secoes.js";
import { CONTATO, PARTICIPE } from "../../data/contato.js";
import { IMPRENSA } from "../../data/imprensa.js";
import {
  useDashboardPublico,
  useMetas,
  useNoticias,
  useVideos,
} from "../../hooks/useQueries.js";
import { useTheme } from "../../hooks/useTheme.jsx";

const externo = { target: "_blank", rel: "noreferrer noopener" };

export default function Home() {
  const navigate = useNavigate();
  const { variant } = useTheme();
  const { data: stats, isLoading: carregandoStats } = useDashboardPublico();
  const { data: metas, isLoading: carregandoMetas } = useMetas({ ativa: true });
  const { data: noticias } = useNoticias({ publicada: true });
  const { data: videos } = useVideos();

  const destaques = (metas || []).slice(0, 3);
  const ultimas = (noticias || []).slice(0, 3);
  const naMidia = (videos || []).slice(0, 3);
  const comDoacao = secaoVisivel("doacao");

  const numeros = [
    {
      v: carregandoStats ? "…" : NUM(stats?.campanhas_ativas || 0),
      l: "Projetos ativos",
      s: "Em andamento no Litoral Sul",
      secao: "projetos",
    },
    {
      v: "2016",
      l: "Atuando desde",
      s: "Na Baía de Maracaípe",
    },
    {
      v: carregandoStats ? "…" : NUM(stats?.socios || 0),
      l: "Sócios",
      s: "Rede de apoio permanente",
      secao: "socios",
    },
    // Números publicados pela imprensa (Terra 2023, Folha de Pernambuco out/2024).
    {
      v: "80+",
      l: "Crianças e adolescentes",
      s: "De 7 a 17 anos, em 2024",
    },
    {
      v: "120",
      l: "Mulheres",
      s: "Atendidas pela TPM em 2024",
    },
    {
      v: NUM((videos || []).length + IMPRENSA.length),
      l: "Aparições na mídia",
      s: "Reportagens, vídeos e entrevistas",
    },
  ].filter((n) => !n.secao || secaoVisivel(n.secao));

  return (
    <div data-screen-label="Public — Home" className="fade-up">
      <SEO title="Início" />

      <section style={{ padding: "64px 0 32px", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <div className="split" style={{ gap: 64, alignItems: "end" }}>
            <div>
              <div className="row gap-8" style={{ marginBottom: 28 }}>
                <WaveLine />
              </div>
              <h1
                className="display"
                style={{ fontSize: "clamp(40px, 5.8vw, 86px)", margin: "0 0 28px" }}
              >
                Surf como ferramenta,
                <br />
                <em
                  style={{
                    color: "var(--red)",
                    fontStyle: variant === "editorial" ? "italic" : "normal",
                  }}
                >
                  justiça social como destino.
                </em>
              </h1>
              <p
                style={{
                  fontSize: 18,
                  lineHeight: 1.55,
                  color: "var(--ink-2)",
                  maxWidth: 560,
                  margin: 0,
                }}
              >
                A TPM <strong style={{ color: "var(--ink)" }}>(Todas Para o Mar)</strong> é uma
                organização feminista e antirracista que empodera mulheres negras e seus filhos no
                Litoral Sul de Pernambuco através da democratização do surf e de práticas
                socioeducativas.
              </p>
              <div className="row gap-12" style={{ marginTop: 36, flexWrap: "wrap" }}>
                {comDoacao ? (
                  <button className="btn btn-primary btn-lg" onClick={() => navigate("/doar")}>
                    <Icon name="heart" size={16} /> Fazer uma doação
                  </button>
                ) : (
                  <button className="btn btn-primary btn-lg" onClick={() => navigate("/contato")}>
                    <Icon name="wave" size={16} /> Participe
                  </button>
                )}
                <button className="btn btn-secondary btn-lg" onClick={() => navigate("/sobre")}>
                  Conheça a TPM
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
              {numeros.map((s) => (
                <div key={s.l} style={{ background: "var(--bg-1)", padding: "26px 22px" }}>
                  <StatBlock value={s.v} label={s.l} sub={s.s} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "56px 0", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "200px 1fr",
              gap: 64,
              alignItems: "start",
            }}
          >
            <span className="eyebrow">Missão</span>
            <p
              className="display"
              style={{
                fontSize: "clamp(22px, 2.4vw, 36px)",
                margin: 0,
                color: "var(--ink)",
                lineHeight: 1.25,
              }}
            >
              Transformar a realidade social de mulheres negras e seus filhos por meio da
              democratização do surf e de práticas socioeducativas e culturais
              {comDoacao ? (
                <>
                  {" "}
                  — garantindo que <span style={{ color: "var(--red)" }}>cada real doado</span> seja
                  rastreável até o projeto que financia.
                </>
              ) : (
                <>
                  {" "}
                  no <span style={{ color: "var(--red)" }}>litoral sul de Pernambuco</span>.
                </>
              )}
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: "72px 0", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <span className="eyebrow">Participe</span>
          <h2 className="display" style={{ fontSize: "clamp(26px, 3vw, 44px)", margin: "10px 0 32px" }}>
            Vem pro mar com a gente.
          </h2>
          <div className="g3">
            {PARTICIPE.map((p) => (
              <article key={p.id} className="card" style={{ padding: 28, display: "flex", flexDirection: "column" }}>
                <div style={{ color: "var(--red)", marginBottom: 14 }}>
                  <Icon name={p.icone} size={22} />
                </div>
                <h3 className="display" style={{ fontSize: 22, margin: "0 0 8px" }}>
                  {p.titulo}
                </h3>
                <p style={{ color: "var(--ink-3)", fontSize: 14, margin: "0 0 22px", lineHeight: 1.55, flex: 1 }}>
                  {p.texto}
                </p>
                <a href={p.url} {...externo} className="btn btn-secondary" style={{ alignSelf: "flex-start" }}>
                  {p.acao} <Icon name="arrow" size={14} />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {naMidia.length > 0 && (
        <section style={{ padding: "72px 0", borderBottom: "1px solid var(--line)" }}>
          <div className="wrap">
            <div
              className="row"
              style={{
                justifyContent: "space-between",
                alignItems: "end",
                marginBottom: 32,
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <div>
                <span className="eyebrow">TPM na Mídia</span>
                <h2 className="display" style={{ fontSize: "clamp(26px, 3vw, 44px)", margin: "10px 0 0" }}>
                  O que contaram sobre a gente
                </h2>
              </div>
              <button className="btn btn-ghost" onClick={() => navigate("/tpm-na-midia")}>
                Ver tudo <Icon name="arrow" size={15} />
              </button>
            </div>
            <div className="g3">
              {naMidia.map((v) => (
                <article key={v.id}>
                  <Link to="/tpm-na-midia">
                    <PH label={v.titulo} src={v.thumbnail} ratio="16/9" />
                  </Link>
                  <div className="row gap-8" style={{ marginTop: 16, flexWrap: "wrap" }}>
                    {v.veiculo && <span className="tag tag-red">{v.veiculo}</span>}
                  </div>
                  <h3 className="display" style={{ fontSize: 18, margin: "10px 0 0", lineHeight: 1.3 }}>
                    <Link to="/tpm-na-midia">{v.titulo}</Link>
                  </h3>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {secaoVisivel("projetos") && (
        <section style={{ padding: "72px 0" }}>
          <div className="wrap">
            <div
              className="row"
              style={{
                justifyContent: "space-between",
                alignItems: "end",
                marginBottom: 32,
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <div>
                <span className="eyebrow">Em destaque</span>
                <h2 className="display" style={{ fontSize: "clamp(26px, 3vw, 44px)", margin: "10px 0 0" }}>
                  Projetos ativos
                </h2>
              </div>
              <button className="btn btn-ghost" onClick={() => navigate("/projetos")}>
                Ver todos <Icon name="arrow" size={15} />
              </button>
            </div>

            {carregandoMetas && <LoadingState label="Carregando projetos…" />}

            {!carregandoMetas && destaques.length === 0 && (
              <p style={{ color: "var(--ink-3)" }}>Nenhuma campanha ativa no momento.</p>
            )}

            <div className="g3">
              {destaques.map((m) => (
                <article
                  key={m.id}
                  className="card"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <Link to={`/projetos/${m.id}`}>
                    <PH
                      label={m.titulo}
                      src={imagemDe(m)}
                      ratio="16/10"
                      style={{ borderRadius: 0, border: 0 }}
                    />
                  </Link>
                  <div style={{ padding: 22, flex: 1, display: "flex", flexDirection: "column" }}>
                    <div className="row gap-8" style={{ marginBottom: 10, flexWrap: "wrap" }}>
                      <span className="tag mono">{m.regiao || REGIAO_PADRAO}</span>
                      {m.categoria?.nome && <span className="tag">{m.categoria.nome}</span>}
                    </div>
                    <h3 className="display" style={{ fontSize: 22, margin: "6px 0 8px" }}>
                      <Link to={`/projetos/${m.id}`}>{m.titulo}</Link>
                    </h3>
                    <p style={{ color: "var(--ink-3)", fontSize: 14, margin: 0, lineHeight: 1.5, flex: 1 }}>
                      {m.descricao}
                    </p>

                    <Link
                      to={`/projetos/${m.id}`}
                      className="mono"
                      style={{
                        marginTop: 22,
                        fontSize: 11,
                        color: "var(--red)",
                        letterSpacing: ".08em",
                        textTransform: "uppercase",
                        display: "inline-flex",
                        gap: 6,
                        alignItems: "center",
                      }}
                    >
                      Conhecer o projeto <Icon name="arrow" size={13} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {ultimas.length > 0 && (
        <section style={{ padding: "16px 0 72px" }}>
          <div className="wrap">
            <div
              className="row"
              style={{
                justifyContent: "space-between",
                alignItems: "end",
                marginBottom: 28,
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <div>
                <span className="eyebrow">Notícias</span>
                <h2 className="display" style={{ fontSize: "clamp(24px, 2.6vw, 36px)", margin: "10px 0 0" }}>
                  O que aconteceu por aqui
                </h2>
              </div>
              <button className="btn btn-ghost" onClick={() => navigate("/noticias")}>
                Ver todas <Icon name="arrow" size={15} />
              </button>
            </div>

            <div className="g3">
              {ultimas.map((n) => (
                <article key={n.id}>
                  <Link to={`/noticias/${n.slug}`}>
                    <PH label={n.titulo} src={imagemDe({ imagem: n.imagem, titulo: n.slug })} ratio="4/3" />
                  </Link>
                  <div className="row gap-8" style={{ marginTop: 16, flexWrap: "wrap" }}>
                    <span className="tag">{n.categoria_display}</span>
                    <span className="mono muted" style={{ fontSize: 12 }}>
                      {dataBR(n.publicada_em)}
                    </span>
                  </div>
                  <h3 className="display" style={{ fontSize: 20, margin: "10px 0 8px", lineHeight: 1.25 }}>
                    <Link to={`/noticias/${n.slug}`}>{n.titulo}</Link>
                  </h3>
                  <p style={{ color: "var(--ink-3)", fontSize: 14, margin: 0, lineHeight: 1.55 }}>
                    {n.resumo}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section style={{ padding: "16px 0 96px" }}>
        <div className="wrap">
          <div
            className="card"
            style={{
              padding: "40px 44px",
              display: "flex",
              gap: 24,
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <div>
              <span className="eyebrow">Fique por dentro</span>
              <h3 className="display" style={{ fontSize: 28, margin: "12px 0 8px" }}>
                O dia a dia da TPM está no Instagram.
              </h3>
              <p style={{ color: "var(--ink-2)", margin: 0, maxWidth: 520 }}>
                Aulas, encontros, cineclube e a rotina na Baía de Maracaípe.
              </p>
            </div>
            <div className="row gap-12" style={{ flexWrap: "wrap" }}>
              <a href={CONTATO.instagram.url} {...externo} className="btn btn-primary">
                <Icon name="instagram" size={15} /> @{CONTATO.instagram.usuario}
              </a>
              <button className="btn btn-ghost" onClick={() => navigate("/fique-por-dentro")}>
                Ver no site <Icon name="arrow" size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {secaoVisivel("transparencia") && (
        <section style={{ padding: "16px 0 96px" }}>
          <div className="wrap">
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <div className="split-narrow" style={{ gap: 0, minHeight: 280 }}>
                <div style={{ padding: "44px 48px", borderRight: "1px solid var(--line)" }}>
                  <span className="eyebrow">Transparência ativa</span>
                  <h3 className="display" style={{ fontSize: 30, margin: "14px 0 16px" }}>
                    Cada doação tem rastro.
                  </h3>
                  <p style={{ color: "var(--ink-2)", margin: "0 0 24px", maxWidth: 460 }}>
                    Publicamos o destino de cada recurso recebido e os registros de impacto de cada
                    projeto. Quem apoia acompanha a própria contribuição pelo painel.
                  </p>
                  <div className="row gap-12" style={{ flexWrap: "wrap" }}>
                    <button className="btn btn-dark" onClick={() => navigate("/transparencia")}>
                      <Icon name="file" size={15} /> Prestação de contas
                    </button>
                    {secaoVisivel("socios") && (
                      <button className="btn btn-ghost" onClick={() => navigate("/socios")}>
                        Selos de sócio <Icon name="arrow" size={14} />
                      </button>
                    )}
                  </div>
                </div>
                <div
                  style={{
                    padding: "44px 48px",
                    display: "grid",
                    gap: 28,
                    alignContent: "center",
                    background: "var(--bg)",
                  }}
                >
                  {[
                    {
                      t: "Relatórios periódicos",
                      d: "Publicados na aba de Notícias, na categoria Transparência.",
                    },
                    {
                      t: "Registro de impacto por projeto",
                      d: "Cada campanha lista o que já foi entregue, com número e unidade.",
                    },
                    {
                      t: "Contas abertas",
                      d: "A destinação por projeto fica na página de prestação de contas.",
                    },
                  ].map((item) => (
                    <div key={item.t} className="row gap-12" style={{ alignItems: "flex-start" }}>
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 999,
                          border: "1px solid var(--red)",
                          color: "var(--red)",
                          display: "grid",
                          placeItems: "center",
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      >
                        <Icon name="check" size={13} />
                      </div>
                      <div>
                        <strong style={{ fontSize: 15, display: "block", marginBottom: 4 }}>
                          {item.t}
                        </strong>
                        <span style={{ fontSize: 14, color: "var(--ink-3)", lineHeight: 1.5 }}>
                          {item.d}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
