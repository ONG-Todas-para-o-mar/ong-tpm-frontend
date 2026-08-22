import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Icon from "../../components/Icon.jsx";
import AuthFrame from "../../components/AuthFrame.jsx";
import { Notice, Spinner } from "../../components/Shared.jsx";
import SEO from "../../components/SEO.jsx";
import { api, mensagemDeErro } from "../../lib/api.js";
import { useAuth } from "../../hooks/useAuth.jsx";

const schema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [show, setShow] = useState(false);
  const [erro, setErro] = useState(null);

  const destino = location.state?.from;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    setErro(null);
    try {
      const { data: tokens } = await api.post("/auth/login/", {
        username: data.email,
        password: data.password,
      });
      const { data: me } = await api.get("/me/", {
        headers: { Authorization: `Bearer ${tokens.access}` },
      });
      login({ user: me, accessToken: tokens.access, refreshToken: tokens.refresh });
      navigate(destino || (me.is_admin_ong ? "/admin" : "/minha-conta"), { replace: true });
    } catch (err) {
      setErro(mensagemDeErro(err, "E-mail ou senha incorretos."));
    }
  };

  return (
    <>
      <SEO title="Entrar" />
      <AuthFrame
        eyebrow="Acessar plataforma"
        title="Bem-vinda de volta."
        side={
          <div style={{ color: "white", maxWidth: 440, position: "relative", zIndex: 1 }}>
            <img
              src="/assets/logo-tpm.png"
              alt="TPM"
              style={{
                width: 84,
                height: 84,
                marginBottom: 32,
                filter: "brightness(0) invert(1)",
                opacity: 0.95,
              }}
            />
            <h2 className="display" style={{ fontSize: 34, lineHeight: 1.15, margin: 0 }}>
              Acompanhe o impacto de cada
              <br />
              doação no seu painel pessoal.
            </h2>
            <div
              style={{
                marginTop: 36,
                display: "grid",
                gap: 18,
                color: "rgba(255,255,255,0.85)",
                fontSize: 14,
              }}
            >
              {[
                ["Histórico completo", "Cada doação rastreada até o projeto."],
                ["Selos de sócio", "Conquistados por valor doado e por recorrência."],
                ["Sua posição no ranking", "Reconhecimento público opcional."],
              ].map(([t, d]) => (
                <div key={t} className="row gap-12">
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 999,
                      border: "1px solid rgba(255,255,255,0.6)",
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    <Icon name="check" size={13} />
                  </div>
                  <div>
                    <strong style={{ color: "white" }}>{t}</strong>
                    <div>{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "grid", gap: 16 }} noValidate>
          <div>
            <label className="label" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              className={"input" + (errors.email ? " error" : "")}
              type="email"
              placeholder="voce@email.com"
              autoFocus
              autoComplete="email"
              {...register("email")}
            />
            {errors.email && <div className="field-error">{errors.email.message}</div>}
          </div>

          <div>
            <div className="row" style={{ justifyContent: "space-between", marginBottom: 6 }}>
              <label className="label" htmlFor="password" style={{ margin: 0 }}>
                Senha
              </label>
              <Link
                to="/recuperar-senha"
                className="mono"
                style={{
                  fontSize: 11,
                  color: "var(--red)",
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                }}
              >
                Esqueci minha senha
              </Link>
            </div>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                className={"input" + (errors.password ? " error" : "")}
                type={show ? "text" : "password"}
                placeholder="••••••••••"
                autoComplete="current-password"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "Ocultar senha" : "Mostrar senha"}
                style={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  padding: 6,
                  borderRadius: 6,
                  border: 0,
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                <Icon name={show ? "eyeOff" : "eye"} size={16} />
              </button>
            </div>
            {errors.password && <div className="field-error">{errors.password.message}</div>}
          </div>

          {erro && <Notice tone="erro">{erro}</Notice>}

          <button
            className="btn btn-primary btn-lg"
            type="submit"
            disabled={isSubmitting}
            style={{ marginTop: 8 }}
          >
            {isSubmitting ? (
              <>
                <Spinner size={14} /> Entrando…
              </>
            ) : (
              <>
                Entrar <Icon name="arrow" size={15} />
              </>
            )}
          </button>

          <div className="row gap-8" style={{ marginTop: 16, color: "var(--ink-3)", fontSize: 13 }}>
            <span>Ainda não tem cadastro?</span>
            <Link to="/cadastro" style={{ color: "var(--red)", fontWeight: 600 }}>
              Criar conta
            </Link>
          </div>
        </form>
      </AuthFrame>
    </>
  );
}
