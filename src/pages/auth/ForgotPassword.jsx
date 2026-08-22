import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Icon from "../../components/Icon.jsx";
import AuthFrame from "../../components/AuthFrame.jsx";
import SEO from "../../components/SEO.jsx";
import { Notice, Spinner } from "../../components/Shared.jsx";
import { mensagemDeErro } from "../../lib/api.js";
import { useRecuperarSenha } from "../../hooks/useQueries.js";

const schema = z.object({ email: z.string().email("E-mail inválido") });

export default function ForgotPassword() {
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState(null);
  const recuperar = useRecuperarSenha();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { email: "" } });

  const onSubmit = async (data) => {
    setErro(null);
    try {
      await recuperar.mutateAsync(data);
      setEnviado(true);
    } catch (err) {
      setErro(mensagemDeErro(err, "Não foi possível enviar o link."));
    }
  };

  return (
    <>
      <SEO title="Recuperar senha" />
      <AuthFrame
        eyebrow="Recuperação de acesso"
        title="Vamos destravar sua conta."
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
            <h2 className="display" style={{ fontSize: 32, lineHeight: 1.15, margin: 0 }}>
              Enviamos um link temporário
              <br />
              para o e-mail cadastrado.
            </h2>
            <p style={{ marginTop: 28, color: "rgba(255,255,255,0.85)", fontSize: 14, lineHeight: 1.6 }}>
              Por segurança, não informamos se o e-mail existe na base. O link expira e só pode ser
              usado uma vez.
            </p>
          </div>
        }
      >
        {enviado ? (
          <div style={{ display: "grid", gap: 20 }}>
            <Notice tone="sucesso">
              Se este e-mail estiver cadastrado, enviamos um link para redefinir a senha. Confira
              também a caixa de spam.
            </Notice>
            <Link to="/login" className="btn btn-primary">
              <Icon name="arrowLeft" size={15} /> Voltar para o login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "grid", gap: 16 }} noValidate>
            <div>
              <label className="label" htmlFor="email">
                E-mail da conta
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

            {erro && <Notice tone="erro">{erro}</Notice>}

            <button className="btn btn-primary btn-lg" type="submit" disabled={recuperar.isPending}>
              {recuperar.isPending ? (
                <>
                  <Spinner size={14} /> Enviando…
                </>
              ) : (
                <>
                  Enviar link <Icon name="send" size={15} />
                </>
              )}
            </button>

            <div className="row gap-8" style={{ marginTop: 8, color: "var(--ink-3)", fontSize: 13 }}>
              <span>Lembrou a senha?</span>
              <Link to="/login" style={{ color: "var(--red)", fontWeight: 600 }}>
                Entrar
              </Link>
            </div>
          </form>
        )}
      </AuthFrame>
    </>
  );
}
