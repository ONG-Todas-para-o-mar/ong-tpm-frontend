import { useEffect, useState } from "react";
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
  useCreatePostInstagram,
  useCreateVideo,
  useDeletePostInstagram,
  useDeleteVideo,
  usePostsInstagram,
  useUpdatePostInstagram,
  useUpdateVideo,
  useVideos,
} from "../../hooks/useQueries.js";

const VIDEO_VAZIO = {
  titulo: "",
  youtube_id: "",
  veiculo: "",
  descricao: "",
  publicado_em: "",
  ordem: 0,
  publicado: true,
};

const POST_VAZIO = { url: "", legenda: "", publicado_em: "", ordem: 0, publicado: true };

function FormularioVideo({ video, onFechar, onSalvar, salvando }) {
  const [form, setForm] = useState(VIDEO_VAZIO);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    setForm(
      video
        ? {
            titulo: video.titulo || "",
            youtube_id: video.youtube_id || "",
            veiculo: video.veiculo || "",
            descricao: video.descricao || "",
            publicado_em: video.publicado_em || "",
            ordem: video.ordem ?? 0,
            publicado: !!video.publicado,
          }
        : VIDEO_VAZIO
    );
    setErro(null);
  }, [video]);

  const enviar = async (e) => {
    e.preventDefault();
    if (form.titulo.trim().length < 3) {
      setErro("Informe o título do vídeo.");
      return;
    }
    if (!form.youtube_id.trim()) {
      setErro("Cole o link do vídeo no YouTube.");
      return;
    }
    try {
      await onSalvar({
        ...form,
        titulo: form.titulo.trim(),
        youtube_id: form.youtube_id.trim(),
        publicado_em: form.publicado_em || null,
        ordem: Number(form.ordem || 0),
      });
    } catch (err) {
      setErro(mensagemDeErro(err, "Falha ao salvar o vídeo."));
    }
  };

  return (
    <form onSubmit={enviar} style={{ display: "grid", gap: 16 }} noValidate>
      <div>
        <label className="label" htmlFor="video-link">
          Link do YouTube
        </label>
        <input
          id="video-link"
          className="input"
          placeholder="https://www.youtube.com/watch?v=..."
          value={form.youtube_id}
          onChange={(e) => setForm({ ...form, youtube_id: e.target.value })}
          autoFocus
        />
        <p className="helper">
          Pode colar o endereço inteiro — o sistema guarda só o identificador do vídeo.
        </p>
      </div>

      <div>
        <label className="label" htmlFor="video-titulo">
          Título
        </label>
        <input
          id="video-titulo"
          className="input"
          placeholder="Maré Feminina | Canal OFF"
          value={form.titulo}
          onChange={(e) => setForm({ ...form, titulo: e.target.value })}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 90px", gap: 12 }}>
        <div>
          <label className="label" htmlFor="video-veiculo">
            Veículo
          </label>
          <input
            id="video-veiculo"
            className="input"
            placeholder="Canal OFF"
            value={form.veiculo}
            onChange={(e) => setForm({ ...form, veiculo: e.target.value })}
          />
        </div>
        <div>
          <label className="label" htmlFor="video-data">
            Data
          </label>
          <input
            id="video-data"
            className="input"
            type="date"
            value={form.publicado_em || ""}
            onChange={(e) => setForm({ ...form, publicado_em: e.target.value })}
          />
        </div>
        <div>
          <label className="label" htmlFor="video-ordem">
            Ordem
          </label>
          <input
            id="video-ordem"
            className="input"
            type="number"
            min="0"
            value={form.ordem}
            onChange={(e) => setForm({ ...form, ordem: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="video-descricao">
          Descrição (opcional)
        </label>
        <textarea
          id="video-descricao"
          className="textarea"
          rows={2}
          value={form.descricao}
          onChange={(e) => setForm({ ...form, descricao: e.target.value })}
        />
      </div>

      <label className="row gap-8" style={{ cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={form.publicado}
          onChange={(e) => setForm({ ...form, publicado: e.target.checked })}
        />
        <span style={{ fontSize: 13, color: "var(--ink-2)" }}>Visível no site</span>
      </label>

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
          ) : video ? (
            "Salvar alterações"
          ) : (
            "Adicionar vídeo"
          )}
        </button>
      </div>
    </form>
  );
}

function FormularioPost({ post, onFechar, onSalvar, salvando }) {
  const [form, setForm] = useState(POST_VAZIO);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    setForm(
      post
        ? {
            url: post.url || "",
            legenda: post.legenda || "",
            publicado_em: post.publicado_em || "",
            ordem: post.ordem ?? 0,
            publicado: !!post.publicado,
          }
        : POST_VAZIO
    );
    setErro(null);
  }, [post]);

  const enviar = async (e) => {
    e.preventDefault();
    if (!form.url.trim()) {
      setErro("Cole o link da publicação.");
      return;
    }
    try {
      await onSalvar({
        ...form,
        url: form.url.trim(),
        publicado_em: form.publicado_em || null,
        ordem: Number(form.ordem || 0),
      });
    } catch (err) {
      setErro(mensagemDeErro(err, "Falha ao salvar a publicação."));
    }
  };

  return (
    <form onSubmit={enviar} style={{ display: "grid", gap: 16 }} noValidate>
      <div>
        <label className="label" htmlFor="post-url">
          Link da publicação
        </label>
        <input
          id="post-url"
          className="input"
          placeholder="https://www.instagram.com/p/..."
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          autoFocus
        />
        <p className="helper">
          Abra o post no Instagram, use &ldquo;Copiar link&rdquo; e cole aqui. Funciona com post, reel e IGTV.
        </p>
      </div>

      <div>
        <label className="label" htmlFor="post-legenda">
          Legenda no site (opcional)
        </label>
        <textarea
          id="post-legenda"
          className="textarea"
          rows={2}
          placeholder="Um resumo curto que aparece abaixo do post"
          value={form.legenda}
          onChange={(e) => setForm({ ...form, legenda: e.target.value })}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 90px", gap: 12 }}>
        <div>
          <label className="label" htmlFor="post-data">
            Data
          </label>
          <input
            id="post-data"
            className="input"
            type="date"
            value={form.publicado_em || ""}
            onChange={(e) => setForm({ ...form, publicado_em: e.target.value })}
          />
        </div>
        <div>
          <label className="label" htmlFor="post-ordem">
            Ordem
          </label>
          <input
            id="post-ordem"
            className="input"
            type="number"
            min="0"
            value={form.ordem}
            onChange={(e) => setForm({ ...form, ordem: e.target.value })}
          />
        </div>
      </div>

      <label className="row gap-8" style={{ cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={form.publicado}
          onChange={(e) => setForm({ ...form, publicado: e.target.checked })}
        />
        <span style={{ fontSize: 13, color: "var(--ink-2)" }}>Visível no site</span>
      </label>

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
          ) : post ? (
            "Salvar alterações"
          ) : (
            "Adicionar publicação"
          )}
        </button>
      </div>
    </form>
  );
}

export default function AdminMedia() {
  const [aba, setAba] = useState("videos");
  const [formAberto, setFormAberto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [aviso, setAviso] = useState(null);
  const [erro, setErro] = useState(null);

  const videos = useVideos();
  const posts = usePostsInstagram();

  const criarVideo = useCreateVideo();
  const atualizarVideo = useUpdateVideo();
  const removerVideo = useDeleteVideo();
  const criarPost = useCreatePostInstagram();
  const atualizarPost = useUpdatePostInstagram();
  const removerPost = useDeletePostInstagram();

  const emVideos = aba === "videos";
  const consulta = emVideos ? videos : posts;
  const salvando = emVideos
    ? criarVideo.isPending || atualizarVideo.isPending
    : criarPost.isPending || atualizarPost.isPending;

  const abrir = (item = null) => {
    setEditando(item);
    setFormAberto(true);
  };

  const fechar = () => {
    setFormAberto(false);
    setEditando(null);
  };

  const salvar = async (payload) => {
    setAviso(null);
    setErro(null);
    const criar = emVideos ? criarVideo : criarPost;
    const atualizar = emVideos ? atualizarVideo : atualizarPost;

    if (editando) await atualizar.mutateAsync({ id: editando.id, payload });
    else await criar.mutateAsync(payload);

    fechar();
    setAviso(editando ? "Alterações salvas." : emVideos ? "Vídeo adicionado." : "Publicação adicionada.");
  };

  const alternarPublicado = async (item) => {
    setErro(null);
    const atualizar = emVideos ? atualizarVideo : atualizarPost;
    try {
      await atualizar.mutateAsync({ id: item.id, payload: { publicado: !item.publicado } });
    } catch (err) {
      setErro(mensagemDeErro(err));
    }
  };

  const excluir = async (item, rotulo) => {
    setErro(null);
    if (!confirm(`Remover "${rotulo}" do site?`)) return;
    try {
      await (emVideos ? removerVideo : removerPost).mutateAsync(item.id);
      setAviso("Item removido.");
    } catch (err) {
      setErro(mensagemDeErro(err));
    }
  };

  return (
    <AdminLayout label="Mídia">
      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "end", marginBottom: 28, gap: 16, flexWrap: "wrap" }}
      >
        <div>
          <span className="eyebrow">Conteúdo</span>
          <h1 className="display" style={{ fontSize: 36, margin: "10px 0 4px" }}>
            Mídia e redes
          </h1>
          <p style={{ color: "var(--ink-3)", margin: 0, fontSize: 14 }}>
            O que alimenta as abas <strong>TPM na Mídia</strong> e <strong>Fique por dentro</strong>.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => abrir()}>
          <Icon name="plus" size={15} /> {emVideos ? "Novo vídeo" : "Nova publicação"}
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
            <button
              className={"btn btn-sm " + (emVideos ? "btn-dark" : "btn-ghost")}
              onClick={() => setAba("videos")}
            >
              <Icon name="news" size={14} /> TPM na Mídia
            </button>
            <button
              className={"btn btn-sm " + (!emVideos ? "btn-dark" : "btn-ghost")}
              onClick={() => setAba("instagram")}
            >
              <Icon name="instagram" size={14} /> Fique por dentro
            </button>
          </div>
          <span className="mono muted" style={{ fontSize: 11 }}>
            {plural((consulta.data || []).length, "item", "itens")}
          </span>
        </div>

        {consulta.isLoading && <LoadingState label="Carregando…" />}
        {consulta.isError && (
          <div style={{ padding: "32px 16px" }}>
            <ErrorState message="Erro ao carregar o conteúdo." onRetry={consulta.refetch} />
          </div>
        )}

        {!consulta.isLoading && !consulta.isError && (consulta.data || []).length === 0 && (
          <EmptyState
            title={emVideos ? "Nenhum vídeo cadastrado" : "Nenhuma publicação cadastrada"}
            description={
              emVideos
                ? "Cole o link de uma reportagem no YouTube para ela aparecer no site."
                : "Cole o link de um post do Instagram para ele aparecer no site."
            }
            action={
              <button className="btn btn-primary btn-sm" onClick={() => abrir()}>
                <Icon name="plus" size={13} /> Adicionar
              </button>
            }
          />
        )}

        {!consulta.isLoading && !consulta.isError && (consulta.data || []).length > 0 && (
          <div className="table-scroll">
            <table className="tbl">
              <thead>
                <tr>
                  <th style={{ width: 70 }}>Ordem</th>
                  <th>{emVideos ? "Vídeo" : "Publicação"}</th>
                  <th>{emVideos ? "Veículo" : "Legenda"}</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th style={{ width: 230 }} />
                </tr>
              </thead>
              <tbody>
                {(consulta.data || []).map((item) => {
                  const rotulo = emVideos ? item.titulo : item.codigo;
                  return (
                    <tr key={item.id}>
                      <td className="mono" style={{ color: "var(--ink-3)" }}>
                        {item.ordem}
                      </td>
                      <td>
                        <div className="row gap-12" style={{ alignItems: "center" }}>
                          {emVideos ? (
                            <img
                              src={item.thumbnail}
                              alt=""
                              style={{
                                width: 84,
                                height: 48,
                                objectFit: "cover",
                                borderRadius: 6,
                                border: "1px solid var(--line)",
                                flexShrink: 0,
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: 48,
                                height: 48,
                                display: "grid",
                                placeItems: "center",
                                background: "var(--bg-2)",
                                borderRadius: 6,
                                border: "1px solid var(--line)",
                                flexShrink: 0,
                              }}
                            >
                              <Icon name="instagram" size={18} />
                            </div>
                          )}
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: 600 }}>{rotulo}</div>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="mono"
                              style={{ fontSize: 11, color: "var(--ink-3)" }}
                            >
                              {emVideos ? item.youtube_id : "abrir no Instagram"}
                            </a>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: "var(--ink-2)", fontSize: 13 }}>
                        {emVideos ? item.veiculo || "—" : item.legenda || "—"}
                      </td>
                      <td className="mono" style={{ fontSize: 12, color: "var(--ink-3)" }}>
                        {dataBR(item.publicado_em)}
                      </td>
                      <td>
                        <span
                          className={item.publicado ? "tag tag-red tag-dot" : "tag"}
                          style={{ fontSize: 10 }}
                        >
                          {item.publicado ? "No site" : "Oculto"}
                        </span>
                      </td>
                      <td>
                        <div className="row gap-8" style={{ justifyContent: "flex-end" }}>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => abrir(item)}
                            title="Editar"
                          >
                            <Icon name="edit" size={14} />
                          </button>
                          <button
                            className={item.publicado ? "btn btn-secondary btn-sm" : "btn btn-dark btn-sm"}
                            onClick={() => alternarPublicado(item)}
                          >
                            {item.publicado ? "Ocultar" : "Publicar"}
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => excluir(item, rotulo)}
                            title="Remover"
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
          title={
            editando
              ? `Editar · ${emVideos ? editando.titulo : editando.codigo}`
              : emVideos
                ? "Novo vídeo"
                : "Nova publicação"
          }
          onClose={fechar}
        >
          {emVideos ? (
            <FormularioVideo
              video={editando}
              salvando={salvando}
              onFechar={fechar}
              onSalvar={salvar}
            />
          ) : (
            <FormularioPost
              post={editando}
              salvando={salvando}
              onFechar={fechar}
              onSalvar={salvar}
            />
          )}
        </Modal>
      )}
    </AdminLayout>
  );
}
