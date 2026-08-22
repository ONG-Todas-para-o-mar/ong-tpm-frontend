import { Link, useParams } from "react-router-dom";
import Icon from "../../components/Icon.jsx";
import SEO from "../../components/SEO.jsx";
import {
  PH,
  Progress,
  LoadingState,
  ErrorState,
  RichText,
  EmptyState,
} from "../../components/Shared.jsx";
import { imagemDe, REGIAO_PADRAO } from "../../data/fotos.js";
import { BRL, NUM, PCT, dataBR, diasRestantes } from "../../lib/format.js";
import { useMeta, useNoticias } from "../../hooks/useQueries.js";

export default function ProjectDetail() {
  const { id } = useParams();
  const { data: meta, isLoading, isError, refetch } = useMeta(id);
  const { data: noticias } = useNoticias({ meta: id, publicada: true });

  if (isLoading) {
    return (
      <div className="wrap" style={{ padding: "96px 0" }}>
        <LoadingState label="Carregando projeto…" />
      </div>
    );
  }

  if (isError || !meta) {
    return (
      <div className="wrap" style={{ padding: "96px 0" }}>
        <ErrorState message="Projeto não encontrado." onRetry={refetch} />
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Link to="/projetos" className="btn btn-secondary btn-sm">
            <Icon name="arrowLeft" size={14} /> Voltar aos projetos
          </Link>
        </div>
      </div>
    );
  }

  const arrecadado = Number(meta.valor_atual || 0);
  const alvo = Number(meta.valor_alvo || 0);
  const dias = diasRestantes(meta.prazo);
  const impactos = meta.impactos || [];
  const relacionadas = noticias || [];

  return (
    <div data-screen-label="Public — Projeto" className="fade-up">
      <SEO title={meta.titulo} description={meta.descricao} image={meta.imagem || undefined} />

      <section style={{ padding: "32px 0 0" }}>
        <div className="wrap">
          <Link
            to="/projetos"
            className="mono"
            style={{ fontSize: 12, color: "var(--ink-3)", display: "inline-flex", gap: 6 }}
          >
            <Icon name="arrowLeft" size={13} /> Projetos
          </Link>
        </div>
      </section>

      <section style={{ padding: "24px 0 48px", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap split" style={{ gap: 48 }}>
          <div>
            <div className="row gap-8" style={{ marginBottom: 16, flexWrap: "wrap" }}>
              {meta.categoria?.nome && <span className="tag">{meta.categoria.nome}</span>}
              <span className="tag mono">{meta.regiao || REGIAO_PADRAO}</span>
              <span className={meta.ativa ? "tag tag-red tag-dot" : "tag"}>
                {meta.ativa ? "Campanha ativa" : "Arquivada"}
              </span>
            </div>
            <h1 className="display" style={{ fontSize: "clamp(32px, 4.4vw, 56px)", margin: "0 0 20px" }}>
              {meta.titulo}
            </h1>
            <p style={{ fontSize: 17, color: "var(--ink-2)", lineHeight: 1.65, margin: 0 }}>
              {meta.descricao || "Descrição em elaboração."}
            </p>

            <div style={{ marginTop: 32 }}>
              <PH label={meta.titulo} src={imagemDe(meta)} ratio="16/9" />
            </div>
          </div>

          <aside>
            <div className="card" style={{ padding: 28, position: "sticky", top: 88 }}>
              <span className="eyebrow">Arrecadado</span>
              <div className="stat-num" style={{ fontSize: 42, margin: "10px 0 4px" }}>
                {BRL(arrecadado)}
              </div>
              <div style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 18 }}>
                {alvo > 0 ? `de ${BRL(alvo)} · ${PCT(meta.progresso_pct)}` : "meta em aberto"}
              </div>
              <Progress value={arrecadado} max={alvo || 1} label={`Progresso de ${meta.titulo}`} />

              <hr className="divider" style={{ margin: "24px 0" }} />

              <div className="col gap-12" style={{ fontSize: 13 }}>
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <span style={{ color: "var(--ink-3)" }}>Doações confirmadas</span>
                  <strong className="mono">{NUM(meta.total_doacoes || 0)}</strong>
                </div>
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <span style={{ color: "var(--ink-3)" }}>Prazo</span>
                  <strong className="mono">
                    {meta.prazo ? dataBR(meta.prazo) : "sem prazo"}
                  </strong>
                </div>
                {dias !== null && (
                  <div className="row" style={{ justifyContent: "space-between" }}>
                    <span style={{ color: "var(--ink-3)" }}>Tempo restante</span>
                    <strong className="mono">
                      {dias >= 0 ? `${dias} dias` : "encerrado"}
                    </strong>
                  </div>
                )}
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <span style={{ color: "var(--ink-3)" }}>Criada em</span>
                  <strong className="mono">{dataBR(meta.criada_em)}</strong>
                </div>
              </div>

              <Link
                to={`/doar?projeto=${meta.id}`}
                className="btn btn-primary btn-lg"
                style={{ width: "100%", marginTop: 24 }}
              >
                <Icon name="heart" size={16} /> Apoiar este projeto
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section style={{ padding: "56px 0" }}>
        <div className="wrap">
          <span className="eyebrow">Registros de impacto</span>
          <h2 className="display" style={{ fontSize: "clamp(24px, 2.6vw, 36px)", margin: "10px 0 28px" }}>
            O que já foi entregue
          </h2>

          {impactos.length === 0 ? (
            <EmptyState
              title="Ainda sem registros publicados"
              description="Assim que a equipe registrar as primeiras entregas deste projeto, elas aparecem aqui."
            />
          ) : (
            <div style={{ display: "grid", gap: 0 }}>
              {impactos.map((i, idx) => (
                <div
                  key={i.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "150px 1fr auto",
                    gap: 24,
                    padding: "20px 0",
                    borderTop: idx === 0 ? "1px solid var(--line-strong)" : "1px solid var(--line)",
                    alignItems: "center",
                  }}
                >
                  <div className="mono" style={{ fontSize: 12, color: "var(--ink-3)" }}>
                    {dataBR(i.criado_em)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{i.tipo}</div>
                    <div style={{ fontSize: 14, color: "var(--ink-3)", marginTop: 4 }}>
                      {i.descricao}
                    </div>
                  </div>
                  {i.valor_numerico !== null && i.valor_numerico !== undefined && (
                    <div className="display tnum" style={{ fontSize: 24, whiteSpace: "nowrap" }}>
                      {NUM(i.valor_numerico)}{" "}
                      <span style={{ fontSize: 13, color: "var(--ink-3)" }}>{i.unidade}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {relacionadas.length > 0 && (
        <section style={{ padding: "0 0 96px" }}>
          <div className="wrap">
            <span className="eyebrow">Notícias do projeto</span>
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
                    <span className="mono muted" style={{ fontSize: 12 }}>
                      {dataBR(n.publicada_em)}
                    </span>
                  </div>
                  <h3 className="display" style={{ fontSize: 19, margin: "10px 0 6px" }}>
                    <Link to={`/noticias/${n.slug}`}>{n.titulo}</Link>
                  </h3>
                  <RichText>{n.resumo}</RichText>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
