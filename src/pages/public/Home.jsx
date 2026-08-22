import { Link, useNavigate } from "react-router-dom";
import Icon from "../../components/Icon.jsx";
import SEO from "../../components/SEO.jsx";
import { PH, WaveLine, Progress, StatBlock, LoadingState } from "../../components/Shared.jsx";
import { imagemDe, REGIAO_PADRAO } from "../../data/fotos.js";
import { BRL, NUM, dataBR } from "../../lib/format.js";
import { useDashboardPublico, useMetas, useNoticias } from "../../hooks/useQueries.js";
import { useTheme } from "../../hooks/useTheme.jsx";

export default function Home() {
  const navigate = useNavigate();
  const { variant } = useTheme();
  const { data: stats, isLoading: carregandoStats } = useDashboardPublico();
  const { data: metas, isLoading: carregandoMetas } = useMetas({ ativa: true });
  const { data: noticias } = useNoticias({ publicada: true });

  const destaques = (metas || []).slice(0, 3);
  const ultimas = (noticias || []).slice(0, 3);

  const numeros = [
    {
      v: carregandoStats ? "…" : BRL(stats?.total_arrecadado || 0),
      l: "Arrecadado",
      s: "Doações confirmadas na plataforma",
    },
    {
      v: carregandoStats ? "…" : NUM(stats?.doadores_ativos || 0),
      l: "Doadores ativos",
      s: "Pessoas e empresas",
    },
    {
      v: carregandoStats ? "…" : NUM(stats?.socios || 0),
      l: "Sócios com selo",
      s: "Contribuição recorrente",
    },
    {
      v: carregandoStats ? "…" : NUM(stats?.campanhas_ativas || 0),
      l: "Campanhas ativas",
      s: "Com meta e prazo definidos",
    },
  ];

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
              democratização do surf e de práticas socioeducativas e culturais — garantindo que{" "}
              <span style={{ color: "var(--red)" }}>cada real doado</span> seja rastreável até o
              projeto que financia.
            </p>
          </div>
        </div>
      </section>

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

                  <div style={{ marginTop: 22 }}>
                    <Progress
                      value={Number(m.valor_atual || 0)}
                      max={Number(m.valor_alvo || 0) || 1}
                      label={`Progresso de ${m.titulo}`}
                    />
                    <div
                      className="row mono"
                      style={{
                        justifyContent: "space-between",
                        marginTop: 8,
                        fontSize: 11,
                        color: "var(--ink-3)",
                      }}
                    >
                      <span>{BRL(m.valor_atual)} arrecadados</span>
                      <span>
                        {Number(m.valor_alvo) > 0 ? `meta ${BRL(m.valor_alvo)}` : "meta aberta"}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

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
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div className="split-narrow" style={{ gap: 0, minHeight: 280 }}>
              <div style={{ padding: "44px 48px", borderRight: "1px solid var(--line)" }}>
                <span className="eyebrow">Transparência ativa</span>
                <h3 className="display" style={{ fontSize: 30, margin: "14px 0 16px" }}>
                  Cada doação tem rastro.
                </h3>
                <p style={{ color: "var(--ink-2)", margin: "0 0 24px", maxWidth: 460 }}>
                  Publicamos a alocação de cada real recebido e os registros de impacto de cada
                  projeto. Doadores acompanham a própria contribuição pelo painel.
                </p>
                <div className="row gap-12" style={{ flexWrap: "wrap" }}>
                  <button className="btn btn-dark" onClick={() => navigate("/transparencia")}>
                    <Icon name="file" size={15} /> Prestação de contas
                  </button>
                  <button className="btn btn-ghost" onClick={() => navigate("/socios")}>
                    Selos de sócio <Icon name="arrow" size={14} />
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
                <StatBlock
                  value={carregandoStats ? "…" : NUM(stats?.doacoes_confirmadas || 0)}
                  label="Doações confirmadas"
                  sub="Registradas e conciliadas"
                />
                <StatBlock
                  value={carregandoStats ? "…" : BRL(stats?.ticket_medio || 0)}
                  label="Ticket médio"
                  sub="Por doação confirmada"
                />
                <StatBlock
                  value={carregandoStats ? "…" : NUM(stats?.projetos_total || 0)}
                  label="Projetos cadastrados"
                  sub="Ativos e arquivados"
                />
                <StatBlock
                  value={carregandoStats ? "…" : NUM(stats?.noticias_publicadas || 0)}
                  label="Publicações"
                  sub="Relatórios e bastidores"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
