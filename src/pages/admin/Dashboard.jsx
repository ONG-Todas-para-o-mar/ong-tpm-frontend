import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../../components/Icon.jsx";
import { Progress } from "../../components/Shared.jsx";
import { Sparkline, BarChart, AdminLayout } from "../../components/Charts.jsx";
import { BRL } from "../../lib/format.js";
import {
  TPM_CHART,
  TPM_CHART_LABELS,
  TPM_GOALS,
  TPM_RECENT_DONATIONS,
} from "../../data/mock.js";

const RANGES = ["7d", "14d", "30d", "90d", "Ano"];

const METHOD_BREAKDOWN = [
  { name: "PIX", v: 0, c: "var(--red)" },
  { name: "Cartão", v: 0, c: "var(--ink)" },
  { name: "Boleto", v: 0, c: "var(--line-strong)" },
];

const NEXT_ACTIONS = [];

export default function Dashboard() {
  const [range, setRange] = useState("14d");

  const totalPeriod = TPM_CHART.reduce((a, b) => a + b, 0);
  const avgDaily = TPM_CHART.length > 0 ? Math.round(totalPeriod / TPM_CHART.length) : 0;
  const lastWeek = TPM_CHART.slice(-7).reduce((a, b) => a + b, 0);
  const prevWeek = TPM_CHART.slice(0, 7).reduce((a, b) => a + b, 0);
  const wow = prevWeek > 0 ? ((lastWeek - prevWeek) / prevWeek) * 100 : 0;

  const kpis = [
    {
      eyebrow: "Total arrecadado",
      value: "—",
      sub: "Acumulado",
      delta: "",
      spark: TPM_CHART,
    },
    {
      eyebrow: "Doadores ativos",
      value: "—",
      sub: "Pessoas e empresas",
      delta: "",
      spark: [],
    },
    {
      eyebrow: "Ticket médio",
      value: "—",
      sub: "Doação média",
      delta: "",
      spark: [],
    },
    {
      eyebrow: "Recorrência",
      value: "—",
      sub: "Mensais sobre total",
      delta: "",
      spark: [],
    },
  ];

  return (
    <AdminLayout label="Dashboard">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "end", marginBottom: 32 }}>
        <div>
          <div className="row gap-8">
            <span className="eyebrow">Painel administrativo</span>
            <span className="tag tag-red tag-dot">Ao vivo</span>
          </div>
          <h1 className="display" style={{ fontSize: 38, margin: "10px 0 4px" }}>
            Visão geral
          </h1>
          <p style={{ color: "var(--ink-3)", margin: 0, fontSize: 14 }}>
            Sem dados disponíveis no momento.
          </p>
        </div>

        <div className="row gap-12">
          <div className="card row gap-8" style={{ padding: 4, background: "var(--bg)" }}>
            {RANGES.map((r) => (
              <button
                key={r}
                className={"btn btn-sm " + (range === r ? "btn-dark" : "btn-ghost")}
                onClick={() => setRange(r)}
              >
                {r}
              </button>
            ))}
          </div>
          <button className="btn btn-secondary btn-sm">
            <Icon name="upload" size={14} /> Exportar
          </button>
          <Link to="/admin/campanhas" className="btn btn-primary btn-sm">
            <Icon name="plus" size={14} /> Nova campanha
          </Link>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {kpis.map((k, i) => (
          <div key={i} className="card" style={{ padding: 22 }}>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <span className="eyebrow">{k.eyebrow}</span>
              <span className="mono" style={{ fontSize: 11, color: "var(--red)", fontWeight: 600 }}>
                {k.delta}
              </span>
            </div>
            <div
              className="display tnum"
              style={{ fontSize: 36, margin: "14px 0 4px", letterSpacing: "-0.02em" }}
            >
              {k.value}
            </div>
            <div style={{ fontSize: 12, color: "var(--ink-3)" }}>{k.sub}</div>
            <div style={{ marginTop: 14, height: 44 }}>
              <Sparkline data={k.spark} height={44} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16, marginTop: 16 }}>
        <div className="card" style={{ padding: 28 }}>
          <div className="row" style={{ justifyContent: "space-between", marginBottom: 4 }}>
            <div>
              <span className="eyebrow">Doações por dia · últimos 14 dias</span>
              <div className="row gap-24" style={{ marginTop: 12 }}>
                <div>
                  <div className="display tnum" style={{ fontSize: 32 }}>—</div>
                  <div style={{ fontSize: 12, color: "var(--ink-3)" }}>Total no período</div>
                </div>
                <div>
                  <div className="display tnum" style={{ fontSize: 32 }}>—</div>
                  <div style={{ fontSize: 12, color: "var(--ink-3)" }}>Média diária</div>
                </div>
                <div>
                  <div className="display tnum" style={{ fontSize: 32, color: "var(--ink-3)" }}>—</div>
                  <div style={{ fontSize: 12, color: "var(--ink-3)" }}>vs. semana anterior</div>
                </div>
              </div>
            </div>
            <div className="row gap-8">
              <span className="row gap-8" style={{ fontSize: 12, color: "var(--ink-3)" }}>
                <span style={{ width: 10, height: 10, background: "var(--red)", borderRadius: 2 }} /> Hoje
              </span>
              <span className="row gap-8" style={{ fontSize: 12, color: "var(--ink-3)" }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    background: "var(--bg-2)",
                    border: "1px solid var(--line)",
                    borderRadius: 2,
                  }}
                />{" "}
                Anteriores
              </span>
            </div>
          </div>

          <div style={{ marginTop: 28 }}>
            <BarChart data={TPM_CHART} labels={TPM_CHART_LABELS} height={240} />
          </div>
        </div>

        <div className="card" style={{ padding: 28 }}>
          <div className="row" style={{ justifyContent: "space-between", marginBottom: 18 }}>
            <span className="eyebrow">Metas ativas</span>
            <a
              className="mono"
              style={{
                fontSize: 11,
                color: "var(--red)",
                cursor: "pointer",
                letterSpacing: ".08em",
                textTransform: "uppercase",
              }}
            >
              Gerenciar
            </a>
          </div>
          <div className="col gap-20">
            {TPM_GOALS.map((g, i) => {
              const pct = g.goal > 0 ? Math.round((g.raised / g.goal) * 100) : 0;
              return (
                <div key={i}>
                  <div className="row" style={{ justifyContent: "space-between", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{g.name}</div>
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
                        prazo · {g.deadline}
                      </div>
                    </div>
                    <div className="display tnum" style={{ fontSize: 22 }}>
                      {pct}%
                    </div>
                  </div>
                  <Progress value={g.raised} max={g.goal} />
                </div>
              );
            })}
          </div>

          <button className="btn btn-secondary btn-sm" style={{ width: "100%", marginTop: 24 }}>
            <Icon name="plus" size={13} /> Adicionar nova meta
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16, marginTop: 16 }}>
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
            <a
              className="mono"
              style={{
                fontSize: 11,
                color: "var(--red)",
                cursor: "pointer",
                letterSpacing: ".08em",
                textTransform: "uppercase",
              }}
            >
              Ver todas
            </a>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "var(--bg)" }}>
                {["#", "Doador", "Método", "Projeto", "Valor", "Quando"].map((h) => (
                  <th
                    key={h}
                    className="mono"
                    style={{
                      textAlign: h === "Valor" ? "right" : "left",
                      padding: "10px 16px",
                      fontSize: 10,
                      letterSpacing: ".1em",
                      textTransform: "uppercase",
                      fontWeight: 600,
                      color: "var(--ink-3)",
                      borderBottom: "1px solid var(--line)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TPM_RECENT_DONATIONS.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: "32px 16px", textAlign: "center", color: "var(--ink-3)", fontSize: 13 }}>
                    Nenhuma doação registrada ainda.
                  </td>
                </tr>
              )}
              {TPM_RECENT_DONATIONS.map((d, i) => (
                <tr
                  key={d.id}
                  style={{
                    borderBottom:
                      i === TPM_RECENT_DONATIONS.length - 1 ? "none" : "1px solid var(--line)",
                  }}
                >
                  <td className="mono" style={{ padding: "14px 16px", color: "var(--ink-3)" }}>
                    {d.id}
                  </td>
                  <td style={{ padding: "14px 16px", fontWeight: 500 }}>{d.name}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span className="tag" style={{ fontSize: 10 }}>
                      {d.method}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", color: "var(--ink-2)" }}>{d.project}</td>
                  <td
                    className="mono"
                    style={{ padding: "14px 16px", textAlign: "right", fontWeight: 600 }}
                  >
                    {BRL(d.amount)}
                  </td>
                  <td
                    className="mono"
                    style={{ padding: "14px 16px", color: "var(--ink-3)", fontSize: 12 }}
                  >
                    {d.at}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card" style={{ padding: 28 }}>
          <span className="eyebrow">Distribuição por método</span>
          <div className="col gap-16" style={{ marginTop: 22 }}>
            {METHOD_BREAKDOWN.map((m) => (
              <div key={m.name}>
                <div className="row" style={{ justifyContent: "space-between", marginBottom: 8 }}>
                  <div className="row gap-8">
                    <span style={{ width: 10, height: 10, background: m.c, borderRadius: 2 }} />
                    <strong style={{ fontSize: 14 }}>{m.name}</strong>
                  </div>
                  <span className="mono tnum" style={{ fontWeight: 600 }}>
                    {m.v}%
                  </span>
                </div>
                <div style={{ height: 6, background: "var(--bg-2)", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ width: m.v + "%", height: "100%", background: m.c }} />
                </div>
              </div>
            ))}
          </div>

          <hr className="divider" style={{ margin: "28px 0" }} />

          <span className="eyebrow">Próximas ações</span>
          <div className="col gap-12" style={{ marginTop: 14 }}>
            {NEXT_ACTIONS.length === 0 && (
              <div style={{ fontSize: 13, color: "var(--ink-3)", padding: "8px 0" }}>
                Nenhuma ação pendente.
              </div>
            )}
            {NEXT_ACTIONS.map((a, i) => (
              <div
                key={i}
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
