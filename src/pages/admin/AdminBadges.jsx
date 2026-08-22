import { useEffect, useState } from "react";
import Icon from "../../components/Icon.jsx";
import { AdminLayout } from "../../components/Charts.jsx";
import {
  Avatar,
  EmptyState,
  ErrorState,
  LoadingState,
  Modal,
  Notice,
  Spinner,
} from "../../components/Shared.jsx";
import { BRL, NUM } from "../../lib/format.js";
import { mensagemDeErro } from "../../lib/api.js";
import {
  useAtribuirBadge,
  useBadges,
  useCreateBadge,
  useDeleteBadge,
  useDoadores,
  useUpdateBadge,
} from "../../hooks/useQueries.js";

const TIPOS = [
  { id: "valor", label: "Por valor acumulado" },
  { id: "recorrencia", label: "Por meses de contribuição" },
  { id: "manual", label: "Atribuição manual" },
];

const ICONES = ["medal", "trophy", "wave", "shell", "wing", "star", "heart", "users", "globe"];

const VAZIO = {
  nome: "",
  descricao: "",
  tipo: "valor",
  criterio_valor: "",
  criterio_meses: "",
  icone: "medal",
  cor: "#b3453c",
  ordem: 0,
};

function FormularioSelo({ selo, onFechar, onSalvar, salvando }) {
  const [form, setForm] = useState(VAZIO);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (selo) {
      setForm({
        nome: selo.nome || "",
        descricao: selo.descricao || "",
        tipo: selo.tipo || "valor",
        criterio_valor: selo.criterio_valor ?? "",
        criterio_meses: selo.criterio_meses ?? "",
        icone: selo.icone || "medal",
        cor: selo.cor || "#b3453c",
        ordem: selo.ordem ?? 0,
      });
    } else {
      setForm(VAZIO);
    }
    setErro(null);
  }, [selo]);

  const enviar = async (e) => {
    e.preventDefault();
    if (form.nome.trim().length < 2) {
      setErro("Informe o nome do selo.");
      return;
    }
    if (form.tipo === "recorrencia" && !Number(form.criterio_meses)) {
      setErro("Informe quantos meses de contribuição o selo exige.");
      return;
    }
    try {
      await onSalvar({
        nome: form.nome.trim(),
        descricao: form.descricao,
        tipo: form.tipo,
        criterio_valor: form.tipo === "valor" ? Number(form.criterio_valor || 0) : 0,
        criterio_meses: form.tipo === "recorrencia" ? Number(form.criterio_meses || 0) : 0,
        icone: form.icone,
        cor: form.cor,
        ordem: Number(form.ordem || 0),
      });
    } catch (err) {
      setErro(mensagemDeErro(err, "Falha ao salvar o selo."));
    }
  };

  return (
    <form onSubmit={enviar} style={{ display: "grid", gap: 16 }} noValidate>
      <div>
        <label className="label" htmlFor="nome">
          Nome do selo
        </label>
        <input
          id="nome"
          className="input"
          placeholder="Sócio Maracaípe"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          autoFocus
        />
      </div>

      <div>
        <label className="label" htmlFor="descricao">
          Descrição
        </label>
        <textarea
          id="descricao"
          className="textarea"
          rows={2}
          placeholder="O que este selo reconhece"
          value={form.descricao}
          onChange={(e) => setForm({ ...form, descricao: e.target.value })}
        />
      </div>

      <div>
        <label className="label" htmlFor="tipo">
          Critério
        </label>
        <select
          id="tipo"
          className="select"
          value={form.tipo}
          onChange={(e) => setForm({ ...form, tipo: e.target.value })}
        >
          {TIPOS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {form.tipo === "valor" && (
        <div>
          <label className="label" htmlFor="criterio_valor">
            Valor acumulado mínimo (R$)
          </label>
          <input
            id="criterio_valor"
            className="input"
            type="number"
            min="0"
            step="0.01"
            value={form.criterio_valor}
            onChange={(e) => setForm({ ...form, criterio_valor: e.target.value })}
          />
          <p className="helper">
            Use 1 para o selo de primeira doação. O selo é concedido automaticamente na confirmação.
          </p>
        </div>
      )}

      {form.tipo === "recorrencia" && (
        <div>
          <label className="label" htmlFor="criterio_meses">
            Meses de contribuição recorrente
          </label>
          <input
            id="criterio_meses"
            className="input"
            type="number"
            min="1"
            value={form.criterio_meses}
            onChange={(e) => setForm({ ...form, criterio_meses: e.target.value })}
          />
          <p className="helper">
            Conta meses distintos com doação recorrente confirmada.
          </p>
        </div>
      )}

      {form.tipo === "manual" && (
        <Notice tone="info">
          Selos manuais não são concedidos automaticamente — você atribui a cada doador pela lista da
          página.
        </Notice>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <div>
          <label className="label" htmlFor="icone">
            Ícone
          </label>
          <select
            id="icone"
            className="select"
            value={form.icone}
            onChange={(e) => setForm({ ...form, icone: e.target.value })}
          >
            {ICONES.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="cor">
            Cor
          </label>
          <input
            id="cor"
            className="input"
            type="color"
            value={form.cor}
            onChange={(e) => setForm({ ...form, cor: e.target.value })}
            style={{ padding: 6, height: 44 }}
          />
        </div>
        <div>
          <label className="label" htmlFor="ordem">
            Ordem
          </label>
          <input
            id="ordem"
            className="input"
            type="number"
            min="0"
            value={form.ordem}
            onChange={(e) => setForm({ ...form, ordem: e.target.value })}
          />
        </div>
      </div>

      <div
        className="row gap-12"
        style={{ padding: 16, background: "var(--bg)", borderRadius: "var(--r-sm)" }}
      >
        <div
          className="selo-icone"
          style={{
            background: `${form.cor}1f`,
            color: form.cor,
            borderColor: `${form.cor}55`,
          }}
        >
          <Icon name={form.icone} size={22} />
        </div>
        <div>
          <div style={{ fontWeight: 600 }}>{form.nome || "Prévia do selo"}</div>
          <div style={{ fontSize: 12, color: "var(--ink-3)" }}>
            {form.descricao || "A descrição aparece na página de sócios."}
          </div>
        </div>
      </div>

      {erro && <Notice tone="erro">{erro}</Notice>}

      <div className="row gap-12" style={{ justifyContent: "flex-end", marginTop: 8 }}>
        <button type="button" className="btn btn-ghost" onClick={onFechar}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={salvando}>
          {salvando ? (
            <>
              <Spinner size={14} /> Salvando…
            </>
          ) : selo ? (
            "Salvar alterações"
          ) : (
            "Criar selo"
          )}
        </button>
      </div>
    </form>
  );
}

function PainelAtribuicao({ selo, onFechar }) {
  const [busca, setBusca] = useState("");
  const [aviso, setAviso] = useState(null);
  const [erro, setErro] = useState(null);
  const { data: doadores, isLoading } = useDoadores(busca ? { search: busca } : undefined);
  const atribuir = useAtribuirBadge();

  const conceder = async (doador) => {
    setErro(null);
    try {
      const resposta = await atribuir.mutateAsync({ id: selo.id, doador: doador.id });
      setAviso(resposta.detail);
    } catch (err) {
      setErro(mensagemDeErro(err));
    }
  };

  return (
    <Modal title={`Atribuir · ${selo.nome}`} onClose={onFechar} width={620}>
      <input
        className="input"
        placeholder="Buscar por nome ou e-mail…"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        aria-label="Buscar doador"
      />

      {aviso && (
        <div style={{ marginTop: 16 }}>
          <Notice tone="sucesso" onDismiss={() => setAviso(null)}>
            {aviso}
          </Notice>
        </div>
      )}
      {erro && (
        <div style={{ marginTop: 16 }}>
          <Notice tone="erro" onDismiss={() => setErro(null)}>
            {erro}
          </Notice>
        </div>
      )}

      {isLoading && <LoadingState label="Carregando doadores…" />}

      {!isLoading && (doadores || []).length === 0 && (
        <p style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 20 }}>
          Nenhum doador encontrado.
        </p>
      )}

      <div className="col gap-8" style={{ marginTop: 16, maxHeight: 380, overflowY: "auto" }}>
        {(doadores || []).map((d) => {
          const jaTem = (d.badges || []).some((b) => b.id === selo.id);
          const nome =
            `${d.user?.first_name || ""} ${d.user?.last_name || ""}`.trim() ||
            d.user?.nickname ||
            d.user?.username;
          return (
            <div
              key={d.id}
              className="row"
              style={{
                justifyContent: "space-between",
                padding: "10px 12px",
                border: "1px solid var(--line)",
                borderRadius: "var(--r-sm)",
                gap: 12,
              }}
            >
              <div className="row gap-12">
                <Avatar nome={nome} size={32} destaque={d.socio} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{nome}</div>
                  <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>
                    {d.user?.email} · {BRL(d.total_doado)}
                  </div>
                </div>
              </div>
              <button
                className={jaTem ? "btn btn-ghost btn-sm" : "btn btn-primary btn-sm"}
                onClick={() => conceder(d)}
                disabled={jaTem || atribuir.isPending}
              >
                {jaTem ? "Já possui" : "Atribuir"}
              </button>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}

export default function AdminBadges() {
  const [formAberto, setFormAberto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [atribuindo, setAtribuindo] = useState(null);
  const [aviso, setAviso] = useState(null);
  const [erro, setErro] = useState(null);

  const { data: selos, isLoading, isError, refetch } = useBadges();
  const criar = useCreateBadge();
  const atualizar = useUpdateBadge();
  const remover = useDeleteBadge();

  const salvar = async (payload) => {
    setAviso(null);
    setErro(null);
    if (editando) await atualizar.mutateAsync({ id: editando.id, payload });
    else await criar.mutateAsync(payload);
    setFormAberto(false);
    setEditando(null);
    setAviso(editando ? "Selo atualizado." : "Selo criado.");
  };

  const excluir = async (selo) => {
    setErro(null);
    if (!confirm(`Excluir o selo "${selo.nome}"? Quem já o recebeu perde o registro.`)) return;
    try {
      await remover.mutateAsync(selo.id);
      setAviso("Selo excluído.");
    } catch (err) {
      setErro(mensagemDeErro(err));
    }
  };

  return (
    <AdminLayout label="Selos de sócio">
      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "end", marginBottom: 28, gap: 16, flexWrap: "wrap" }}
      >
        <div>
          <span className="eyebrow">Reconhecimento</span>
          <h1 className="display" style={{ fontSize: 36, margin: "10px 0 4px" }}>
            Selos de sócio
          </h1>
          <p style={{ color: "var(--ink-3)", margin: 0, fontSize: 14 }}>
            Configure os critérios que concedem selos automaticamente e atribua os selos manuais.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditando(null);
            setFormAberto(true);
          }}
        >
          <Icon name="plus" size={15} /> Novo selo
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

      {isLoading && <LoadingState label="Carregando selos…" />}
      {isError && <ErrorState message="Erro ao carregar os selos." onRetry={refetch} />}

      {!isLoading && !isError && (selos || []).length === 0 && (
        <EmptyState
          title="Nenhum selo configurado"
          description="Crie os selos que reconhecem os sócios da ONG."
        />
      )}

      <div className="g2" style={{ gap: 16 }}>
        {(selos || []).map((selo) => (
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
                <Icon name={selo.icone || "medal"} size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <div className="row gap-8" style={{ flexWrap: "wrap" }}>
                  <h2 className="display" style={{ fontSize: 20, margin: 0 }}>
                    {selo.nome}
                  </h2>
                  <span className="tag mono">{selo.tipo_display}</span>
                </div>
                <p style={{ color: "var(--ink-3)", fontSize: 13, margin: "8px 0 0" }}>
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
              <span style={{ color: "var(--ink-3)" }}>
                {selo.tipo === "valor" && `A partir de ${BRL(selo.criterio_valor)}`}
                {selo.tipo === "recorrencia" && `${NUM(selo.criterio_meses)} meses recorrentes`}
                {selo.tipo === "manual" && "Atribuição manual"}
              </span>
              <strong className="mono">{NUM(selo.total_socios || 0)} pessoas</strong>
            </div>

            <div className="row gap-8" style={{ flexWrap: "wrap" }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setEditando(selo);
                  setFormAberto(true);
                }}
              >
                <Icon name="edit" size={13} /> Editar
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => setAtribuindo(selo)}>
                <Icon name="user" size={13} /> Atribuir a alguém
              </button>
              <div className="spacer" />
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => excluir(selo)}
                title="Excluir selo"
              >
                <Icon name="trash" size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {formAberto && (
        <Modal
          title={editando ? `Editar · ${editando.nome}` : "Novo selo"}
          onClose={() => {
            setFormAberto(false);
            setEditando(null);
          }}
        >
          <FormularioSelo
            selo={editando}
            salvando={criar.isPending || atualizar.isPending}
            onFechar={() => {
              setFormAberto(false);
              setEditando(null);
            }}
            onSalvar={salvar}
          />
        </Modal>
      )}

      {atribuindo && (
        <PainelAtribuicao selo={atribuindo} onFechar={() => setAtribuindo(null)} />
      )}
    </AdminLayout>
  );
}
