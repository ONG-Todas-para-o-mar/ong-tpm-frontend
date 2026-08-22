import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Icon from "../../components/Icon.jsx";
import { AdminLayout } from "../../components/Charts.jsx";
import {
  Avatar,
  EmptyState,
  ErrorState,
  LoadingState,
  Notice,
  Spinner,
} from "../../components/Shared.jsx";
import { BRL, BRL2, dataHoraBR, plural } from "../../lib/format.js";
import { baixarArquivo, mensagemDeErro } from "../../lib/api.js";
import {
  useConfirmarDoacao,
  useDoacoes,
  useFalharDoacao,
  useMetas,
} from "../../hooks/useQueries.js";

const STATUS = [
  { id: "", label: "Todas" },
  { id: "pendente", label: "Pendentes" },
  { id: "confirmada", label: "Confirmadas" },
  { id: "falha", label: "Falhas" },
];

export default function AdminDonations() {
  const [params, setParams] = useSearchParams();
  const [status, setStatus] = useState(params.get("status") || "");
  const [meta, setMeta] = useState("");
  const [busca, setBusca] = useState("");
  const [aviso, setAviso] = useState(null);
  const [erro, setErro] = useState(null);
  const [exportando, setExportando] = useState(false);

  const filtros = useMemo(
    () => ({ status: status || undefined, meta: meta || undefined }),
    [status, meta]
  );

  const { data: doacoes, isLoading, isError, refetch } = useDoacoes(filtros);
  const { data: metas } = useMetas();
  const confirmar = useConfirmarDoacao();
  const falhar = useFalharDoacao();

  useEffect(() => {
    const proximo = new URLSearchParams(params);
    if (status) proximo.set("status", status);
    else proximo.delete("status");
    setParams(proximo, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const visiveis = (doacoes || []).filter(
    (d) =>
      !busca.trim() ||
      d.doador_nome?.toLowerCase().includes(busca.trim().toLowerCase()) ||
      String(d.id) === busca.trim()
  );

  const totais = visiveis.reduce(
    (acc, d) => {
      const valor = Number(d.valor || 0);
      acc.total += valor;
      if (d.status === "confirmada") acc.confirmado += valor;
      if (d.status === "pendente") acc.pendente += valor;
      return acc;
    },
    { total: 0, confirmado: 0, pendente: 0 }
  );

  const exportar = async () => {
    setErro(null);
    setExportando(true);
    try {
      const query = new URLSearchParams();
      if (status) query.set("status", status);
      if (meta) query.set("meta", meta);
      const sufixo = query.toString() ? `?${query}` : "";
      await baixarArquivo(`/doacoes/exportar/${sufixo}`, "doacoes.csv");
    } catch (err) {
      setErro(mensagemDeErro(err, "Não foi possível exportar o CSV."));
    } finally {
      setExportando(false);
    }
  };

  const aoConfirmar = async (d) => {
    setErro(null);
    if (!confirm(`Confirmar a doação #${d.id} de ${BRL2(d.valor)}? A ação soma no total público.`))
      return;
    try {
      await confirmar.mutateAsync(d.id);
      setAviso(`Doação #${d.id} confirmada. Selos e ranking atualizados.`);
    } catch (err) {
      setErro(mensagemDeErro(err));
    }
  };

  const aoFalhar = async (d) => {
    setErro(null);
    const observacao = prompt("Motivo (opcional):", d.observacao || "");
    if (observacao === null) return;
    try {
      await falhar.mutateAsync({ id: d.id, observacao });
      setAviso(`Doação #${d.id} marcada como falha.`);
    } catch (err) {
      setErro(mensagemDeErro(err));
    }
  };

  return (
    <AdminLayout label="Doações">
      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "end", marginBottom: 28, gap: 16, flexWrap: "wrap" }}
      >
        <div>
          <span className="eyebrow">Financeiro</span>
          <h1 className="display" style={{ fontSize: 36, margin: "10px 0 4px" }}>
            Doações
          </h1>
          <p style={{ color: "var(--ink-3)", margin: 0, fontSize: 14 }}>
            Confirme os recebimentos e acompanhe o que está pendente.
          </p>
        </div>
        <button className="btn btn-secondary" onClick={exportar} disabled={exportando}>
          <Icon name="download" size={15} /> {exportando ? "Exportando…" : "Exportar CSV"}
        </button>
      </div>

      {aviso && (
        <div style={{ marginBottom: 16 }}>
          <Notice tone="sucesso" onDismiss={() => setAviso(null)}>
            {aviso}
          </Notice>
        </div>
      )}
      {erro && (
        <div style={{ marginBottom: 16 }}>
          <Notice tone="erro" onDismiss={() => setErro(null)}>
            {erro}
          </Notice>
        </div>
      )}

      <div className="g3" style={{ marginBottom: 16 }}>
        {[
          { l: "Total listado", v: BRL(totais.total), s: plural(visiveis.length, "registro", "registros") },
          { l: "Confirmado", v: BRL(totais.confirmado), s: "Já somado ao público" },
          { l: "Pendente", v: BRL(totais.pendente), s: "Aguardando conciliação" },
        ].map((k) => (
          <div key={k.l} className="card" style={{ padding: 22 }}>
            <span className="eyebrow">{k.l}</span>
            <div className="display tnum" style={{ fontSize: 30, margin: "12px 0 4px" }}>
              {k.v}
            </div>
            <div style={{ fontSize: 12, color: "var(--ink-3)" }}>{k.s}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div
          className="row"
          style={{
            justifyContent: "space-between",
            padding: "18px 24px",
            borderBottom: "1px solid var(--line)",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div className="row gap-8" style={{ flexWrap: "wrap" }}>
            {STATUS.map((s) => (
              <button
                key={s.id || "todas"}
                className={"btn btn-sm " + (status === s.id ? "btn-dark" : "btn-ghost")}
                onClick={() => setStatus(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="row gap-12" style={{ flexWrap: "wrap" }}>
            <select
              className="select"
              value={meta}
              onChange={(e) => setMeta(e.target.value)}
              style={{ width: 220 }}
              aria-label="Filtrar por projeto"
            >
              <option value="">Todos os projetos</option>
              {(metas || []).map((m) => (
                <option key={m.id} value={m.id}>
                  {m.titulo}
                </option>
              ))}
            </select>
            <input
              className="input"
              placeholder="Buscar doador ou #id…"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={{ width: 220 }}
              aria-label="Buscar doação"
            />
          </div>
        </div>

        {isLoading && <LoadingState label="Carregando doações…" />}
        {isError && (
          <div style={{ padding: "32px 16px" }}>
            <ErrorState message="Erro ao carregar as doações." onRetry={refetch} />
          </div>
        )}

        {!isLoading && !isError && visiveis.length === 0 && (
          <EmptyState
            title="Nenhuma doação neste filtro"
            description="Assim que alguém registrar uma doação, ela aparece aqui para conciliação."
          />
        )}

        {!isLoading && !isError && visiveis.length > 0 && (
          <div className="table-scroll">
            <table className="tbl">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Doador</th>
                  <th>Projeto</th>
                  <th>Método</th>
                  <th>Status</th>
                  <th className="num">Valor</th>
                  <th>Registrada</th>
                  <th style={{ width: 210 }} />
                </tr>
              </thead>
              <tbody>
                {visiveis.map((d) => {
                  const ocupado =
                    (confirmar.isPending && confirmar.variables === d.id) ||
                    (falhar.isPending && falhar.variables?.id === d.id);
                  return (
                    <tr key={d.id}>
                      <td className="mono" style={{ color: "var(--ink-3)" }}>
                        {d.id}
                      </td>
                      <td>
                        <div className="row gap-12">
                          <Avatar nome={d.doador_nome} size={32} />
                          <div>
                            <div style={{ fontWeight: 600 }}>{d.doador_nome}</div>
                            {d.observacao && (
                              <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>
                                {d.observacao}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ color: "var(--ink-2)" }}>{d.meta_titulo || "Livre"}</td>
                      <td>
                        <span className="tag" style={{ fontSize: 10 }}>
                          {d.metodo || "—"}
                        </span>
                        {d.recorrente && (
                          <span className="tag" style={{ fontSize: 10, marginLeft: 6 }}>
                            mensal
                          </span>
                        )}
                      </td>
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
                      <td className="mono" style={{ fontSize: 12, color: "var(--ink-3)" }}>
                        {dataHoraBR(d.criada_em)}
                      </td>
                      <td>
                        <div className="row gap-8" style={{ justifyContent: "flex-end" }}>
                          {d.status !== "confirmada" && (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => aoConfirmar(d)}
                              disabled={ocupado}
                            >
                              {ocupado ? <Spinner size={13} /> : <Icon name="check" size={13} />}{" "}
                              Confirmar
                            </button>
                          )}
                          {d.status === "pendente" && (
                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={() => aoFalhar(d)}
                              disabled={ocupado}
                            >
                              Falha
                            </button>
                          )}
                          {d.status === "confirmada" && (
                            <span className="mono muted" style={{ fontSize: 11 }}>
                              {dataHoraBR(d.confirmada_em)}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
