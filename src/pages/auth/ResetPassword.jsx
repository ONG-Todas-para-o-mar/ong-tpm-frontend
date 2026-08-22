import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Icon from "../../components/Icon.jsx";
import AuthFrame from "../../components/AuthFrame.jsx";
import SEO from "../../components/SEO.jsx";
import { Notice, Spinner } from "../../components/Shared.jsx";
import { mensagemDeErro } from "../../lib/api.js";
import { useRedefinirSenha } from "../../hooks/useQueries.js";

const schema = z
  .object({
    password: z.string().min(8, "Mínimo 8 caracteres"),
    confirmacao: z.string(),
  })
  .refine((d) => d.password === d.confirmacao, {
    path: ["confirmacao"],
    message: "Senhas não coincidem",
  });

export default function ResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [erro, setErro] = useState(null);
  const [pronto, setPronto] = useState(false);
  const redefinir = useRedefinirSenha();

  const uid = params.get("uid");
  const token = params.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmacao: "" },
  });

  const onSubmit = async (data) => {
    setErro(null);
    try {
      await redefinir.mutateAsync({ uid, token, password: data.password });
      setPronto(true);
      setTimeout(() => navigate("/login", { replace: true }), 2500);
    } catch (err) {
      setErro(mensagemDeErro(err, "Link inválido ou expirado."));
    }
  };

  const linkInvalido = !uid || !token;

  return (
    <>
      <SEO title="Redefinir senha" />
      <AuthFrame
        eyebrow="Nova senha"
        title="Escolha uma senha nova."
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
              Use pelo menos 8 caracteres
              <br />
              e evite senhas óbvias.
            </h2>
          </div>
        }
      >
        {linkInvalido ? (
          <div style={{ display: "grid", gap: 20 }}>
            <Notice tone="erro">
              Este link de redefinição está incompleto. Peça um novo link na tela de recuperação.
            </Notice>
            <Link to="/recuperar-senha" className="btn btn-primary">
              Pedir novo link
            </Link>
          </div>
        ) : pronto ? (
          <div style={{ display: "grid", gap: 20 }}>
            <Notice tone="sucesso">
              Senha redefinida. Redirecionando para o login…
            </Notice>
            <Link to="/login" className="btn btn-primary">
              Ir para o login agora
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "grid", gap: 16 }} noValidate>
            <div>
              <label className="label" htmlFor="password">
                Nova senha
              </label>
              <input
                id="password"
                className={"input" + (errors.password ? " error" : "")}
                type="password"
                placeholder="Mínimo 8 caracteres"
                autoFocus
                autoComplete="new-password"
                {...register("password")}
              />
              {errors.password && <div className="field-error">{errors.password.message}</div>}
            </div>
            <div>
              <label className="label" htmlFor="confirmacao">
                Confirmar senha
              </label>
              <input
                id="confirmacao"
                className={"input" + (errors.confirmacao ? " error" : "")}
                type="password"
                placeholder="Repita a senha"
                autoComplete="new-password"
                {...register("confirmacao")}
              />
              {errors.confirmacao && <div className="field-error">{errors.confirmacao.message}</div>}
            </div>

            {erro && <Notice tone="erro">{erro}</Notice>}

            <button className="btn btn-primary btn-lg" type="submit" disabled={redefinir.isPending}>
              {redefinir.isPending ? (
                <>
                  <Spinner size={14} /> Salvando…
                </>
              ) : (
                <>
                  Redefinir senha <Icon name="check" size={15} />
                </>
              )}
            </button>
          </form>
        )}
      </AuthFrame>
    </>
  );
}
