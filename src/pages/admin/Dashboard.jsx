import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../../components/Icon.jsx";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  Notice,
  Progress,
} from "../../components/Shared.jsx";
import { Sparkline, BarChart, AdminLayout } from "../../components/Charts.jsx";
import { BRL, BRL2, NUM, PCT, dataBR, dataHoraBR, plural } from "../../lib/format.js";
import { baixarArquivo, mensagemDeErro } from "../../lib/api.js";
import { useDashboardAdmin } from "../../hooks/useQueries.js";

const PERIODOS = [
  { id: 7, label: "7d" },
  { id: 14, label: "14d" },
  { id: 30, label: "30d" },
  { id: 90, label: "90d" },
  { id: 365, label: "Ano" },
];

const CORES_METODO = ["var(--red)", "var(--ink)", "var(--line-strong)", "var(--ink-3)"];

export default function Dashboard() {
  const [dias, setDias] = useState(14);
  const [erro, setErro] = useState(null);
  const [exportando, setExportando] = useState(false);
  const { data, isLoading, isError, refetch } = useDashboardAdmin(dias);

  const exportar = async () => {
    setErro(null);
    setExportando(true);
    try {
      await baixarArquivo("/doacoes/exportar/", "doacoes.csv");
    } catch (err) {
      setErro(mensagemDeErro(err, "Não foi possível exportar o CSV."));
    } finally {
      setExportando(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout label="Dashboard">
        <LoadingState label="Carregando indicadores…" />
      </AdminLayout>
    );
  }

  if (isError || !data) {
    return (
      <AdminLayout label="Dashboard">
        <ErrorState message="Erro ao carregar o dashboard." onRetry={refetch} />
      </AdminLayout>
    );
  }

  const serie = data.serie || [];
  const valores = serie.map((d) => d.total);
  const labels = serie.map((d) => d.label);
  const totalPeriodo = valores.reduce((a, b) => a + b, 0);
  const mediaDiaria = valores.length ? totalPeriodo / valores.length : 0;

  const metade = Math.floor(valores.length / 2);
  const recente = valores.slice(metade).reduce((a, b) => a + b, 0);
  const anterior = valores.slice(0, metade).reduce((a, b) => a + b, 0);
  const variacao = anterior > 0 ? ((recente - anterior) / anterior) * 100 : null;

  const totalMetodos = (data.por_metodo || []).reduce((a, m) => a + m.total, 0);

  const kpis = [
    {
      eyebrow: "Total arrecadado",
      value: BRL(data.total_arrecadado),
      sub: plural(data.doacoes_confirmadas, "doação confirmada", "doações confirmadas"),
      spark: valores,
    },
    {
      eyebrow: "Doadores ativos",
      value: NUM(data.doadores_ativos),
      sub: plural(data.socios, "sócio recorrente", "sócios recorrentes"),
      spark: [],
    },
    {
      eyebrow: "Ticket médio",
      value: BRL(data.ticket_medio),
      sub: "Por doação confirmada",
      spark: [],
    },
    {
      eyebrow: "Recorrência",
      value: PCT(data.recorrencia_pct),
      sub: "Doações mensais sobre o total",
      spark: [],
    },
  ];

  const pendencias = [
    data.doacoes_pendentes > 0 && {
      t: `${plural(data.doacoes_pendentes, "doação aguardando", "doações aguardando")} confirmação`,
      s: "Confira os comprovantes e confirme no painel de doações",
      to: "/admin/doacoes?status=pendente",
    },
    data.mensagens_nao_lidas > 0 && {
      t: plural(data.mensagens_nao_lidas, "mensagem não lida", "mensagens não lidas"),
      s: "Contatos de voluntariado, parceria e imprensa",
      to: "/admin/mensagens",
    },
    data.noticias_rascunho > 0 && {
      t: plural(data.noticias_rascunho, "notícia em rascunho", "notícias em rascunho"),
      s: "Revise e publique no painel de notícias",
      to: "/admin/noticias",
    },
  ].filter(Boolean);

  return (
    <AdminLayout label="Dashboard">
      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "end", marginBottom: 32, gap: 16, flexWrap: "wrap" }}
      >
        <div>
          <div className="row gap-8">
            <span className="eyebrow">Painel administrativo</span>
            <span className="tag tag-red tag-dot">Ao vivo</span>
          </div>
          <h1 className="display" style={{ fontSize: 36, margin: "10px 0 4px" }}>
            Visão geral
          </h1>
          <p style={{ color: "var(--ink-3)", margin: 0, fontSize: 14 }}>
            {plural(data.campanhas_ativas, "campanha ativa", "campanhas ativas")} ·{" "}
            {NUM(data.campanhas_arquivadas)} arquivadas
          </p>
        </div>

        <div className="row gap-12" style={{ flexWrap: "wrap" }}>
          <div className="card row gap-8" style={{ padding: 4, background: "var(--bg)" }}>
            {PERIODOS.map((p) => (
              <button
                key={p.id}
                className={"btn btn-sm " + (dias === p.id ? "btn-dark" : "btn-ghost")}
                onClick={() => setDias(p.id)}
              >
                {p.label}
              </button>
            ))}
          </div>
          <button className="btn btn-secondary btn-sm" onClick={exportar} disabled={exportando}>
            <Icon name="download" size={14} /> {exportando ? "Exportando…" : "Exportar CSV"}
          </button>
          <Link to="/admin/campanhas" className="btn btn-primary btn-sm">
            <Icon name="plus" size={14} /> Nova campanha
          </Link>
        </div>
      </div>

      {erro && (
        <div style={{ marginBottom: 20 }}>
          <Notice tone="erro" onDismiss={() => setErro(null)}>
            {erro}
          </Notice>
        </div>
      )}

      <div className="g4">
        {kpis.map((k, i) => (
          <div key={k.eyebrow} className="card" style={{ padding: 22 }}>
            <span className="eyebrow">{k.eyebrow}</span>
            <div
              className="display tnum"
              style={{ fontSize: 32, margin: "14px 0 4px", letterSpacing: "-0.02em" }}
            >
              {k.value}
            </div>
            <div style={{ fontSize: 12, color: "var(--ink-3)" }}>{k.sub}</div>
            <div style={{ marginTop: 14, height: 44 }}>
              <Sparkline data={k.spark} height={44} id={`kpi-${i}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="split-wide" style={{ marginTop: 16 }}>
        <div className="card" style={{ padding: 28 }}>
          <span className="eyebrow">Doações confirmadas por dia · últimos {dias} dias</span>
          <div className="row gap-32" style={{ marginTop: 12, flexWrap: "wrap" }}>
            <div>
              <div className="display tnum" style={{ fontSize: 28 }}>
                {BRL(totalPeriodo)}
              </div>
              <div style={{ fontSize: 12, color: "var(--ink-3)" }}>Total no período</div>
            </div>
            <div>
              <div className="display tnum" style={{ fontSize: 28 }}>
                {BRL(mediaDiaria)}
              </div>
              <div style={{ fontSize: 12, color: "var(--ink-3)" }}>Média diária</div>
            </div>
            <div>
              <div
                className="display tnum"
                style={{
                  fontSize: 28,
                  color: variacao === null ? "var(--ink-3)" : variacao >= 0 ? "var(--red)" : "var(--ink-3)",
                }}
              >
                {variacao === null ? "—" : `${variacao >= 0 ? "+" : ""}${variacao.toFixed(0)}%`}
              </div>
              <div style={{ fontSize: 12, color: "var(--ink-3)" }}>vs. período anterior</div>
            </div>
          </div>

          <div style={{ marginTop: 28 }}>
            <BarChart data={valores} labels={labels} height={240} />
          </div>
        </div>

        <div className="card" style={{ padding: 28 }}>
          <div className="row" style={{ justifyContent: "space-between", marginBottom: 18 }}>
            <span className="eyebrow">Metas ativas</span>
            <Link
              to="/admin/campanhas"
              className="mono"
              style={{
                fontSize: 11,
                color: "var(--red)",
                letterSpacing: ".08em",
                textTransform: "uppercase",
              }}
            >
              Gerenciar
            </Link>
          </div>

          {(data.metas_ativas || []).length === 0 ? (
            <EmptyState title="Nenhuma campanha ativa" />
          ) : (
            <div className="col gap-20">
              {data.metas_ativas.map((g) => (
                <div key={g.id}>
                  <div className="row" style={{ justifyContent: "space-between", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{g.titulo}</div>
                      <div
                        className="mono"
                        style={{
                          fontSize: 11,
                          color: "var(--ink-3)",
                          letterSpacing: ".06em",
                          textTransform: "uppercase",
                          marginTop: 2,
                        }}
                      >
                        prazo · {dataBR(g.prazo)}
                      </div>
                    </div>
                    <div className="display tnum" style={{ fontSize: 20 }}>
                      {Number(g.valor_alvo) > 0 ? PCT(g.progresso_pct) : "—"}
                    </div>
                  </div>
                  <Progress
                    value={Number(g.valor_atual || 0)}
                    max={Number(g.valor_alvo || 0) || 1}
                    label={`Progresso de ${g.titulo}`}
                  />
                  <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 6 }}>
                    {BRL(g.valor_atual)} de {Number(g.valor_alvo) > 0 ? BRL(g.valor_alvo) : "meta aberta"}
                  </div>
                </div>
              ))}
            </div>
          )}

          <Link
            to="/admin/campanhas"
            className="btn btn-secondary btn-sm"
            style={{ width: "100%", marginTop: 24 }}
          >
            <Icon name="plus" size={13} /> Adicionar nova meta
          </Link>
        </div>
      </div>

      <div className="split-wide" style={{ marginTop: 16 }}>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div
            className="row"
            style={{
              justifyContent: "space-between",
              padding: "22px 28px",
              borderBottom: "1px solid var(--line)",
            }}
          >
            <span className="eyebrow">Doações recentes</span>
            <Link
              to="/admin/doacoes"
              className="mono"
              style={{
                fontSize: 11,
                color: "var(--red)",
                letterSpacing: ".08em",
                textTransform: "uppercase",
              }}
            >
              Ver todas
            </Link>
          </div>

          {(data.recentes || []).length === 0 ? (
            <EmptyState title="Nenhuma doação registrada ainda" />
          ) : (
            <div className="table-scroll">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Doador</th>
                    <th>Método</th>
                    <th>Projeto</th>
                    <th>Status</th>
                    <th className="num">Valor</th>
                    <th>Quando</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentes.map((d) => (
                    <tr key={d.id}>
                      <td className="mono" style={{ color: "var(--ink-3)" }}>
                        {d.id}
                      </td>
                      <td style={{ fontWeight: 500 }}>{d.doador_nome}</td>
                      <td>
                        <span className="tag" style={{ fontSize: 10 }}>
                          {d.metodo || "—"}
                        </span>
                      </td>
                      <td style={{ color: "var(--ink-2)" }}>{d.meta_titulo || "—"}</td>
                      <td>
                        <span
                          className={d.status === "confirmada" ? "tag tag-red" : "tag"}
                          style={{ fontSize: 10 }}
                        >
                          {d.status_display}
                        </span>
                      </td>
                      <td className="mono num" style={{ fontWeight: 600 }}>
                        {BRL2(d.valor)}
                      </td>
                      <td className="mono" style={{ color: "var(--ink-3)", fontSize: 12 }}>
                        {dataHoraBR(d.criada_em)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card" style={{ padding: 28 }}>
          <span className="eyebrow">Distribuição por método</span>
          {(data.por_metodo || []).length === 0 ? (
            <p style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 16 }}>
              Sem doações confirmadas para distribuir.
            </p>
          ) : (
            <div className="col gap-16" style={{ marginTop: 22 }}>
              {data.por_metodo.map((m, i) => {
                const pct = totalMetodos > 0 ? (m.total / totalMetodos) * 100 : 0;
                const cor = CORES_METODO[i % CORES_METODO.length];
                return (
                  <div key={m.metodo}>
                    <div className="row" style={{ justifyContent: "space-between", marginBottom: 8 }}>
                      <div className="row gap-8">
                        <span style={{ width: 10, height: 10, background: cor, borderRadius: 2 }} />
                        <strong style={{ fontSize: 14, textTransform: "capitalize" }}>
                          {m.metodo}
                        </strong>
                      </div>
                      <span className="mono tnum" style={{ fontWeight: 600 }}>
                        {pct.toFixed(0)}%
                      </span>
                    </div>
                    <div
                      style={{
                        height: 6,
                        background: "var(--bg-2)",
                        borderRadius: 999,
                        overflow: "hidden",
                      }}
                    >
                      <div style={{ width: pct + "%", height: "100%", background: cor }} />
                    </div>
                    <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 6 }}>
                      {BRL(m.total)} · {plural(m.count, "doação", "doações")}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <hr className="divider" style={{ margin: "28px 0" }} />

          <span className="eyebrow">Próximas ações</span>
          <div className="col gap-12" style={{ marginTop: 14 }}>
            {pendencias.length === 0 && (
              <div style={{ fontSize: 13, color: "var(--ink-3)", padding: "8px 0" }}>
                Nenhuma pendência. Tudo em dia.
              </div>
            )}
            {pendencias.map((a) => (
              <Link
                key={a.t}
                to={a.to}
                className="row"
                style={{
                  justifyContent: "space-between",
                  padding: "12px 14px",
                  background: "var(--bg)",
                  borderRadius: "var(--r-sm)",
                  border: "1px solid var(--line)",
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{a.t}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>{a.s}</div>
                </div>
                <Icon name="chevronRight" size={16} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
