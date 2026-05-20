import { useState } from "react";
import Icon from "./Icon.jsx";
import { BRL } from "../lib/format.js";
import { TPM_RANKING } from "../data/mock.js";

const PERIODS = [
  { id: "mes", label: "Este mês" },
  { id: "tri", label: "Trimestre" },
  { id: "ano", label: "2026" },
  { id: "all", label: "Todos os tempos" },
];

export default function RankingTable({ isAdmin = false }) {
  const [period, setPeriod] = useState("ano");
  const [query, setQuery] = useState("");

  const list = TPM_RANKING.filter(
    (r) => !query || r.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      {/* Filters */}
      <div
        className="row gap-12"
        style={{ padding: "16px 0 24px", borderBottom: "1px solid var(--line)", flexWrap: "wrap" }}
      >
        <div className="row gap-8">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              className={"btn btn-sm " + (period === p.id ? "btn-dark" : "btn-ghost")}
              onClick={() => setPeriod(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="spacer" />
        <div style={{ position: "relative", width: 280 }}>
          <Icon
            name="search"
            size={15}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--ink-3)",
            }}
          />
          <input
            className="input"
            placeholder="Buscar doador…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ paddingLeft: 36 }}
          />
        </div>
      </div>

      {/* Headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "60px 1fr 140px 140px 120px 100px",
          gap: 16,
          padding: "16px 20px",
          background: isAdmin ? "var(--bg)" : "transparent",
          borderBottom: "1px solid var(--line)",
        }}
      >
        {["#", "Doador", "Tier", "Doações", "Total", ""].map((h, i) => (
          <div
            key={i}
            className="mono"
            style={{
              fontSize: 10,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              fontWeight: 600,
              color: "var(--ink-3)",
              textAlign: i === 4 ? "right" : "left",
            }}
          >
            {h}
          </div>
        ))}
      </div>

      {/* Rows */}
      <div>
        {list.map((r) => {
          const isTop = r.rank <= 3;
          return (
            <div
              key={r.rank}
              style={{
                display: "grid",
                gridTemplateColumns: "60px 1fr 140px 140px 120px 100px",
                gap: 16,
                padding: "20px",
                borderBottom: "1px solid var(--line)",
                alignItems: "center",
                background: isTop ? "color-mix(in oklch, var(--red) 4%, transparent)" : "transparent",
                transition: "background .15s",
              }}
            >
              <div
                className="display tnum"
                style={{ fontSize: 26, fontWeight: 500, color: isTop ? "var(--red)" : "var(--ink-3)" }}
              >
                {String(r.rank).padStart(2, "0")}
              </div>
              <div className="row gap-12">
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "var(--r-sm)",
                    background: isTop ? "var(--red)" : "var(--bg-2)",
                    color: isTop ? "white" : "var(--ink-2)",
                    display: "grid",
                    placeItems: "center",
                    fontFamily: "var(--f-display)",
                    fontSize: 15,
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {r.name.split(/[\s(]/)[0][0]}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{r.name}</div>
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
                    doador desde {r.since}
                  </div>
                </div>
              </div>
              <div>
                <span className={"tag " + (isTop ? "tag-red" : "")}>
                  <Icon name="medal" size={12} /> {r.badge}
                </span>
              </div>
              <div className="mono tnum" style={{ color: "var(--ink-2)" }}>
                {r.donations} doações
              </div>
              <div className="mono tnum" style={{ textAlign: "right", fontWeight: 600, fontSize: 15 }}>
                {BRL(r.total)}
              </div>
              <div style={{ textAlign: "right" }}>
                {isAdmin ? (
                  <button className="btn btn-ghost btn-sm">Detalhes</button>
                ) : (
                  <span
                    className="mono"
                    style={{
                      fontSize: 11,
                      color: "var(--ink-3)",
                      letterSpacing: ".06em",
                      textTransform: "uppercase",
                    }}
                  >
                    #{String(r.rank).padStart(3, "0")}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {list.length === 0 && (
        <div style={{ padding: "48px 20px", textAlign: "center", color: "var(--ink-3)", fontSize: 14 }}>
          Ranking ainda não disponível.
        </div>
      )}

      {list.length > 0 && (
        <div className="row" style={{ justifyContent: "space-between", padding: "24px 20px" }}>
          <span className="mono muted" style={{ fontSize: 12 }}>
            Mostrando 1–{list.length}
          </span>
          <div className="row gap-8">
            <button className="btn btn-secondary btn-sm" disabled style={{ opacity: 0.5 }}>
              <Icon name="arrowLeft" size={14} /> Anteriores
            </button>
            <button className="btn btn-secondary btn-sm">
              Próximos <Icon name="arrow" size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
