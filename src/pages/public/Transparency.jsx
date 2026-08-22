import { Link } from "react-router-dom";
import Icon from "../../components/Icon.jsx";
import SEO from "../../components/SEO.jsx";
import {
  EmptyState,
  LoadingState,
  Progress,
  StatBlock,
} from "../../components/Shared.jsx";
import { BRL, NUM, PCT, dataBR } from "../../lib/format.js";
import { useDashboardPublico, useImpactos, useMetas, useNoticias } from "../../hooks/useQueries.js";

export default function Transparency() {
  const { data: stats, isLoading } = useDashboardPublico();
  const { data: metas } = useMetas();
  const { data: impactos } = useImpactos();
  const { data: relatorios } = useNoticias({ publicada: true, categoria: "transparencia" });

  const campanhas = (metas || []).filter((m) => m.ativa);
  const registros = (impactos || []).slice(0, 12);

  return (
    <div data-screen-label="Public — Transparência" className="fade-up">
      <SEO
        title="Transparência"
        description="Prestação de contas da TPM: totais arrecadados, alocação por campanha e registros de impacto."
      />

      <section style={{ padding: "64px 0 32px", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <span className="eyebrow">Prestação de contas</span>
          <h1 className="display" style={{ fontSize: "clamp(34px, 5vw, 72px)", margin: "18px 0 24px" }}>
            Cada real doado tem rastro.
          </h1>
          <p style={{ fontSize: 17, color: "var(--ink-2)", maxWidth: 660, margin: 0 }}>
            Os números desta página vêm direto do banco de dados da plataforma e mudam a cada doação
            confirmada pela equipe. Nenhum valor é editado manualmente.
          </p>
        </div>
      </section>

      <section style={{ padding: "40px 0" }}>
        <div className="wrap">
          <div
            className="g4"
            style={{
              gap: 1,
              background: "var(--line)",
              border: "1px solid var(--line)",
              borderRadius: "var(--r-card)",
              overflow: "hidden",
            }}
          >
            {[
              {
                v: isLoading ? "…" : BRL(stats?.total_arrecadado || 0),
                l: "Total arrecadado",
                s: "Doações confirmadas",
              },
              {
                v: isLoading ? "…" : NUM(stats?.doacoes_confirmadas || 0),
                l: "Doações confirmadas",
                s: "Registros conciliados",
              },
              {
                v: isLoading ? "…" : NUM(stats?.doadores_ativos || 0),
                l: "Doadores",
                s: "Pessoas e empresas",
              },
              {
                v: isLoading ? "…" : BRL(stats?.ticket_medio || 0),
                l: "Ticket médio",
                s: "Por doação confirmada",
              },
            ].map((s) => (
              <div key={s.l} style={{ background: "var(--bg-1)", padding: "26px 22px" }}>
                <StatBlock value={s.v} label={s.l} sub={s.s} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "32px 0 56px" }}>
        <div className="wrap">
          <span className="eyebrow">Alocação por campanha</span>
          <h2 className="display" style={{ fontSize: "clamp(24px, 2.6vw, 36px)", margin: "10px 0 28px" }}>
            Para onde o dinheiro foi
          </h2>

          {campanhas.length === 0 ? (
            <EmptyState title="Nenhuma campanha ativa" />
          ) : (
            <div className="table-scroll">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Campanha</th>
                    <th>Categoria</th>
                    <th className="num">Arrecadado</th>
                    <th className="num">Meta</th>
                    <th style={{ width: 200 }}>Progresso</th>
                    <th>Prazo</th>
                  </tr>
                </thead>
                <tbody>
                  {campanhas.map((m) => (
                    <tr key={m.id}>
                      <td>
                        <Link to={`/projetos/${m.id}`} style={{ fontWeight: 600 }}>
                          {m.titulo}
                        </Link>
                      </td>
                      <td>
                        <span className="tag" style={{ fontSize: 10 }}>
                          {m.categoria?.nome || "—"}
                        </span>
                      </td>
                      <td className="mono num" style={{ fontWeight: 600 }}>
                        {BRL(m.valor_atual)}
                      </td>
                      <td className="mono num" style={{ color: "var(--ink-3)" }}>
                        {Number(m.valor_alvo) > 0 ? BRL(m.valor_alvo) : "—"}
                      </td>
                      <td>
                        <Progress
                          value={Number(m.valor_atual || 0)}
                          max={Number(m.valor_alvo || 0) || 1}
                          label={`Progresso de ${m.titulo}`}
                        />
                        <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 6 }}>
                          {Number(m.valor_alvo) > 0 ? PCT(m.progresso_pct) : "meta aberta"}
                        </div>
                      </td>
                      <td className="mono" style={{ fontSize: 12, color: "var(--ink-3)" }}>
                        {dataBR(m.prazo)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <section style={{ padding: "0 0 56px" }}>
        <div className="wrap">
          <span className="eyebrow">Registros de impacto</span>
          <h2 className="display" style={{ fontSize: "clamp(24px, 2.6vw, 36px)", margin: "10px 0 24px" }}>
            O que foi entregue
          </h2>

          {registros.length === 0 ? (
            <EmptyState
              title="Sem registros publicados"
              description="A equipe registra as entregas de cada campanha no painel administrativo."
            />
          ) : (
            <div className="g2" style={{ gap: 16 }}>
              {registros.map((i) => (
                <div key={i.id} className="card" style={{ padding: 24 }}>
                  <div className="row" style={{ justifyContent: "space-between", gap: 16 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{i.tipo}</div>
                      <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 6 }}>
                        {i.descricao}
                      </div>
                      {i.meta_titulo && (
                        <span className="tag" style={{ fontSize: 10, marginTop: 12 }}>
                          {i.meta_titulo}
                        </span>
                      )}
                    </div>
                    {i.valor_numerico !== null && i.valor_numerico !== undefined && (
                      <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                        <div className="display tnum" style={{ fontSize: 26 }}>
                          {NUM(i.valor_numerico)}
                        </div>
                        <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>
                          {i.unidade}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 16 }}>
                    {dataBR(i.criado_em)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section style={{ padding: "0 0 96px" }}>
        <div className="wrap">
          <span className="eyebrow">Relatórios publicados</span>
          <h2 className="display" style={{ fontSize: "clamp(24px, 2.6vw, 36px)", margin: "10px 0 24px" }}>
            Documentos e balanços
          </h2>

          {isLoading && <LoadingState />}

          {(relatorios || []).length === 0 ? (
            <EmptyState
              title="Nenhum relatório publicado ainda"
              description="Os relatórios entram na aba de notícias, na categoria Transparência."
              action={
                <Link to="/noticias" className="btn btn-secondary btn-sm">
                  Ver notícias <Icon name="arrow" size={13} />
                </Link>
              }
            />
          ) : (
            <div className="col gap-8">
              {(relatorios || []).map((n) => (
                <Link
                  key={n.id}
                  to={`/noticias/${n.slug}`}
                  className="card row"
                  style={{ padding: "18px 22px", justifyContent: "space-between", gap: 16 }}
                >
                  <div className="row gap-12">
                    <Icon name="file" size={18} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{n.titulo}</div>
                      <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 4 }}>
                        {dataBR(n.publicada_em)}
                      </div>
                    </div>
                  </div>
                  <Icon name="arrow" size={16} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
