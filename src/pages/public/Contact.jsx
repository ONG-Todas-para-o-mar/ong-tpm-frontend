import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Icon from "../../components/Icon.jsx";
import SEO from "../../components/SEO.jsx";
import { PH, Spinner } from "../../components/Shared.jsx";

const schema = z.object({
  name: z.string().min(2, "Informe seu nome"),
  organization: z.string().optional(),
  email: z.string().email("E-mail inválido"),
  subject: z.string().min(1, "Selecione um assunto"),
  message: z.string().min(10, "Mensagem muito curta"),
});

export default function Contact() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      organization: "",
      email: "",
      subject: "Quero ser voluntário(a)",
      message: "",
    },
  });

  const onSubmit = async () => {
    // Future: await api.post('/contact', data)
    setSent(true);
    reset();
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div data-screen-label="Public — Contato" className="fade-up">
      <SEO title="Contato" description="Fale com a TPM — parcerias, voluntariado, imprensa e dúvidas." />
      <section style={{ padding: "64px 0 32px", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <span className="eyebrow">Contato</span>
          <h1 className="display" style={{ fontSize: "clamp(40px, 5vw, 72px)", margin: "18px 0 0" }}>
            Fale com a TPM.
          </h1>
        </div>
      </section>

      <section style={{ padding: "48px 0 96px" }}>
        <div className="wrap" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }}>
          <form className="card" style={{ padding: 36 }} onSubmit={handleSubmit(onSubmit)} noValidate>
            <span className="eyebrow">Envie uma mensagem</span>
            <div style={{ display: "grid", gap: 16, marginTop: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="label">Nome</label>
                  <input
                    className={"input" + (errors.name ? " error" : "")}
                    placeholder="Como podemos chamar você"
                    autoComplete="name"
                    {...register("name")}
                  />
                  {errors.name && <div className="field-error">{errors.name.message}</div>}
                </div>
                <div>
                  <label className="label">Organização (opcional)</label>
                  <input
                    className="input"
                    placeholder="Empresa, coletivo, ONG…"
                    {...register("organization")}
                  />
                </div>
              </div>
              <div>
                <label className="label">E-mail</label>
                <input
                  className={"input" + (errors.email ? " error" : "")}
                  type="email"
                  placeholder="voce@email.com"
                  autoComplete="email"
                  {...register("email")}
                />
                {errors.email && <div className="field-error">{errors.email.message}</div>}
              </div>
              <div>
                <label className="label">Assunto</label>
                <select className="select" {...register("subject")}>
                  <option>Quero ser voluntário(a)</option>
                  <option>Parceria institucional</option>
                  <option>Imprensa</option>
                  <option>Dúvidas sobre doações</option>
                  <option>Outro</option>
                </select>
              </div>
              <div>
                <label className="label">Mensagem</label>
                <textarea
                  className={"textarea" + (errors.message ? " error" : "")}
                  rows={5}
                  placeholder="Conte um pouco sobre o que procura…"
                  {...register("message")}
                />
                {errors.message && <div className="field-error">{errors.message.message}</div>}
              </div>
            </div>
            {sent && (
              <div
                role="status"
                style={{
                  marginTop: 20,
                  padding: "12px 14px",
                  background: "var(--red-soft)",
                  color: "var(--red-ink)",
                  borderRadius: "var(--r-sm)",
                  fontSize: 13,
                }}
              >
                Mensagem enviada. Em breve responderemos.
              </div>
            )}
            <button className="btn btn-primary" type="submit" disabled={isSubmitting} style={{ marginTop: 24 }}>
              {isSubmitting ? <><Spinner size={14} /> Enviando…</> : <>Enviar mensagem <Icon name="arrow" size={14} /></>}
            </button>
          </form>

          <aside className="col gap-16">
            <div className="card" style={{ padding: 28 }}>
              <span className="eyebrow">Sede</span>
              <h3 className="display" style={{ fontSize: 24, margin: "10px 0 14px" }}>
                Maracaípe · Pernambuco
              </h3>
              <div style={{ color: "var(--ink-2)", fontSize: 14, lineHeight: 1.6 }}>
                Baía de Maracaípe — Porto de Galinhas
                <br />
                Ipojuca · PE · 55590-000
              </div>
              <hr className="divider" style={{ margin: "20px 0" }} />
              <div className="col gap-12">
                <div className="row gap-12">
                  <Icon name="mail" size={16} />{" "}
                  <span className="mono" style={{ fontSize: 13 }}>
                    hello@tpmar.org
                  </span>
                </div>
                <div className="row gap-12">
                  <Icon name="phone" size={16} />{" "}
                  <span className="mono" style={{ fontSize: 13 }}>
                    +55 (81) 3000-0000
                  </span>
                </div>
                <div className="row gap-12">
                  <Icon name="instagram" size={16} />{" "}
                  <span className="mono" style={{ fontSize: 13 }}>
                    @tpm.todasparaomar
                  </span>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <PH label="mapa — Mucuripe, Fortaleza" ratio="16/9" style={{ borderRadius: 0 }} />
            </div>

            <div className="card" style={{ padding: 28 }}>
              <div className="row gap-12" style={{ marginBottom: 8 }}>
                <Icon name="users" size={16} />
                <strong style={{ fontSize: 14 }}>Parcerias corporativas</strong>
              </div>
              <p style={{ color: "var(--ink-3)", fontSize: 13, margin: 0, lineHeight: 1.55 }}>
                Empresas com matching de doações ou patrocínio direto de projetos falam com o time de
                relações institucionais em até 48h.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
