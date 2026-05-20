import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Icon from "../../components/Icon.jsx";
import AuthFrame from "../../components/AuthFrame.jsx";
import { Spinner } from "../../components/Shared.jsx";
import SEO from "../../components/SEO.jsx";
import { api } from "../../lib/api.js";
import { useAuth } from "../../hooks/useAuth.jsx";

const STEPS = [
  { n: 1, t: "Dados pessoais" },
  { n: 2, t: "Endereço" },
  { n: 3, t: "Segurança" },
];

const UFS = ["CE", "SC", "BA", "PE", "RJ", "ES", "SP", "RS", "PR", "MG", "DF"];

const schema = z
  .object({
    name: z.string().min(3, "Informe seu nome completo"),
    email: z.string().email("E-mail inválido"),
    cpf: z.string().min(11, "CPF inválido"),
    phone: z.string().min(10, "Celular inválido"),
    city: z.string().min(2, "Informe a cidade"),
    state: z.string().min(2, "Selecione a UF"),
    cep: z.string().min(8, "CEP inválido"),
    pwd: z.string().min(8, "Mínimo 8 caracteres"),
    pwd2: z.string(),
    public: z.boolean().optional(),
    newsletter: z.boolean().optional(),
  })
  .refine((d) => d.pwd === d.pwd2, {
    path: ["pwd2"],
    message: "Senhas não coincidem",
  });

const STEP_FIELDS = {
  1: ["name", "email", "cpf", "phone"],
  2: ["city", "state", "cep"],
  3: ["pwd", "pwd2"],
};

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      cpf: "",
      phone: "",
      city: "",
      state: "",
      cep: "",
      pwd: "",
      pwd2: "",
      public: true,
      newsletter: true,
    },
  });

  const next = async () => {
    const ok = await trigger(STEP_FIELDS[step]);
    if (ok) setStep((s) => s + 1);
  };

  const onSubmit = async (data) => {
    try {
      await api.post("/auth/register/", {
        email: data.email,
        password: data.pwd,
        first_name: data.name.split(" ")[0],
        last_name: data.name.split(" ").slice(1).join(" "),
      });
      const { data: tokens } = await api.post("/auth/login/", {
        username: data.email,
        password: data.pwd,
      });
      const { data: me } = await api.get("/me/", {
        headers: { Authorization: `Bearer ${tokens.access}` },
      });
      login({ asAdmin: !!me.is_admin_ong, user: me, accessToken: tokens.access });
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.email?.[0] ||
          err.response?.data?.password?.[0] ||
          "Falha ao criar conta."
      );
    }
  };

  const fieldErr = (name) => errors[name] && <div className="field-error">{errors[name].message}</div>;

  return (
    <>
      <SEO title="Criar conta" />
    <AuthFrame
      eyebrow={"Criar conta · passo " + step + " de 3"}
      title="Junte-se à rede TPM."
      side={
        <div style={{ color: "white", maxWidth: 440, position: "relative", zIndex: 1 }}>
          <img
            src="/assets/logo-tpm.png"
            alt="TPM"
            style={{ width: 84, height: 84, marginBottom: 32, filter: "brightness(0) invert(1)", opacity: 0.95 }}
          />
          <h2 className="display" style={{ fontSize: 36, lineHeight: 1.15, margin: 0 }}>
            Doadores cadastrados recebem
            <br />
            comprovantes fiscais automáticos.
          </h2>
          <div style={{ marginTop: 36, color: "rgba(255,255,255,0.85)", fontSize: 14, lineHeight: 1.6 }}>
            O cadastro é gratuito e nunca é vendido a terceiros. Você decide se sua participação aparece
            publicamente no ranking ou se permanece anônima.
          </div>

          <div className="col gap-12" style={{ marginTop: 40 }}>
            {STEPS.map((s) => (
              <div key={s.n} className="row gap-12" style={{ opacity: step === s.n ? 1 : 0.55 }}>
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 999,
                    fontSize: 12,
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                    border: "1px solid rgba(255,255,255,0.5)",
                    background: step >= s.n ? "white" : "transparent",
                    color: step >= s.n ? "var(--red)" : "white",
                    fontWeight: 600,
                  }}
                >
                  {step > s.n ? <Icon name="check" size={13} stroke={2.5} /> : s.n}
                </div>
                <span style={{ color: "white", fontSize: 14 }}>{s.t}</span>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "grid", gap: 16 }} noValidate>
        {step === 1 && (
          <>
            <div>
              <label className="label">Nome completo</label>
              <input
                className={"input" + (errors.name ? " error" : "")}
                placeholder="Maria Aparecida da Silva"
                autoComplete="name"
                {...register("name")}
              />
              {fieldErr("name")}
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
              {fieldErr("email")}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label className="label">CPF</label>
                <input
                  className={"input mono" + (errors.cpf ? " error" : "")}
                  placeholder="000.000.000-00"
                  {...register("cpf")}
                />
                {fieldErr("cpf")}
              </div>
              <div>
                <label className="label">Celular</label>
                <input
                  className={"input mono" + (errors.phone ? " error" : "")}
                  placeholder="(85) 9 0000-0000"
                  autoComplete="tel"
                  {...register("phone")}
                />
                {fieldErr("phone")}
              </div>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
              <div>
                <label className="label">Cidade</label>
                <input
                  className={"input" + (errors.city ? " error" : "")}
                  placeholder="Fortaleza"
                  autoComplete="address-level2"
                  {...register("city")}
                />
                {fieldErr("city")}
              </div>
              <div>
                <label className="label">UF</label>
                <select
                  className={"select" + (errors.state ? " error" : "")}
                  autoComplete="address-level1"
                  {...register("state")}
                >
                  <option value="">UF</option>
                  {UFS.map((uf) => (
                    <option key={uf}>{uf}</option>
                  ))}
                </select>
                {fieldErr("state")}
              </div>
            </div>
            <div>
              <label className="label">CEP</label>
              <input
                className={"input mono" + (errors.cep ? " error" : "")}
                placeholder="60000-000"
                autoComplete="postal-code"
                {...register("cep")}
              />
              {fieldErr("cep")}
              <p className="helper">Usado apenas para emissão de recibos fiscais.</p>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <div>
              <label className="label">Senha</label>
              <input
                className={"input" + (errors.pwd ? " error" : "")}
                type="password"
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                {...register("pwd")}
              />
              {fieldErr("pwd")}
            </div>
            <div>
              <label className="label">Confirmar senha</label>
              <input
                className={"input" + (errors.pwd2 ? " error" : "")}
                type="password"
                placeholder="Repita a senha"
                autoComplete="new-password"
                {...register("pwd2")}
              />
              {fieldErr("pwd2")}
            </div>
            <div className="col gap-12" style={{ marginTop: 8 }}>
              <label className="row gap-8" style={{ cursor: "pointer" }}>
                <input type="checkbox" {...register("public")} />
                <span style={{ fontSize: 13, color: "var(--ink-2)" }}>
                  Aparecer publicamente no <strong className="strong">ranking de doadores</strong>
                </span>
              </label>
              <label className="row gap-8" style={{ cursor: "pointer" }}>
                <input type="checkbox" {...register("newsletter")} />
                <span style={{ fontSize: 13, color: "var(--ink-2)" }}>
                  Receber relatórios trimestrais e atualizações por e-mail
                </span>
              </label>
            </div>
            <p className="helper" style={{ marginTop: 8 }}>
              Ao criar conta, você concorda com a Política de Privacidade e o Estatuto da TPM.
            </p>
          </>
        )}

        <div className="row gap-12" style={{ marginTop: 16 }}>
          {step > 1 && (
            <button type="button" className="btn btn-secondary" onClick={() => setStep((s) => s - 1)}>
              <Icon name="arrowLeft" size={14} /> Voltar
            </button>
          )}
          <div className="spacer" />
          {step < 3 ? (
            <button type="button" className="btn btn-primary" onClick={next}>
              Continuar <Icon name="arrow" size={14} />
            </button>
          ) : (
            <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting}>
              {isSubmitting ? <><Spinner size={14} /> Criando…</> : <>Criar conta <Icon name="check" size={15} /></>}
            </button>
          )}
        </div>

        <div className="row gap-8" style={{ marginTop: 16, color: "var(--ink-3)", fontSize: 13 }}>
          <span>Já tem cadastro?</span>
          <Link to="/login" style={{ color: "var(--red)", fontWeight: 600, cursor: "pointer" }}>
            Entrar
          </Link>
        </div>
      </form>
    </AuthFrame>
    </>
  );
}
