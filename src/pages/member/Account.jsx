import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../../components/Icon.jsx";
import SEO from "../../components/SEO.jsx";
import {
  Avatar,
  EmptyState,
  ErrorState,
  LoadingState,
  Notice,
  Progress,
  Spinner,
} from "../../components/Shared.jsx";
import { BRL, BRL2, NUM, dataBR, dataHoraBR, plural } from "../../lib/format.js";
import { mensagemDeErro } from "../../lib/api.js";
import { useAuth } from "../../hooks/useAuth.jsx";
import {
  usePainelDoador,
  useTrocarSenha,
  useUpdateMe,
  useUpdatePerfilDoador,
} from "../../hooks/useQueries.js";

const STATUS_TAG = {
  confirmada: "tag tag-red",
  pendente: "tag",
  falha: "tag",
};

export default function Account() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const { data, isLoading, isError, refetch } = usePainelDoador();
  const salvarConta = useUpdateMe();
  const salvarPerfil = useUpdatePerfilDoador();
  const trocarSenha = useTrocarSenha();

  const [aviso, setAviso] = useState(null);
  const [erro, setErro] = useState(null);
  const [perfil, setPerfil] = useState({ phone: "", city: "", state: "", cep: "" });
  const [conta, setConta] = useState({ first_name: "", last_name: "", nickname: "" });
  const [senhas, setSenhas] = useState({ senha_atual: "", nova_senha: "" });

  useEffect(() => {
    if (!data) return;
    setPerfil({
      phone: data.phone || "",
      city: data.city || "",
      state: data.state || "",
      cep: data.cep || "",
    });
    setConta({
      first_name: data.user?.first_name || "",
      last_name: data.user?.last_name || "",
      nickname: data.user?.nickname || "",
    });
  }, [data]);

  if (isLoading) {
    return (
      <div className="wrap" style={{ padding: "96px 0" }}>
        <LoadingState label="Carregando sua conta…" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="wrap" style={{ padding: "96px 0" }}>
        <ErrorState message="Não foi possível carregar sua conta." onRetry={refetch} />
      </div>
    );
  }

  const resumo = data.resumo || {};
  const selos = data.badges || [];
  const doacoes = data.doacoes || [];
  const proximo = resumo.proximo_selo;
  const publico = data.user?.is_public_in_ranking;
  const nomeCompleto =
    `${data.user?.first_name || ""} ${data.user?.last_name || ""}`.trim() ||
    data.user?.nickname ||
    data.user?.username;

  const feedback = (fn) => async (...args) => {
    setAviso(null);
    setErro(null);
    try {
      await fn(...args);
    } catch (err) {
      setErro(mensagemDeErro(err));
    }
  };

  const alternarPrivacidade = feedback(async () => {
    const atualizado = await salvarConta.mutateAsync({ is_public_in_ranking: !publico });
    updateUser({ ...user, ...atualizado });
    setAviso(
      atualizado.is_public_in_ranking
        ? "Seu nome volta a aparecer no ranking público."
        : "Seu nome foi removido do ranking público. Os selos continuam na sua conta."
    );
  });

  const salvarDados = feedback(async (e) => {
    e.preventDefault();
    const atualizado = await salvarConta.mutateAsync(conta);
    updateUser({ ...user, ...atualizado });
    await salvarPerfil.mutateAsync(perfil);
    setAviso("Dados atualizados.");
  });

  const enviarSenha = feedback(async (e) => {
    e.preventDefault();
    await trocarSenha.mutateAsync(senhas);
    setSenhas({ senha_atual: "", nova_senha: "" });
    setAviso("Senha alterada com sucesso.");
  });

  const sair = () => {
    logout();
    navigate("/");
  };

  return (
    <div data-screen-label="Membro — Minha conta" className="fade-up">
      <SEO title="Minha conta" />

      <section style={{ padding: "48px 0 32px", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <div
            className="row"
            style={{ justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}
          >
            <div className="row gap-16">
              <Avatar nome={nomeCompleto} size={64} destaque />
              <div>
                <span className="eyebrow">Minha conta</span>
                <h1 className="display" style={{ fontSize: 34, margin: "8px 0 6px" }}>
                  {nomeCompleto}
                </h1>
                <div className="row gap-8" style={{ flexWrap: "wrap" }}>
                  {data.socio ? (
                    <span className="tag tag-red tag-dot">
                      Sócio desde {dataBR(data.socio_desde)}
                    </span>
                  ) : (
                    <span className="tag">Doador</span>
                  )}
                  <span className="mono muted" style={{ fontSize: 12 }}>
                    conta criada em {dataBR(data.desde)}
                  </span>
                </div>
              </div>
            </div>
            <div className="row gap-12">
              <Link to="/doar" className="btn btn-primary">
                <Icon name="heart" size={15} /> Nova doação
              </Link>
              <button className="btn btn-ghost" onClick={sair}>
                <Icon name="logout" size={15} /> Sair
              </button>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "32px 0 96px" }}>
        <div className="wrap">
          {aviso && (
            <div style={{ marginBottom: 20 }}>
              <Notice tone="sucesso" onDismiss={() => setAviso(null)}>
                {aviso}
              </Notice>
            </div>
          )}
          {erro && (
            <div style={{ marginBottom: 20 }}>
              <Notice tone="erro" onDismiss={() => setErro(null)}>
                {erro}
              </Notice>
            </div>
          )}

          <div className="g4">
            {[
              { l: "Total doado", v: BRL(data.total_doado), s: "Doações confirmadas" },
              {
                l: "Doações confirmadas",
                v: NUM(resumo.doacoes_confirmadas || 0),
                s: plural(resumo.doacoes_pendentes || 0, "pendente", "pendentes"),
              },
              {
                l: "Posição no ranking",
                v: resumo.posicao_ranking ? `#${resumo.posicao_ranking}` : "—",
                s: publico ? "Perfil público" : "Perfil anônimo",
              },
              { l: "Selos conquistados", v: NUM(selos.length), s: "Reconhecimentos ativos" },
            ].map((k) => (
              <div key={k.l} className="card" style={{ padding: 22 }}>
                <span className="eyebrow">{k.l}</span>
                <div className="display tnum" style={{ fontSize: 32, margin: "12px 0 4px" }}>
                  {k.v}
                </div>
                <div style={{ fontSize: 12, color: "var(--ink-3)" }}>{k.s}</div>
              </div>
            ))}
          </div>

          <div className="split-wide" style={{ marginTop: 16 }}>
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <div
                className="row"
                style={{
                  justifyContent: "space-between",
                  padding: "22px 28px",
                  borderBottom: "1px solid var(--line)",
                }}
              >
                <span className="eyebrow">Histórico de doações</span>
                <span className="mono muted" style={{ fontSize: 11 }}>
                  {plural(doacoes.length, "registro", "registros")}
                </span>
              </div>

              {doacoes.length === 0 ? (
                <EmptyState
                  title="Você ainda não registrou doações"
                  description="Assim que registrar uma doação, ela aparece aqui com o status de confirmação."
                  action={
                    <Link to="/doar" className="btn btn-primary btn-sm">
                      Fazer minha primeira doação
                    </Link>
                  }
                />
              ) : (
                <div className="table-scroll">
                  <table className="tbl">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Projeto</th>
                        <th>Método</th>
                        <th>Status</th>
                        <th className="num">Valor</th>
                        <th>Quando</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doacoes.map((d) => (
                        <tr key={d.id}>
                          <td className="mono" style={{ color: "var(--ink-3)" }}>
                            {d.id}
                          </td>
                          <td style={{ fontWeight: 500 }}>
                            {d.meta ? (
                              <Link to={`/projetos/${d.meta}`}>{d.meta_titulo}</Link>
                            ) : (
                              "Onde for mais necessário"
                            )}
                          </td>
                          <td>
                            <span className="tag" style={{ fontSize: 10 }}>
                              {d.metodo || "—"}
                            </span>
                            {d.recorrente && (
                              <span className="tag" style={{ fontSize: 10, marginLeft: 6 }}>
                                mensal
                              </span>
                            )}
                          </td>
                          <td>
                            <span
                              className={STATUS_TAG[d.status] || "tag"}
                              style={{ fontSize: 10 }}
                            >
                              {d.status_display}
                            </span>
                          </td>
                          <td className="mono num" style={{ fontWeight: 600 }}>
                            {BRL2(d.valor)}
                          </td>
                          <td className="mono" style={{ fontSize: 12, color: "var(--ink-3)" }}>
                            {dataHoraBR(d.criada_em)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="col gap-16">
              <div className="card" style={{ padding: 28 }}>
                <span className="eyebrow">Meus selos de sócio</span>
                {selos.length === 0 ? (
                  <p style={{ color: "var(--ink-3)", fontSize: 13, marginTop: 14 }}>
                    Você ainda não conquistou selos. A primeira doação confirmada já garante o
                    primeiro.
                  </p>
                ) : (
                  <div className="col gap-12" style={{ marginTop: 16 }}>
                    {selos.map((s) => (
                      <div key={s.id} className="row gap-12">
                        <div
                          className="selo-icone"
                          style={{
                            width: 36,
                            height: 36,
                            background: s.cor ? `${s.cor}1f` : "var(--bg-2)",
                            color: s.cor || "var(--ink-2)",
                            borderColor: s.cor ? `${s.cor}55` : "var(--line)",
                          }}
                        >
                          <Icon name={s.icone || "medal"} size={17} />
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>{s.nome}</div>
                          <div style={{ fontSize: 12, color: "var(--ink-3)" }}>{s.descricao}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {proximo && (
                  <>
                    <hr className="divider" style={{ margin: "22px 0" }} />
                    <span className="eyebrow">Próximo selo</span>
                    <div style={{ marginTop: 12 }}>
                      <div
                        className="row"
                        style={{ justifyContent: "space-between", marginBottom: 8 }}
                      >
                        <strong style={{ fontSize: 14 }}>{proximo.nome}</strong>
                        <span className="mono" style={{ fontSize: 12, color: "var(--ink-3)" }}>
                          faltam {BRL(proximo.falta)}
                        </span>
                      </div>
                      <Progress
                        value={Number(data.total_doado || 0)}
                        max={Number(proximo.criterio_valor || 1)}
                        label={`Progresso até o selo ${proximo.nome}`}
                      />
                    </div>
                  </>
                )}

                <Link
                  to="/socios"
                  className="btn btn-secondary btn-sm"
                  style={{ width: "100%", marginTop: 22 }}
                >
                  Ver todos os selos <Icon name="arrow" size={13} />
                </Link>
              </div>

              <div className="card" style={{ padding: 28 }}>
                <span className="eyebrow">Privacidade</span>
                <p style={{ fontSize: 13, color: "var(--ink-3)", margin: "12px 0 18px", lineHeight: 1.55 }}>
                  {publico
                    ? "Seu nome aparece no ranking público e na página de sócios."
                    : "Você está fora das listas públicas. Seus selos continuam registrados."}
                </p>
                <button
                  className={publico ? "btn btn-secondary btn-sm" : "btn btn-dark btn-sm"}
                  onClick={alternarPrivacidade}
                  disabled={salvarConta.isPending}
                  style={{ width: "100%" }}
                >
                  {salvarConta.isPending ? (
                    <>
                      <Spinner size={13} /> Salvando…
                    </>
                  ) : publico ? (
                    "Sair das listas públicas"
                  ) : (
                    "Aparecer nas listas públicas"
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="g2" style={{ marginTop: 16 }}>
            <form className="card" style={{ padding: 28 }} onSubmit={salvarDados}>
              <span className="eyebrow">Meus dados</span>
              <div style={{ display: "grid", gap: 14, marginTop: 18 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label className="label" htmlFor="first_name">
                      Nome
                    </label>
                    <input
                      id="first_name"
                      className="input"
                      value={conta.first_name}
                      onChange={(e) => setConta({ ...conta, first_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="last_name">
                      Sobrenome
                    </label>
                    <input
                      id="last_name"
                      className="input"
                      value={conta.last_name}
                      onChange={(e) => setConta({ ...conta, last_name: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="label" htmlFor="nickname">
                    Apelido público (opcional)
                  </label>
                  <input
                    id="nickname"
                    className="input"
                    placeholder="Como você quer aparecer no ranking"
                    value={conta.nickname}
                    onChange={(e) => setConta({ ...conta, nickname: e.target.value })}
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label className="label" htmlFor="phone">
                      Celular
                    </label>
                    <input
                      id="phone"
                      className="input mono"
                      value={perfil.phone}
                      onChange={(e) => setPerfil({ ...perfil, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="cep">
                      CEP
                    </label>
                    <input
                      id="cep"
                      className="input mono"
                      value={perfil.cep}
                      onChange={(e) => setPerfil({ ...perfil, cep: e.target.value })}
                    />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
                  <div>
                    <label className="label" htmlFor="city">
                      Cidade
                    </label>
                    <input
                      id="city"
                      className="input"
                      value={perfil.city}
                      onChange={(e) => setPerfil({ ...perfil, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="state">
                      UF
                    </label>
                    <input
                      id="state"
                      className="input mono"
                      maxLength={2}
                      value={perfil.state}
                      onChange={(e) =>
                        setPerfil({ ...perfil, state: e.target.value.toUpperCase() })
                      }
                    />
                  </div>
                </div>
              </div>
              <button
                className="btn btn-primary"
                type="submit"
                style={{ marginTop: 22 }}
                disabled={salvarConta.isPending || salvarPerfil.isPending}
              >
                {salvarConta.isPending || salvarPerfil.isPending ? (
                  <>
                    <Spinner size={14} /> Salvando…
                  </>
                ) : (
                  "Salvar alterações"
                )}
              </button>
            </form>

            <form className="card" style={{ padding: 28 }} onSubmit={enviarSenha}>
              <span className="eyebrow">Segurança</span>
              <div style={{ display: "grid", gap: 14, marginTop: 18 }}>
                <div>
                  <label className="label" htmlFor="senha_atual">
                    Senha atual
                  </label>
                  <input
                    id="senha_atual"
                    className="input"
                    type="password"
                    autoComplete="current-password"
                    value={senhas.senha_atual}
                    onChange={(e) => setSenhas({ ...senhas, senha_atual: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="label" htmlFor="nova_senha">
                    Nova senha
                  </label>
                  <input
                    id="nova_senha"
                    className="input"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    value={senhas.nova_senha}
                    onChange={(e) => setSenhas({ ...senhas, nova_senha: e.target.value })}
                    required
                  />
                  <p className="helper">Mínimo 8 caracteres, sem sequências óbvias.</p>
                </div>
              </div>
              <button
                className="btn btn-secondary"
                type="submit"
                style={{ marginTop: 22 }}
                disabled={trocarSenha.isPending}
              >
                {trocarSenha.isPending ? (
                  <>
                    <Spinner size={14} /> Alterando…
                  </>
                ) : (
                  <>
                    <Icon name="lock" size={14} /> Alterar senha
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
