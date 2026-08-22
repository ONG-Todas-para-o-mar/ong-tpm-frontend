import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../../components/Icon.jsx";
import { AdminLayout } from "../../components/Charts.jsx";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  Modal,
  Notice,
  Spinner,
} from "../../components/Shared.jsx";
import { BRL2, NUM, PCT, dataBR, plural } from "../../lib/format.js";
import { mensagemDeErro } from "../../lib/api.js";
import {
  useCategorias,
  useCreateImpacto,
  useCreateMeta,
  useDeleteImpacto,
  useDeleteMeta,
  useImpactos,
  useMetas,
  useUpdateMeta,
} from "../../hooks/useQueries.js";

const MAX_IMG_MB = 5;

const VAZIO = {
  titulo: "",
  descricao: "",
  categoria_id: "",
  valor_alvo: "",
  prazo: "",
  regiao: "",
};

function validar(form) {
  if (form.titulo.trim().length < 3) return "O título precisa de pelo menos 3 caracteres.";
  if (!form.categoria_id) return "Selecione uma categoria.";
  if (form.valor_alvo !== "" && Number(form.valor_alvo) < 0) return "Valor-alvo inválido.";
  return null;
}

function FormularioCampanha({ campanha, categorias, onFechar, onSalvar, salvando }) {
  const [form, setForm] = useState(VAZIO);
  const [imagem, setImagem] = useState(null);
  const [preview, setPreview] = useState(null);
  const [erro, setErro] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (campanha) {
      setForm({
        titulo: campanha.titulo || "",
        descricao: campanha.descricao || "",
        categoria_id: campanha.categoria?.id ? String(campanha.categoria.id) : "",
        valor_alvo: campanha.valor_alvo ?? "",
        prazo: campanha.prazo || "",
        regiao: campanha.regiao || "",
      });
      setPreview(campanha.imagem || null);
    } else {
      setForm(VAZIO);
      setPreview(null);
    }
    setImagem(null);
    setErro(null);
  }, [campanha]);

  const escolherImagem = (e) => {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    if (!arquivo.type.startsWith("image/")) {
      setErro("O arquivo precisa ser uma imagem (JPG, PNG ou WEBP).");
      return;
    }
    if (arquivo.size > MAX_IMG_MB * 1024 * 1024) {
      setErro(`Imagem muito grande. Máximo ${MAX_IMG_MB}MB.`);
      return;
    }
    setErro(null);
    setImagem(arquivo);
    setPreview(URL.createObjectURL(arquivo));
  };

  const limparImagem = () => {
    setImagem(null);
    setPreview(campanha?.imagem || null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const enviar = async (e) => {
    e.preventDefault();
    const problema = validar(form);
    if (problema) {
      setErro(problema);
      return;
    }
    try {
      await onSalvar({ form, imagem });
    } catch (err) {
      setErro(mensagemDeErro(err, "Falha ao salvar a campanha."));
    }
  };

  return (
    <form onSubmit={enviar} style={{ display: "grid", gap: 16 }} noValidate>
      <div>
        <label className="label" htmlFor="titulo">
          Título
        </label>
        <input
          id="titulo"
          className="input"
          placeholder="Mutirão na Praia de Maracaípe"
          value={form.titulo}
          onChange={(e) => setForm({ ...form, titulo: e.target.value })}
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
          rows={3}
          placeholder="O que essa campanha faz e quem ela beneficia"
          value={form.descricao}
          onChange={(e) => setForm({ ...form, descricao: e.target.value })}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label className="label" htmlFor="categoria_id">
            Categoria
          </label>
          <select
            id="categoria_id"
            className="select"
            value={form.categoria_id}
            onChange={(e) => setForm({ ...form, categoria_id: e.target.value })}
          >
            <option value="">Selecione…</option>
            {(categorias || []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="regiao">
            Região
          </label>
          <input
            id="regiao"
            className="input"
            placeholder="Maracaípe · PE"
            value={form.regiao}
            onChange={(e) => setForm({ ...form, regiao: e.target.value })}
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label className="label" htmlFor="valor_alvo">
            Valor-alvo (R$)
          </label>
          <input
            id="valor_alvo"
            className="input"
            type="number"
            step="0.01"
            min="0"
            placeholder="0 = meta aberta"
            value={form.valor_alvo}
            onChange={(e) => setForm({ ...form, valor_alvo: e.target.value })}
          />
        </div>
        <div>
          <label className="label" htmlFor="prazo">
            Prazo (opcional)
          </label>
          <input
            id="prazo"
            className="input"
            type="date"
            value={form.prazo || ""}
            onChange={(e) => setForm({ ...form, prazo: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="imagem">
          Foto da campanha (opcional)
        </label>
        {preview ? (
          <div className="row gap-12" style={{ alignItems: "center", flexWrap: "wrap" }}>
            <img
              src={preview}
              alt="Pré-visualização"
              style={{
                width: 96,
                height: 96,
                objectFit: "cover",
                borderRadius: 8,
                border: "1px solid var(--line)",
              }}
            />
            <div style={{ fontSize: 12, color: "var(--ink-3)" }}>
              {imagem ? `${imagem.name} · ${(imagem.size / 1024).toFixed(0)} KB` : "Imagem atual"}
            </div>
            <button type="button" className="btn btn-ghost btn-sm" onClick={limparImagem}>
              {imagem ? "Descartar nova" : "Trocar"}
            </button>
            {!imagem && (
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="input"
                onChange={escolherImagem}
                style={{ padding: 8, maxWidth: 260 }}
                aria-label="Escolher nova imagem"
              />
            )}
          </div>
        ) : (
          <input
            id="imagem"
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="input"
            onChange={escolherImagem}
            style={{ padding: 8 }}
          />
        )}
        <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 4 }}>
          PNG, JPG ou WEBP. Máximo {MAX_IMG_MB}MB.
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
          ) : campanha ? (
            "Salvar alterações"
          ) : (
            <>
              Cadastrar campanha <Icon name="arrow" size={14} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function PainelImpacto({ campanha, onFechar }) {
  const { data: impactos, isLoading } = useImpactos({ meta: campanha.id });
  const criar = useCreateImpacto();
  const remover = useDeleteImpacto();
  const [form, setForm] = useState({ tipo: "", descricao: "", valor_numerico: "", unidade: "" });
  const [erro, setErro] = useState(null);

  const adicionar = async (e) => {
    e.preventDefault();
    setErro(null);
    if (!form.tipo.trim() || !form.descricao.trim()) {
      setErro("Informe o tipo e a descrição do registro.");
      return;
    }
    try {
      await criar.mutateAsync({
        ...form,
        valor_numerico: form.valor_numerico === "" ? null : Number(form.valor_numerico),
        meta: campanha.id,
      });
      setForm({ tipo: "", descricao: "", valor_numerico: "", unidade: "" });
    } catch (err) {
      setErro(mensagemDeErro(err, "Falha ao registrar o impacto."));
    }
  };

  return (
    <Modal title={`Impacto · ${campanha.titulo}`} onClose={onFechar} width={760}>
      <form onSubmit={adicionar} style={{ display: "grid", gap: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label className="label" htmlFor="tipo">
              Tipo do registro
            </label>
            <input
              id="tipo"
              className="input"
              placeholder="Aulas realizadas"
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label className="label" htmlFor="valor_numerico">
                Número
              </label>
              <input
                id="valor_numerico"
                className="input"
                type="number"
                step="0.01"
                placeholder="12"
                value={form.valor_numerico}
                onChange={(e) => setForm({ ...form, valor_numerico: e.target.value })}
              />
            </div>
            <div>
              <label className="label" htmlFor="unidade">
                Unidade
              </label>
              <input
                id="unidade"
                className="input"
                placeholder="aulas"
                value={form.unidade}
                onChange={(e) => setForm({ ...form, unidade: e.target.value })}
              />
            </div>
          </div>
        </div>
        <div>
          <label className="label" htmlFor="descricao-impacto">
            Descrição
          </label>
          <textarea
            id="descricao-impacto"
            className="textarea"
            rows={2}
            placeholder="Turmas de sábado na Baía de Maracaípe"
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          />
        </div>

        {erro && <Notice tone="erro">{erro}</Notice>}

        <div className="row" style={{ justifyContent: "flex-end" }}>
          <button className="btn btn-primary btn-sm" type="submit" disabled={criar.isPending}>
            {criar.isPending ? (
              <>
                <Spinner size={13} /> Registrando…
              </>
            ) : (
              <>
                <Icon name="plus" size={13} /> Adicionar registro
              </>
            )}
          </button>
        </div>
      </form>

      <hr className="divider" style={{ margin: "24px 0" }} />

      {isLoading && <LoadingState label="Carregando registros…" />}

      {!isLoading && (impactos || []).length === 0 && (
        <p style={{ fontSize: 13, color: "var(--ink-3)", margin: 0 }}>
          Nenhum registro de impacto para esta campanha ainda.
        </p>
      )}

      <div className="col gap-12">
        {(impactos || []).map((i) => (
          <div
            key={i.id}
            className="row"
            style={{
              justifyContent: "space-between",
              gap: 16,
              padding: "12px 0",
              borderBottom: "1px solid var(--line)",
            }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                {i.tipo}
                {i.valor_numerico !== null && i.valor_numerico !== undefined && (
                  <span className="mono" style={{ color: "var(--ink-3)", fontWeight: 400 }}>
                    {" "}
                    · {NUM(i.valor_numerico)} {i.unidade}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 4 }}>{i.descricao}</div>
              <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 4 }}>
                {dataBR(i.criado_em)}
              </div>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                if (confirm("Excluir este registro de impacto?")) remover.mutate(i.id);
              }}
              aria-label="Excluir registro"
            >
              <Icon name="trash" size={14} />
            </button>
          </div>
        ))}
      </div>
    </Modal>
  );
}

export default function AdminCampaigns() {
  const [filtro, setFiltro] = useState("");
  const [busca, setBusca] = useState("");
  const [editando, setEditando] = useState(null);
  const [formAberto, setFormAberto] = useState(false);
  const [impactoDe, setImpactoDe] = useState(null);
  const [aviso, setAviso] = useState(null);
  const [erro, setErro] = useState(null);

  const { data: metas, isLoading, isError, error, refetch } = useMetas();
  const { data: categorias } = useCategorias();
  const criar = useCreateMeta();
  const atualizar = useUpdateMeta();
  const remover = useDeleteMeta();

  const visiveis = (metas || [])
    .filter((m) => {
      if (filtro === "ativa") return m.ativa === true;
      if (filtro === "arquivada") return m.ativa === false;
      return true;
    })
    .filter((m) => !busca.trim() || m.titulo.toLowerCase().includes(busca.trim().toLowerCase()));

  const semPermissao = error?.response?.status === 401 || error?.response?.status === 403;

  const abrirNova = () => {
    setEditando(null);
    setFormAberto(true);
  };

  const abrirEdicao = (m) => {
    setEditando(m);
    setFormAberto(true);
  };

  const salvar = async ({ form, imagem }) => {
    setAviso(null);
    setErro(null);
    const base = {
      titulo: form.titulo.trim(),
      descricao: form.descricao || "",
      categoria_id: form.categoria_id,
      valor_alvo: form.valor_alvo === "" ? 0 : form.valor_alvo,
      regiao: form.regiao || "",
    };

    if (imagem) {
      const fd = new FormData();
      Object.entries(base).forEach(([k, v]) => fd.append(k, v));
      if (form.prazo) fd.append("prazo", form.prazo);
      fd.append("imagem", imagem);
      if (editando) {
        await atualizar.mutateAsync({ id: editando.id, payload: fd });
      } else {
        fd.append("ativa", "true");
        await criar.mutateAsync(fd);
      }
    } else {
      const payload = { ...base, prazo: form.prazo || null };
      if (editando) {
        await atualizar.mutateAsync({ id: editando.id, payload });
      } else {
        await criar.mutateAsync({ ...payload, ativa: true });
      }
    }

    setFormAberto(false);
    setEditando(null);
    setAviso(editando ? "Campanha atualizada." : "Campanha cadastrada.");
  };

  const alternarStatus = async (m) => {
    setErro(null);
    if (m.ativa && !confirm(`Arquivar "${m.titulo}"? Ela sai da vitrine pública.`)) return;
    try {
      await atualizar.mutateAsync({ id: m.id, payload: { ativa: !m.ativa } });
      setAviso(m.ativa ? "Campanha arquivada." : "Campanha reativada.");
    } catch (err) {
      setErro(mensagemDeErro(err));
    }
  };

  const excluir = async (m) => {
    setErro(null);
    if (!confirm(`Excluir "${m.titulo}" definitivamente? Prefira arquivar se já houve doações.`))
      return;
    try {
      await remover.mutateAsync(m.id);
      setAviso("Campanha excluída.");
    } catch (err) {
      setErro(
        mensagemDeErro(err, "Não foi possível excluir. Campanhas com histórico devem ser arquivadas.")
      );
    }
  };

  return (
    <AdminLayout label="Campanhas">
      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "end", marginBottom: 28, gap: 16, flexWrap: "wrap" }}
      >
        <div>
          <span className="eyebrow">Gestão</span>
          <h1 className="display" style={{ fontSize: 36, margin: "10px 0 4px" }}>
            Campanhas
          </h1>
          <p style={{ color: "var(--ink-3)", margin: 0, fontSize: 14 }}>
            Cadastre, edite, arquive e registre o impacto das metas da ONG.
          </p>
        </div>
        <button className="btn btn-primary" onClick={abrirNova}>
          <Icon name="plus" size={15} /> Nova campanha
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
            {[
              { id: "", label: "Todas" },
              { id: "ativa", label: "Ativas" },
              { id: "arquivada", label: "Arquivadas" },
            ].map((f) => (
              <button
                key={f.id || "todas"}
                className={"btn btn-sm " + (filtro === f.id ? "btn-dark" : "btn-ghost")}
                onClick={() => setFiltro(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="row gap-12">
            <input
              className="input"
              placeholder="Buscar campanha…"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={{ width: 220 }}
              aria-label="Buscar campanha"
            />
            <span className="mono muted" style={{ fontSize: 11, whiteSpace: "nowrap" }}>
              {plural(visiveis.length, "campanha", "campanhas")}{filtro || busca ? " filtradas" : ""}
            </span>
          </div>
        </div>

        {isLoading && <LoadingState label="Carregando campanhas…" />}
        {isError && (
          <div style={{ padding: "32px 16px" }}>
            <ErrorState
              message={
                semPermissao
                  ? "Sessão sem permissão de administração. Entre novamente."
                  : "Erro ao carregar as campanhas."
              }
              onRetry={refetch}
            />
          </div>
        )}

        {!isLoading && !isError && visiveis.length === 0 && (
          <EmptyState
            title="Nenhuma campanha encontrada"
            description="Cadastre a primeira campanha para ela aparecer na vitrine pública."
            action={
              <button className="btn btn-primary btn-sm" onClick={abrirNova}>
                <Icon name="plus" size={13} /> Nova campanha
              </button>
            }
          />
        )}

        {!isLoading && !isError && visiveis.length > 0 && (
          <div className="table-scroll">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Categoria</th>
                  <th>Status</th>
                  <th>Progresso</th>
                  <th>Prazo</th>
                  <th style={{ width: 260 }} />
                </tr>
              </thead>
              <tbody>
                {visiveis.map((m) => {
                  const ocupado = atualizar.isPending && atualizar.variables?.id === m.id;
                  return (
                    <tr key={m.id}>
                      <td>
                        <div className="row gap-12" style={{ alignItems: "center" }}>
                          {m.imagem ? (
                            <img
                              src={m.imagem}
                              alt=""
                              style={{
                                width: 44,
                                height: 44,
                                objectFit: "cover",
                                borderRadius: 6,
                                border: "1px solid var(--line)",
                                flexShrink: 0,
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: 44,
                                height: 44,
                                background: "var(--bg-2)",
                                borderRadius: 6,
                                border: "1px solid var(--line)",
                                flexShrink: 0,
                              }}
                            />
                          )}
                          <div>
                            <Link to={`/projetos/${m.id}`} style={{ fontWeight: 600 }}>
                              {m.titulo}
                            </Link>
                            {m.regiao && (
                              <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>
                                {m.regiao}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="tag" style={{ fontSize: 10 }}>
                          {m.categoria?.nome || "—"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={m.ativa ? "tag tag-red tag-dot" : "tag"}
                          style={{ fontSize: 10 }}
                        >
                          {m.ativa ? "Ativa" : "Arquivada"}
                        </span>
                      </td>
                      <td>
                        <div className="mono tnum" style={{ fontWeight: 600 }}>
                          {Number(m.valor_alvo) > 0 ? PCT(m.progresso_pct) : "—"}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>
                          {BRL2(m.valor_atual)} / {BRL2(m.valor_alvo)}
                        </div>
                      </td>
                      <td className="mono" style={{ color: "var(--ink-3)", fontSize: 12 }}>
                        {dataBR(m.prazo)}
                      </td>
                      <td>
                        <div className="row gap-8" style={{ justifyContent: "flex-end" }}>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => abrirEdicao(m)}
                            title="Editar campanha"
                          >
                            <Icon name="edit" size={14} />
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => setImpactoDe(m)}
                            title="Registros de impacto"
                          >
                            <Icon name="trend" size={14} />
                          </button>
                          <button
                            className={m.ativa ? "btn btn-secondary btn-sm" : "btn btn-dark btn-sm"}
                            disabled={ocupado}
                            onClick={() => alternarStatus(m)}
                          >
                            {m.ativa ? "Arquivar" : "Reativar"}
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => excluir(m)}
                            title="Excluir campanha"
                          >
                            <Icon name="trash" size={14} />
                          </button>
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

      {formAberto && (
        <Modal
          title={editando ? `Editar · ${editando.titulo}` : "Nova campanha"}
          onClose={() => {
            setFormAberto(false);
            setEditando(null);
          }}
        >
          <FormularioCampanha
            campanha={editando}
            categorias={categorias}
            salvando={criar.isPending || atualizar.isPending}
            onFechar={() => {
              setFormAberto(false);
              setEditando(null);
            }}
            onSalvar={salvar}
          />
        </Modal>
      )}

      {impactoDe && <PainelImpacto campanha={impactoDe} onFechar={() => setImpactoDe(null)} />}
    </AdminLayout>
  );
}
