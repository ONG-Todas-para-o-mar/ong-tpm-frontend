import { useState } from "react";
import Icon from "../../components/Icon.jsx";
import { AdminLayout } from "../../components/Charts.jsx";
import {
  Avatar,
  EmptyState,
  ErrorState,
  LoadingState,
  Notice,
} from "../../components/Shared.jsx";
import { NUM, dataHoraBR, plural } from "../../lib/format.js";
import { mensagemDeErro } from "../../lib/api.js";
import {
  useDeleteMensagem,
  useMensagens,
  useUpdateMensagem,
} from "../../hooks/useQueries.js";

const FILTROS = [
  { id: "", label: "Todas" },
  { id: "nao-lidas", label: "Não lidas" },
  { id: "pendentes", label: "Sem resposta" },
];

const ASSUNTOS = [
  { id: "", label: "Todos os assuntos" },
  { id: "voluntariado", label: "Voluntariado" },
  { id: "parceria", label: "Parceria" },
  { id: "imprensa", label: "Imprensa" },
  { id: "doacoes", label: "Doações" },
  { id: "outro", label: "Outro" },
];

export default function AdminMessages() {
  const [filtro, setFiltro] = useState("");
  const [assunto, setAssunto] = useState("");
  const [aberta, setAberta] = useState(null);
  const [aviso, setAviso] = useState(null);
  const [erro, setErro] = useState(null);

  const params = {};
  if (filtro === "nao-lidas") params.lida = "false";
  if (filtro === "pendentes") params.respondida = "false";
  if (assunto) params.assunto = assunto;

  const { data: mensagens, isLoading, isError, refetch } = useMensagens(params);
  const atualizar = useUpdateMensagem();
  const remover = useDeleteMensagem();

  const alternar = async (m, campo) => {
    setErro(null);
    try {
      await atualizar.mutateAsync({ id: m.id, payload: { [campo]: !m[campo] } });
    } catch (err) {
      setErro(mensagemDeErro(err));
    }
  };

  const abrir = async (m) => {
    setAberta(aberta === m.id ? null : m.id);
    if (!m.lida) {
      try {
        await atualizar.mutateAsync({ id: m.id, payload: { lida: true } });
      } catch {
        // marcar como lida é secundário; o conteúdo já está aberto
      }
    }
  };

  const excluir = async (m) => {
    setErro(null);
    if (!confirm(`Excluir a mensagem de ${m.nome}?`)) return;
    try {
      await remover.mutateAsync(m.id);
      setAviso("Mensagem excluída.");
    } catch (err) {
      setErro(mensagemDeErro(err));
    }
  };

  const lista = mensagens || [];
  const naoLidas = lista.filter((m) => !m.lida).length;

  return (
    <AdminLayout label="Mensagens">
      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "end", marginBottom: 28, gap: 16, flexWrap: "wrap" }}
      >
        <div>
          <span className="eyebrow">Relacionamento</span>
          <h1 className="display" style={{ fontSize: 36, margin: "10px 0 4px" }}>
            Mensagens de contato
          </h1>
          <p style={{ color: "var(--ink-3)", margin: 0, fontSize: 14 }}>
            {plural(lista.length, "mensagem listada", "mensagens listadas")} · {NUM(naoLidas)} não lidas
          </p>
        </div>
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
          <div className="row gap-8">
            {FILTROS.map((f) => (
              <button
                key={f.id || "todas"}
                className={"btn btn-sm " + (filtro === f.id ? "btn-dark" : "btn-ghost")}
                onClick={() => setFiltro(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <select
            className="select"
            value={assunto}
            onChange={(e) => setAssunto(e.target.value)}
            style={{ width: 220 }}
            aria-label="Filtrar por assunto"
          >
            {ASSUNTOS.map((a) => (
              <option key={a.id || "todos"} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        </div>

        {isLoading && <LoadingState label="Carregando mensagens…" />}
        {isError && (
          <div style={{ padding: "32px 16px" }}>
            <ErrorState message="Erro ao carregar as mensagens." onRetry={refetch} />
          </div>
        )}

        {!isLoading && !isError && lista.length === 0 && (
          <EmptyState
            title="Caixa vazia"
            description="As mensagens enviadas pelo formulário de contato aparecem aqui."
          />
        )}

        <div>
          {lista.map((m) => (
            <div key={m.id} style={{ borderBottom: "1px solid var(--line)" }}>
              <div
                className="row"
                style={{
                  padding: "18px 24px",
                  gap: 16,
                  justifyContent: "space-between",
                  background: m.lida ? "transparent" : "color-mix(in oklch, var(--red) 4%, transparent)",
                  cursor: "pointer",
                }}
                onClick={() => abrir(m)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && abrir(m)}
              >
                <div className="row gap-12" style={{ minWidth: 0 }}>
                  <Avatar nome={m.nome} size={36} destaque={!m.lida} />
                  <div style={{ minWidth: 0 }}>
                    <div className="row gap-8" style={{ flexWrap: "wrap" }}>
                      <strong style={{ fontSize: 14 }}>{m.nome}</strong>
                      {m.organizacao && (
                        <span className="mono muted" style={{ fontSize: 11 }}>
                          {m.organizacao}
                        </span>
                      )}
                      <span className="tag" style={{ fontSize: 10 }}>
                        {m.assunto_display}
                      </span>
                      {!m.lida && (
                        <span className="tag tag-red tag-dot" style={{ fontSize: 10 }}>
                          nova
                        </span>
                      )}
                      {m.respondida && (
                        <span className="tag" style={{ fontSize: 10 }}>
                          respondida
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "var(--ink-3)",
                        marginTop: 4,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: aberta === m.id ? "normal" : "nowrap",
                      }}
                    >
                      {m.mensagem}
                    </div>
                  </div>
                </div>
                <div className="row gap-12" style={{ flexShrink: 0 }}>
                  <span className="mono muted" style={{ fontSize: 11 }}>
                    {dataHoraBR(m.criada_em)}
                  </span>
                  <Icon name={aberta === m.id ? "chevronDown" : "chevronRight"} size={16} />
                </div>
              </div>

              {aberta === m.id && (
                <div style={{ padding: "0 24px 22px 72px" }}>
                  <div
                    style={{
                      padding: 18,
                      background: "var(--bg)",
                      border: "1px solid var(--line)",
                      borderRadius: "var(--r-sm)",
                      fontSize: 14,
                      lineHeight: 1.6,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {m.mensagem}
                  </div>
                  <div className="row gap-8" style={{ marginTop: 16, flexWrap: "wrap" }}>
                    <a
                      className="btn btn-primary btn-sm"
                      href={`mailto:${m.email}?subject=${encodeURIComponent(
                        `Re: ${m.assunto_display} — TPM`
                      )}`}
                    >
                      <Icon name="mail" size={13} /> Responder por e-mail
                    </a>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => alternar(m, "respondida")}
                    >
                      <Icon name="check" size={13} />{" "}
                      {m.respondida ? "Marcar como não respondida" : "Marcar como respondida"}
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => alternar(m, "lida")}>
                      {m.lida ? "Marcar como não lida" : "Marcar como lida"}
                    </button>
                    <div className="spacer" />
                    <button className="btn btn-ghost btn-sm" onClick={() => excluir(m)}>
                      <Icon name="trash" size={13} />
                    </button>
                  </div>
                  <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 12 }}>
                    {m.email}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
