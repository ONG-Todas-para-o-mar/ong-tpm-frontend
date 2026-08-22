import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Icon from "../../components/Icon.jsx";
import SEO from "../../components/SEO.jsx";
import { Notice, Spinner } from "../../components/Shared.jsx";
import { BRL, dataHoraBR } from "../../lib/format.js";
import { mensagemDeErro } from "../../lib/api.js";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useCreateDoacao, useMetas } from "../../hooks/useQueries.js";

const PRESETS = [30, 60, 120, 240, 500, 1000];

const METODOS = [
  { id: "pix", icon: "pix", label: "PIX", sub: "Instantâneo · sem taxa" },
  { id: "transferencia", icon: "card", label: "Transferência", sub: "TED ou depósito" },
  { id: "boleto", icon: "barcode", label: "Boleto", sub: "Compensa em 1–3 dias" },
];

const EMAIL_DOACOES = "hello@tpmar.org";

export default function Donate() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { isAuthed } = useAuth();
  const { data: metas } = useMetas({ ativa: true });
  const criar = useCreateDoacao();

  const [valor, setValor] = useState(120);
  const [recorrente, setRecorrente] = useState(true);
  const [metodo, setMetodo] = useState("pix");
  const [projeto, setProjeto] = useState("");
  const [erro, setErro] = useState(null);
  const [registrada, setRegistrada] = useState(null);

  useEffect(() => {
    const preSelecionado = params.get("projeto");
    if (preSelecionado) setProjeto(preSelecionado);
  }, [params]);

  const projetoSelecionado = (metas || []).find((m) => String(m.id) === String(projeto));

  const registrar = async () => {
    setErro(null);
    if (!valor || Number(valor) <= 0) {
      setErro("Informe um valor maior que zero.");
      return;
    }
    if (!isAuthed) {
      navigate("/login", { state: { from: `/doar?projeto=${projeto}` } });
      return;
    }
    try {
      const doacao = await criar.mutateAsync({
        valor: Number(valor).toFixed(2),
        metodo,
        recorrente,
        meta: projeto ? Number(projeto) : null,
      });
      setRegistrada(doacao);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setErro(mensagemDeErro(err, "Não foi possível registrar a doação."));
    }
  };

  if (registrada) {
    return (
      <div data-screen-label="Public — Doação registrada" className="fade-up">
        <SEO title="Doação registrada" />
        <section style={{ padding: "72px 0 96px" }}>
          <div className="wrap-narrow">
            <span className="eyebrow">Intenção de doação registrada</span>
            <h1 className="display" style={{ fontSize: "clamp(30px, 4vw, 52px)", margin: "18px 0 20px" }}>
              Obrigada. Recebemos seu registro.
            </h1>

            <div className="card" style={{ padding: 32 }}>
              <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                <div>
                  <span className="eyebrow">Valor</span>
                  <div className="stat-num" style={{ fontSize: 44, marginTop: 6 }}>
                    {BRL(registrada.valor)}
                    {registrada.recorrente && (
                      <span style={{ fontSize: 16, color: "var(--ink-3)" }}> / mês</span>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span className="tag tag-red tag-dot">Aguardando confirmação</span>
                  <div className="mono" style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 8 }}>
                    registro #{registrada.id} · {dataHoraBR(registrada.criada_em)}
                  </div>
                </div>
              </div>

              <hr className="divider" style={{ margin: "28px 0" }} />

              <div className="col gap-12" style={{ fontSize: 14 }}>
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <span style={{ color: "var(--ink-3)" }}>Destino</span>
                  <strong>{registrada.meta_titulo || "Onde for mais necessário"}</strong>
                </div>
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <span style={{ color: "var(--ink-3)" }}>Método informado</span>
                  <strong>
                    {METODOS.find((m) => m.id === registrada.metodo)?.label || registrada.metodo}
                  </strong>
                </div>
              </div>

              <div style={{ marginTop: 28 }}>
                <Notice tone="info">
                  A plataforma ainda não processa o pagamento online — o gateway está em definição
                  pela ONG. A equipe entra em contato pelo e-mail da sua conta com as instruções de
                  pagamento e confirma a doação no painel assim que o valor entrar. Dúvidas:{" "}
                  <strong>{EMAIL_DOACOES}</strong>.
                </Notice>
              </div>

              <div className="row gap-12" style={{ marginTop: 28, flexWrap: "wrap" }}>
                <Link to="/minha-conta" className="btn btn-primary">
                  Acompanhar na minha conta
                </Link>
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    setRegistrada(null);
                    setErro(null);
                  }}
                >
                  Registrar outra doação
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div data-screen-label="Public — Doar" className="fade-up">
      <SEO
        title="Doar"
        description="Registre sua doação com destino e prazo claros. PIX, transferência ou boleto."
      />
      <section style={{ padding: "64px 0 32px", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <span className="eyebrow">Como doar</span>
          <h1 className="display" style={{ fontSize: "clamp(34px, 5vw, 72px)", margin: "18px 0 0" }}>
            Sua doação tem destino e prazo.
          </h1>
        </div>
      </section>

      <section style={{ padding: "48px 0 96px" }}>
        <div className="wrap split">
          <div className="card" style={{ padding: 36 }}>
            <span className="eyebrow">1. Frequência</span>
            <div className="row gap-8" style={{ marginTop: 14, marginBottom: 32 }}>
              <button
                className={"btn " + (recorrente ? "btn-dark" : "btn-secondary")}
                onClick={() => setRecorrente(true)}
                style={{ flex: 1 }}
              >
                Mensal recorrente
              </button>
              <button
                className={"btn " + (!recorrente ? "btn-dark" : "btn-secondary")}
                onClick={() => setRecorrente(false)}
                style={{ flex: 1 }}
              >
                Doação única
              </button>
            </div>
            {recorrente && (
              <p className="helper" style={{ marginTop: -22, marginBottom: 24 }}>
                Contribuições recorrentes dão direito aos selos de sócio por tempo de contribuição.
              </p>
            )}

            <span className="eyebrow">2. Valor</span>
            <div
              style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 14 }}
            >
              {PRESETS.map((v) => (
                <button
                  key={v}
                  onClick={() => setValor(v)}
                  className="card"
                  style={{
                    padding: "16px 12px",
                    textAlign: "center",
                    cursor: "pointer",
                    background: valor === v ? "var(--red)" : "var(--bg-1)",
                    color: valor === v ? "white" : "var(--ink)",
                    borderColor: valor === v ? "var(--red)" : "var(--line)",
                  }}
                >
                  <div className="display" style={{ fontSize: 20 }}>
                    {BRL(v)}
                  </div>
                  {recorrente && <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>por mês</div>}
                </button>
              ))}
            </div>
            <div style={{ marginTop: 14 }}>
              <label className="label" htmlFor="valor-livre">
                Outro valor
              </label>
              <input
                id="valor-livre"
                className="input"
                type="number"
                min="1"
                step="0.01"
                placeholder="R$"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
              />
            </div>

            <hr className="divider" style={{ margin: "32px 0" }} />

            <span className="eyebrow">3. Direcionar a</span>
            <select
              className="select"
              style={{ marginTop: 14 }}
              value={projeto}
              onChange={(e) => setProjeto(e.target.value)}
              aria-label="Projeto de destino"
            >
              <option value="">Onde for mais necessário (recomendado)</option>
              {(metas || []).map((m) => (
                <option key={m.id} value={m.id}>
                  {m.titulo}
                  {m.regiao ? ` — ${m.regiao}` : ""}
                </option>
              ))}
            </select>

            <hr className="divider" style={{ margin: "32px 0" }} />

            <span className="eyebrow">4. Método pretendido</span>
            <div
              style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 14 }}
            >
              {METODOS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMetodo(m.id)}
                  className="card"
                  style={{
                    padding: 18,
                    textAlign: "left",
                    cursor: "pointer",
                    background: metodo === m.id ? "var(--bg-2)" : "var(--bg-1)",
                    borderColor: metodo === m.id ? "var(--ink)" : "var(--line)",
                  }}
                >
                  <div className="row gap-8" style={{ marginBottom: 6 }}>
                    <Icon name={m.icon} size={18} />
                    <strong style={{ fontSize: 14 }}>{m.label}</strong>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--ink-3)" }}>{m.sub}</div>
                </button>
              ))}
            </div>

            {erro && (
              <div style={{ marginTop: 20 }}>
                <Notice tone="erro">{erro}</Notice>
              </div>
            )}

            {!isAuthed && (
              <div style={{ marginTop: 20 }}>
                <Notice tone="info">
                  Para registrar a doação e receber os selos de sócio é preciso ter uma conta.{" "}
                  <Link to="/cadastro" style={{ color: "var(--red)", fontWeight: 600 }}>
                    Criar conta
                  </Link>{" "}
                  ou{" "}
                  <Link to="/login" style={{ color: "var(--red)", fontWeight: 600 }}>
                    entrar
                  </Link>
                  .
                </Notice>
              </div>
            )}

            <button
              className="btn btn-primary btn-lg"
              style={{ width: "100%", marginTop: 24 }}
              onClick={registrar}
              disabled={criar.isPending}
            >
              {criar.isPending ? (
                <>
                  <Spinner size={14} /> Registrando…
                </>
              ) : (
                <>
                  <Icon name="heart" size={16} /> {isAuthed ? "Registrar doação de" : "Entrar e doar"}{" "}
                  {BRL(valor)} {recorrente ? "/ mês" : ""}
                </>
              )}
            </button>
            <p className="helper" style={{ textAlign: "center", marginTop: 12 }}>
              O registro fica pendente até a equipe confirmar o recebimento. Você acompanha o status
              na sua conta.
            </p>
          </div>

          <aside>
            <div className="card" style={{ padding: 28 }}>
              <span className="eyebrow">Sua contribuição</span>
              <div
                className="stat-num"
                style={{ fontSize: 48, margin: "10px 0 6px", color: "var(--red)" }}
              >
                {BRL(valor)}
                {recorrente && <span style={{ fontSize: 18, color: "var(--ink-3)" }}> / mês</span>}
              </div>
              <p style={{ color: "var(--ink-3)", fontSize: 13, margin: 0 }}>
                Direcionado a{" "}
                {projetoSelecionado ? projetoSelecionado.titulo : "alocação dinâmica"}.
              </p>
              <hr className="divider" style={{ margin: "24px 0" }} />
              <p style={{ fontSize: 13, color: "var(--ink-3)", margin: 0, lineHeight: 1.55 }}>
                Cada doação confirmada entra no total público do projeto, no ranking (se você optar
                por aparecer) e conta para os selos de sócio.
              </p>
            </div>

            <div className="card" style={{ padding: 24, marginTop: 16 }}>
              <div className="row gap-12">
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "var(--r-sm)",
                    background: "var(--bg-2)",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon name="lock" size={16} />
                </div>
                <div>
                  <strong style={{ fontSize: 14 }}>Pagamento fora da plataforma</strong>
                  <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2, lineHeight: 1.5 }}>
                    O gateway de pagamento ainda está em definição pela ONG. Por enquanto nenhum dado
                    financeiro é coletado aqui — a equipe combina o pagamento por e-mail.
                  </div>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: 24, marginTop: 16 }}>
              <span className="eyebrow">Onde sua doação chega</span>
              <div className="col gap-8" style={{ marginTop: 12 }}>
                {(metas || []).slice(0, 4).map((m) => (
                  <Link
                    key={m.id}
                    to={`/projetos/${m.id}`}
                    className="row gap-8"
                    style={{ fontSize: 13, color: "var(--ink-2)" }}
                  >
                    <Icon name="chevronRight" size={14} /> {m.titulo}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
