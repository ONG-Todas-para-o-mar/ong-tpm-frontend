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
import { dataBR, plural } from "../../lib/format.js";
import { mensagemDeErro } from "../../lib/api.js";
import {
  useCreateNoticia,
  useDeleteNoticia,
  useMetas,
  useNoticias,
  useUpdateNoticia,
} from "../../hooks/useQueries.js";

const MAX_IMG_MB = 5;

const CATEGORIAS = [
  { id: "transparencia", label: "Transparência" },
  { id: "projeto", label: "Projeto" },
  { id: "formacao", label: "Formação" },
  { id: "parceria", label: "Parceria" },
  { id: "evento", label: "Evento" },
];

const VAZIO = {
  titulo: "",
  resumo: "",
  conteudo: "",
  categoria: "projeto",
  meta: "",
  destaque: false,
  publicada: false,
};

function FormularioNoticia({ noticia, metas, onFechar, onSalvar, salvando }) {
  const [form, setForm] = useState(VAZIO);
  const [imagem, setImagem] = useState(null);
  const [preview, setPreview] = useState(null);
  const [erro, setErro] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (noticia) {
      setForm({
        titulo: noticia.titulo || "",
        resumo: noticia.resumo || "",
        conteudo: noticia.conteudo || "",
        categoria: noticia.categoria || "projeto",
        meta: noticia.meta ? String(noticia.meta) : "",
        destaque: !!noticia.destaque,
        publicada: !!noticia.publicada,
      });
      setPreview(noticia.imagem || null);
    } else {
      setForm(VAZIO);
      setPreview(null);
    }
    setImagem(null);
    setErro(null);
  }, [noticia]);

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

  const enviar = async (e) => {
    e.preventDefault();
    if (form.titulo.trim().length < 4) {
      setErro("O título precisa de pelo menos 4 caracteres.");
      return;
    }
    if (form.publicada && form.resumo.trim().length < 10) {
      setErro("Escreva um resumo antes de publicar — ele aparece nas listagens.");
      return;
    }
    try {
      await onSalvar({ form, imagem });
    } catch (err) {
      setErro(mensagemDeErro(err, "Falha ao salvar a notícia."));
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
          placeholder="Relatório financeiro do quadrimestre"
          value={form.titulo}
          onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          autoFocus
        />
      </div>

      <div>
        <label className="label" htmlFor="resumo">
          Resumo
        </label>
        <textarea
          id="resumo"
          className="textarea"
          rows={2}
          placeholder="Uma ou duas frases que aparecem na listagem e no compartilhamento."
          value={form.resumo}
          onChange={(e) => setForm({ ...form, resumo: e.target.value })}
        />
      </div>

      <div>
        <label className="label" htmlFor="conteudo">
          Conteúdo
        </label>
        <textarea
          id="conteudo"
          className="textarea"
          rows={9}
          placeholder="Texto completo da matéria. Separe parágrafos com uma linha em branco."
          value={form.conteudo}
          onChange={(e) => setForm({ ...form, conteudo: e.target.value })}
        />
        <p className="helper">Parágrafos separados por linha em branco são renderizados na página.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label className="label" htmlFor="categoria">
            Categoria
          </label>
          <select
            id="categoria"
            className="select"
            value={form.categoria}
            onChange={(e) => setForm({ ...form, categoria: e.target.value })}
          >
            {CATEGORIAS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="meta">
            Projeto relacionado (opcional)
          </label>
          <select
            id="meta"
            className="select"
            value={form.meta}
            onChange={(e) => setForm({ ...form, meta: e.target.value })}
          >
            <option value="">Nenhum</option>
            {(metas || []).map((m) => (
              <option key={m.id} value={m.id}>
                {m.titulo}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="imagem">
          Imagem de capa (opcional)
        </label>
        <div className="row gap-12" style={{ alignItems: "center", flexWrap: "wrap" }}>
          {preview && (
            <img
              src={preview}
              alt="Pré-visualização"
              style={{
                width: 120,
                height: 76,
                objectFit: "cover",
                borderRadius: 6,
                border: "1px solid var(--line)",
              }}
            />
          )}
          <input
            id="imagem"
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="input"
            onChange={escolherImagem}
            style={{ padding: 8, maxWidth: 300 }}
          />
        </div>
        <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 4 }}>
          PNG, JPG ou WEBP. Máximo {MAX_IMG_MB}MB.
        </div>
      </div>

      <div className="col gap-12">
        <label className="row gap-8" style={{ cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={form.destaque}
            onChange={(e) => setForm({ ...form, destaque: e.target.checked })}
          />
          <span style={{ fontSize: 13, color: "var(--ink-2)" }}>
            Marcar como <strong className="strong">destaque</strong> na página de notícias
          </span>
        </label>
        <label className="row gap-8" style={{ cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={form.publicada}
            onChange={(e) => setForm({ ...form, publicada: e.target.checked })}
          />
          <span style={{ fontSize: 13, color: "var(--ink-2)" }}>
            Publicar agora (visível no site público)
          </span>
        </label>
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
          ) : noticia ? (
            "Salvar alterações"
          ) : (
            <>
              Criar notícia <Icon name="arrow" size={14} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default function AdminNews() {
  const [filtro, setFiltro] = useState("");
  const [busca, setBusca] = useState("");
  const [editando, setEditando] = useState(null);
  const [formAberto, setFormAberto] = useState(false);
  const [aviso, setAviso] = useState(null);
  const [erro, setErro] = useState(null);

  const { data: noticias, isLoading, isError, refetch } = useNoticias();
  const { data: metas } = useMetas();
  const criar = useCreateNoticia();
  const atualizar = useUpdateNoticia();
  const remover = useDeleteNoticia();

  const visiveis = (noticias || [])
    .filter((n) => {
      if (filtro === "publicada") return n.publicada;
      if (filtro === "rascunho") return !n.publicada;
      return true;
    })
    .filter((n) => !busca.trim() || n.titulo.toLowerCase().includes(busca.trim().toLowerCase()));

  const salvar = async ({ form, imagem }) => {
    setAviso(null);
    setErro(null);

    const base = {
      titulo: form.titulo.trim(),
      resumo: form.resumo,
      conteudo: form.conteudo,
      categoria: form.categoria,
      destaque: form.destaque,
      publicada: form.publicada,
    };

    if (imagem) {
      const fd = new FormData();
      Object.entries(base).forEach(([k, v]) => fd.append(k, typeof v === "boolean" ? String(v) : v));
      if (form.meta) fd.append("meta", form.meta);
      fd.append("imagem", imagem);
      if (editando) await atualizar.mutateAsync({ slug: editando.slug, payload: fd });
      else await criar.mutateAsync(fd);
    } else {
      const payload = { ...base, meta: form.meta ? Number(form.meta) : null };
      if (editando) await atualizar.mutateAsync({ slug: editando.slug, payload });
      else await criar.mutateAsync(payload);
    }

    setFormAberto(false);
    setEditando(null);
    setAviso(editando ? "Notícia atualizada." : "Notícia criada.");
  };

  const alternarPublicacao = async (n) => {
    setErro(null);
    try {
      await atualizar.mutateAsync({ slug: n.slug, payload: { publicada: !n.publicada } });
      setAviso(n.publicada ? "Notícia despublicada." : "Notícia publicada.");
    } catch (err) {
      setErro(mensagemDeErro(err));
    }
  };

  const alternarDestaque = async (n) => {
    setErro(null);
    try {
      await atualizar.mutateAsync({ slug: n.slug, payload: { destaque: !n.destaque } });
    } catch (err) {
      setErro(mensagemDeErro(err));
    }
  };

  const excluir = async (n) => {
    setErro(null);
    if (!confirm(`Excluir "${n.titulo}" definitivamente?`)) return;
    try {
      await remover.mutateAsync(n.slug);
      setAviso("Notícia excluída.");
    } catch (err) {
      setErro(mensagemDeErro(err));
    }
  };

  return (
    <AdminLayout label="Notícias">
      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "end", marginBottom: 28, gap: 16, flexWrap: "wrap" }}
      >
        <div>
          <span className="eyebrow">Conteúdo</span>
          <h1 className="display" style={{ fontSize: 36, margin: "10px 0 4px" }}>
            Notícias
          </h1>
          <p style={{ color: "var(--ink-3)", margin: 0, fontSize: 14 }}>
            Escreva, publique e destaque as matérias que aparecem no site.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditando(null);
            setFormAberto(true);
          }}
        >
          <Icon name="plus" size={15} /> Nova notícia
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
              { id: "publicada", label: "Publicadas" },
              { id: "rascunho", label: "Rascunhos" },
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
              placeholder="Buscar notícia…"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={{ width: 220 }}
              aria-label="Buscar notícia"
            />
            <span className="mono muted" style={{ fontSize: 11, whiteSpace: "nowrap" }}>
              {plural(visiveis.length, "item", "itens")}
            </span>
          </div>
        </div>

        {isLoading && <LoadingState label="Carregando notícias…" />}
        {isError && (
          <div style={{ padding: "32px 16px" }}>
            <ErrorState message="Erro ao carregar as notícias." onRetry={refetch} />
          </div>
        )}

        {!isLoading && !isError && visiveis.length === 0 && (
          <EmptyState
            title="Nenhuma notícia por aqui"
            description="Crie a primeira publicação para alimentar a aba de notícias do site."
            action={
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setEditando(null);
                  setFormAberto(true);
                }}
              >
                <Icon name="plus" size={13} /> Nova notícia
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
                  <th>Publicada em</th>
                  <th>Autor</th>
                  <th style={{ width: 280 }} />
                </tr>
              </thead>
              <tbody>
                {visiveis.map((n) => (
                  <tr key={n.id}>
                    <td>
                      <div className="row gap-12" style={{ alignItems: "center" }}>
                        {n.imagem ? (
                          <img
                            src={n.imagem}
                            alt=""
                            style={{
                              width: 56,
                              height: 40,
                              objectFit: "cover",
                              borderRadius: 6,
                              border: "1px solid var(--line)",
                              flexShrink: 0,
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 56,
                              height: 40,
                              background: "var(--bg-2)",
                              borderRadius: 6,
                              border: "1px solid var(--line)",
                              flexShrink: 0,
                            }}
                          />
                        )}
                        <div>
                          <div className="row gap-8">
                            <span style={{ fontWeight: 600 }}>{n.titulo}</span>
                            {n.destaque && (
                              <span className="tag tag-red" style={{ fontSize: 9 }}>
                                destaque
                              </span>
                            )}
                          </div>
                          <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>
                            /{n.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="tag" style={{ fontSize: 10 }}>
                        {n.categoria_display}
                      </span>
                    </td>
                    <td>
                      <span
                        className={n.publicada ? "tag tag-red tag-dot" : "tag"}
                        style={{ fontSize: 10 }}
                      >
                        {n.publicada ? "Publicada" : "Rascunho"}
                      </span>
                    </td>
                    <td className="mono" style={{ fontSize: 12, color: "var(--ink-3)" }}>
                      {dataBR(n.publicada_em)}
                    </td>
                    <td style={{ fontSize: 13, color: "var(--ink-2)" }}>{n.autor_nome || "—"}</td>
                    <td>
                      <div className="row gap-8" style={{ justifyContent: "flex-end" }}>
                        {n.publicada && (
                          <Link
                            to={`/noticias/${n.slug}`}
                            className="btn btn-ghost btn-sm"
                            title="Ver no site"
                          >
                            <Icon name="eye" size={14} />
                          </Link>
                        )}
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => alternarDestaque(n)}
                          title={n.destaque ? "Remover destaque" : "Marcar destaque"}
                        >
                          <Icon name="star" size={14} />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => {
                            setEditando(n);
                            setFormAberto(true);
                          }}
                          title="Editar"
                        >
                          <Icon name="edit" size={14} />
                        </button>
                        <button
                          className={n.publicada ? "btn btn-secondary btn-sm" : "btn btn-dark btn-sm"}
                          onClick={() => alternarPublicacao(n)}
                          disabled={atualizar.isPending}
                        >
                          {n.publicada ? "Despublicar" : "Publicar"}
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => excluir(n)}
                          title="Excluir"
                        >
                          <Icon name="trash" size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {formAberto && (
        <Modal
          title={editando ? `Editar · ${editando.titulo}` : "Nova notícia"}
          width={780}
          onClose={() => {
            setFormAberto(false);
            setEditando(null);
          }}
        >
          <FormularioNoticia
            noticia={editando}
            metas={metas}
            salvando={criar.isPending || atualizar.isPending}
            onFechar={() => {
              setFormAberto(false);
              setEditando(null);
            }}
            onSalvar={salvar}
          />
        </Modal>
      )}
    </AdminLayout>
  );
}
