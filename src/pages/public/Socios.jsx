import { Link } from "react-router-dom";
import Icon from "../../components/Icon.jsx";
import SEO from "../../components/SEO.jsx";
import {
  Avatar,
  EmptyState,
  ErrorState,
  LoadingState,
  StatBlock,
  WaveLine,
} from "../../components/Shared.jsx";
import { BRL, NUM, dataBR } from "../../lib/format.js";
import { useSocios } from "../../hooks/useQueries.js";
import { useAuth } from "../../hooks/useAuth.jsx";

const ICONE_PADRAO = "medal";

function criterioTexto(selo) {
  if (selo.tipo === "recorrencia") {
    return `${selo.criterio_meses} ${selo.criterio_meses === 1 ? "mês" : "meses"} de contribuição recorrente`;
  }
  if (selo.tipo === "manual") {
    return "Atribuído pela equipe da ONG";
  }
  const valor = Number(selo.criterio_valor || 0);
  return valor > 0 ? `A partir de ${BRL(valor)} doados` : "Primeira doação confirmada";
}

export default function Socios() {
  const { isAuthed } = useAuth();
  const { data, isLoading, isError, refetch } = useSocios();

  const selos = data?.selos || [];

  return (
    <div data-screen-label="Public — Sócios" className="fade-up">
      <SEO
        title="Sócios"
        description="Os selos de sócio da TPM reconhecem quem sustenta os projetos: por valor doado, por tempo de contribuição recorrente ou por parceria institucional."
      />

      <section style={{ padding: "64px 0 32px", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <div className="row gap-8" style={{ marginBottom: 24, maxWidth: 320 }}>
            <WaveLine />
          </div>
          <span className="eyebrow">Selos de sócio</span>
          <h1 className="display" style={{ fontSize: "clamp(34px, 5vw, 72px)", margin: "18px 0 24px" }}>
            Quem sustenta a maré ganha selo.
          </h1>
          <p style={{ fontSize: 17, color: "var(--ink-2)", maxWidth: 660, margin: 0 }}>
            Cada selo marca um compromisso diferente com a ONG: o valor total doado, o tempo de
            contribuição recorrente ou a parceria institucional. Os selos são atribuídos
            automaticamente assim que a doação é confirmada — e aparecem no seu painel e no ranking
            público, se você optar por participar.
          </p>
        </div>
      </section>

      <section style={{ padding: "40px 0 24px" }}>
        <div className="wrap">
          <div
            className="g3"
            style={{
              gap: 1,
              background: "var(--line)",
              border: "1px solid var(--line)",
              borderRadius: "var(--r-card)",
              overflow: "hidden",
            }}
          >
            <div style={{ background: "var(--bg-1)", padding: "26px 24px" }}>
              <StatBlock
                value={isLoading ? "…" : NUM(data?.total_socios || 0)}
                label="Sócios recorrentes"
                sub="Com contribuição mensal confirmada"
              />
            </div>
            <div style={{ background: "var(--bg-1)", padding: "26px 24px" }}>
              <StatBlock
                value={isLoading ? "…" : NUM(data?.total_com_selo || 0)}
                label="Pessoas com algum selo"
                sub="Doadores reconhecidos na plataforma"
              />
            </div>
            <div style={{ background: "var(--bg-1)", padding: "26px 24px" }}>
              <StatBlock
                value={isLoading ? "…" : NUM(selos.length)}
                label="Selos disponíveis"
                sub="Por valor, recorrência e parceria"
              />
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "32px 0 96px" }}>
        <div className="wrap">
          {isLoading && <LoadingState label="Carregando selos…" />}
          {isError && <ErrorState onRetry={refetch} />}

          {!isLoading && !isError && selos.length === 0 && (
            <EmptyState
              title="Nenhum selo cadastrado"
              description="A equipe da ONG ainda não configurou os selos de sócio."
            />
          )}

          <div className="g2" style={{ gap: 20 }}>
            {selos.map((selo) => (
              <div key={selo.id} className="selo-card">
                <div className="row gap-16" style={{ alignItems: "flex-start" }}>
                  <div
                    className="selo-icone"
                    style={{
                      background: selo.cor ? `${selo.cor}1f` : "var(--bg-2)",
                      color: selo.cor || "var(--ink-2)",
                      borderColor: selo.cor ? `${selo.cor}55` : "var(--line)",
                    }}
                  >
                    <Icon name={selo.icone || ICONE_PADRAO} size={22} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="row gap-8" style={{ flexWrap: "wrap" }}>
                      <h2 className="display" style={{ fontSize: 22, margin: 0 }}>
                        {selo.nome}
                      </h2>
                      <span className="tag mono">{selo.tipo_display}</span>
                    </div>
                    <p style={{ color: "var(--ink-3)", fontSize: 14, margin: "8px 0 0", lineHeight: 1.55 }}>
                      {selo.descricao}
                    </p>
                  </div>
                </div>

                <div
                  className="row"
                  style={{
                    justifyContent: "space-between",
                    padding: "12px 0",
                    borderTop: "1px solid var(--line)",
                    borderBottom: "1px solid var(--line)",
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: "var(--ink-3)" }}>{criterioTexto(selo)}</span>
                  <strong className="mono">{NUM(selo.total_socios || 0)} pessoas</strong>
                </div>

                {selo.socios?.length ? (
                  <div className="row gap-8" style={{ flexWrap: "wrap" }}>
                    {selo.socios.map((s) => (
                      <div
                        key={s.doador_id}
                        className="row gap-8"
                        title={`Desde ${dataBR(s.desde)}`}
                        style={{
                          padding: "6px 10px 6px 6px",
                          background: "var(--bg-2)",
                          borderRadius: 999,
                        }}
                      >
                        <Avatar nome={s.nome} size={24} destaque={s.socio} />
                        <span style={{ fontSize: 13 }}>{s.nome}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: 13, color: "var(--ink-3)", margin: 0 }}>
                    Ainda ninguém conquistou este selo publicamente.
                  </p>
                )}
              </div>
            ))}
          </div>

          <div
            className="card"
            style={{
              padding: 28,
              marginTop: 40,
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 32,
              alignItems: "center",
            }}
          >
            <div>
              <span className="eyebrow">Como funciona</span>
              <h3 className="display" style={{ fontSize: 24, margin: "10px 0 8px" }}>
                Reconhecimento, não competição.
              </h3>
              <p style={{ color: "var(--ink-2)", margin: 0, fontSize: 14, maxWidth: 620 }}>
                Os selos são concedidos automaticamente quando a doação é confirmada pela equipe. A
                exibição pública é opcional: quem prefere contribuir de forma anônima desmarca a
                participação no ranking dentro da própria conta e continua recebendo os selos.
              </p>
            </div>
            <Link to={isAuthed ? "/minha-conta" : "/cadastro"} className="btn btn-primary">
              {isAuthed ? "Ver meus selos" : "Criar minha conta"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
