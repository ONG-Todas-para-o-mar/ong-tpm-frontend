import { useMemo, useState } from "react";
import Icon from "./Icon.jsx";
import { Avatar, EmptyState, ErrorState, LoadingState } from "./Shared.jsx";
import { BRL, NUM, dataBR } from "../lib/format.js";
import { useRanking } from "../hooks/useQueries.js";

const FILTROS = [
  { id: "todos", label: "Todos os doadores" },
  { id: "socios", label: "Somente sócios" },
];

export default function RankingTable({ isAdmin = false }) {
  const [filtro, setFiltro] = useState("todos");
  const [busca, setBusca] = useState("");

  const { data, isLoading, isError, refetch } = useRanking(
    filtro === "socios" ? { socios: "true" } : undefined
  );

  const lista = useMemo(() => {
    const linhas = data || [];
    if (!busca.trim()) return linhas;
    const termo = busca.trim().toLowerCase();
    return linhas.filter((r) => r.name.toLowerCase().includes(termo));
  }, [data, busca]);

  return (
    <>
      <div
        className="row gap-12"
        style={{ padding: "16px 0 24px", borderBottom: "1px solid var(--line)", flexWrap: "wrap" }}
      >
        <div className="row gap-8">
          {FILTROS.map((f) => (
            <button
              key={f.id}
              className={"btn btn-sm " + (filtro === f.id ? "btn-dark" : "btn-ghost")}
              onClick={() => setFiltro(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="spacer" />
        <div style={{ position: "relative", width: 260 }}>
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
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{ paddingLeft: 36 }}
            aria-label="Buscar doador no ranking"
          />
        </div>
      </div>

      {isLoading && <LoadingState label="Carregando ranking…" />}
      {isError && <ErrorState onRetry={refetch} />}

      {!isLoading && !isError && lista.length === 0 && (
        <EmptyState
          title={busca ? "Nenhum doador encontrado" : "Ranking ainda não disponível"}
          description={
            busca
              ? "Tente outro nome."
              : "O ranking passa a listar assim que as primeiras doações forem confirmadas."
          }
        />
      )}

      {!isLoading && !isError && lista.length > 0 && (
        <div className="table-scroll">
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width: 70 }}>#</th>
                <th>Doador</th>
                <th>Selo</th>
                <th>Doações</th>
                <th className="num">Total</th>
                <th style={{ width: 110 }} />
              </tr>
            </thead>
            <tbody>
              {lista.map((r) => {
                const top = r.rank <= 3;
                return (
                  <tr
                    key={r.doador_id}
                    style={{
                      background: top
                        ? "color-mix(in oklch, var(--red) 4%, transparent)"
                        : "transparent",
                    }}
                  >
                    <td>
                      <span
                        className="display tnum"
                        style={{
                          fontSize: 24,
                          fontWeight: 500,
                          color: top ? "var(--red)" : "var(--ink-3)",
                        }}
                      >
                        {String(r.rank).padStart(2, "0")}
                      </span>
                    </td>
                    <td>
                      <div className="row gap-12">
                        <Avatar nome={r.name} destaque={top} />
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
                            doador desde {dataBR(r.since)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="row gap-8" style={{ flexWrap: "wrap" }}>
                        {r.badge ? (
                          <span className={"tag " + (top ? "tag-red" : "")} style={{ fontSize: 10 }}>
                            <Icon name="medal" size={12} /> {r.badge}
                          </span>
                        ) : (
                          <span className="mono muted" style={{ fontSize: 12 }}>
                            —
                          </span>
                        )}
                        {r.socio && (
                          <span className="tag" style={{ fontSize: 10 }}>
                            sócio
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="mono" style={{ color: "var(--ink-2)" }}>
                      {NUM(r.donations_count)}
                    </td>
                    <td className="mono num" style={{ fontWeight: 600, fontSize: 15 }}>
                      {BRL(r.total)}
                    </td>
                    <td className="num">
                      {isAdmin ? (
                        <span className="mono muted" style={{ fontSize: 11 }}>
                          id {r.doador_id}
                        </span>
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
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && lista.length > 0 && (
        <div className="row" style={{ justifyContent: "space-between", padding: "20px 0" }}>
          <span className="mono muted" style={{ fontSize: 12 }}>
            Mostrando {lista.length} {lista.length === 1 ? "posição" : "posições"}
          </span>
          <span className="mono muted" style={{ fontSize: 12 }}>
            Atualizado a cada doação confirmada
          </span>
        </div>
      )}
    </>
  );
}
