import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Icon from "../../components/Icon.jsx";
import SEO from "../../components/SEO.jsx";
import { Notice, Spinner } from "../../components/Shared.jsx";
import { mensagemDeErro } from "../../lib/api.js";
import { secaoVisivel } from "../../lib/secoes.js";
import { CONTATO, PARTICIPE } from "../../data/contato.js";
import { useEnviarMensagem } from "../../hooks/useQueries.js";

const ASSUNTOS = [
  { id: "voluntariado", label: "Quero ser voluntário(a)" },
  { id: "parceria", label: "Parceria institucional" },
  { id: "imprensa", label: "Imprensa" },
  { id: "doacoes", label: "Dúvidas sobre doações", secao: "doacao" },
  { id: "outro", label: "Outro" },
].filter((a) => !a.secao || secaoVisivel(a.secao));

const externo = { target: "_blank", rel: "noreferrer noopener" };

const schema = z.object({
  nome: z.string().min(2, "Informe seu nome"),
  organizacao: z.string().optional(),
  email: z.string().email("E-mail inválido"),
  assunto: z.string().min(1, "Selecione um assunto"),
  mensagem: z.string().min(10, "Mensagem muito curta"),
});

export default function Contact() {
  const [enviada, setEnviada] = useState(false);
  const [erro, setErro] = useState(null);
  const enviar = useEnviarMensagem();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
      organizacao: "",
      email: "",
      assunto: "voluntariado",
      mensagem: "",
    },
  });

  const onSubmit = async (data) => {
    setErro(null);
    try {
      await enviar.mutateAsync(data);
      setEnviada(true);
      reset();
    } catch (err) {
      setErro(mensagemDeErro(err, "Não foi possível enviar a mensagem."));
    }
  };

  return (
    <div data-screen-label="Public — Contato" className="fade-up">
      <SEO title="Contato" description="Fale com a TPM — parcerias, voluntariado, imprensa e dúvidas." />
      <section style={{ padding: "64px 0 32px", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <span className="eyebrow">Contato</span>
          <h1 className="display" style={{ fontSize: "clamp(34px, 5vw, 72px)", margin: "18px 0 0" }}>
            Fale com a TPM.
          </h1>
        </div>
      </section>

      <section style={{ padding: "48px 0 96px" }}>
        <div className="wrap g2" style={{ gap: 64 }}>
          <form className="card" style={{ padding: 36 }} onSubmit={handleSubmit(onSubmit)} noValidate>
            <span className="eyebrow">Envie uma mensagem</span>
            <div style={{ display: "grid", gap: 16, marginTop: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="label" htmlFor="nome">
                    Nome
                  </label>
                  <input
                    id="nome"
                    className={"input" + (errors.nome ? " error" : "")}
                    placeholder="Como podemos chamar você"
                    autoComplete="name"
                    {...register("nome")}
                  />
                  {errors.nome && <div className="field-error">{errors.nome.message}</div>}
                </div>
                <div>
                  <label className="label" htmlFor="organizacao">
                    Organização (opcional)
                  </label>
                  <input
                    id="organizacao"
                    className="input"
                    placeholder="Empresa, coletivo, ONG…"
                    {...register("organizacao")}
                  />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="email">
                  E-mail
                </label>
                <input
                  id="email"
                  className={"input" + (errors.email ? " error" : "")}
                  type="email"
                  placeholder="voce@email.com"
                  autoComplete="email"
                  {...register("email")}
                />
                {errors.email && <div className="field-error">{errors.email.message}</div>}
              </div>
              <div>
                <label className="label" htmlFor="assunto">
                  Assunto
                </label>
                <select id="assunto" className="select" {...register("assunto")}>
                  {ASSUNTOS.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="mensagem">
                  Mensagem
                </label>
                <textarea
                  id="mensagem"
                  className={"textarea" + (errors.mensagem ? " error" : "")}
                  rows={5}
                  placeholder="Conte um pouco sobre o que procura…"
                  {...register("mensagem")}
                />
                {errors.mensagem && <div className="field-error">{errors.mensagem.message}</div>}
              </div>
            </div>

            {enviada && (
              <div style={{ marginTop: 20 }}>
                <Notice tone="sucesso" onDismiss={() => setEnviada(false)}>
                  Mensagem enviada. A equipe responde no e-mail informado.
                </Notice>
              </div>
            )}
            {erro && (
              <div style={{ marginTop: 20 }}>
                <Notice tone="erro">{erro}</Notice>
              </div>
            )}

            <button
              className="btn btn-primary"
              type="submit"
              disabled={enviar.isPending}
              style={{ marginTop: 24 }}
            >
              {enviar.isPending ? (
                <>
                  <Spinner size={14} /> Enviando…
                </>
              ) : (
                <>
                  Enviar mensagem <Icon name="send" size={14} />
                </>
              )}
            </button>
          </form>

          <aside className="col gap-16">
            <div className="card" style={{ padding: 28 }}>
              <span className="eyebrow">Sede</span>
              <h3 className="display" style={{ fontSize: 24, margin: "10px 0 14px" }}>
                Maracaípe · Pernambuco
              </h3>
              <div style={{ color: "var(--ink-2)", fontSize: 14, lineHeight: 1.6 }}>
                {CONTATO.endereco}
                <br />
                {CONTATO.cidade}
              </div>
              <hr className="divider" style={{ margin: "20px 0" }} />
              <div className="col gap-12">
                <a className="row gap-12" href={CONTATO.whatsapp.url} {...externo}>
                  <Icon name="phone" size={16} />
                  <span className="mono" style={{ fontSize: 13 }}>
                    {CONTATO.whatsapp.numero} · WhatsApp ({CONTATO.whatsapp.responsavel})
                  </span>
                </a>
                <a className="row gap-12" href={`mailto:${CONTATO.email}`}>
                  <Icon name="mail" size={16} />
                  <span className="mono" style={{ fontSize: 13 }}>
                    {CONTATO.email}
                  </span>
                </a>
                <a className="row gap-12" href={CONTATO.instagram.url} {...externo}>
                  <Icon name="instagram" size={16} />
                  <span className="mono" style={{ fontSize: 13 }}>
                    @{CONTATO.instagram.usuario}
                  </span>
                </a>
                <a className="row gap-12" href={CONTATO.mapa} {...externo}>
                  <Icon name="pin" size={16} />
                  <span className="mono" style={{ fontSize: 13 }}>
                    Ver no mapa
                  </span>
                </a>
              </div>
            </div>

            <div className="card" style={{ padding: 28 }}>
              <span className="eyebrow">Participe</span>
              <div className="col gap-16" style={{ marginTop: 14 }}>
                {PARTICIPE.map((p) => (
                  <div key={p.id}>
                    <strong style={{ fontSize: 15, display: "block", marginBottom: 4 }}>
                      {p.titulo}
                    </strong>
                    <p style={{ color: "var(--ink-3)", fontSize: 13, margin: "0 0 6px", lineHeight: 1.55 }}>
                      {p.texto}
                    </p>
                    <a
                      href={p.url}
                      {...externo}
                      className="mono"
                      style={{ fontSize: 11, color: "var(--red)", letterSpacing: ".08em", textTransform: "uppercase" }}
                    >
                      {p.acao} →
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: 28 }}>
              <div className="row gap-12" style={{ marginBottom: 8 }}>
                <Icon name="users" size={16} />
                <strong style={{ fontSize: 14 }}>Parcerias</strong>
              </div>
              <p style={{ color: "var(--ink-3)", fontSize: 13, margin: 0, lineHeight: 1.55 }}>
                Empresas, coletivos e instituições que queiram somar com as atividades da TPM podem
                escrever pelo formulário (assunto “Parceria institucional”) ou chamar no WhatsApp.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
