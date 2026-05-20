import { useState } from "react";
import Icon from "../../components/Icon.jsx";
import SEO from "../../components/SEO.jsx";
import { BRL } from "../../lib/format.js";
import { TPM_PROJECTS } from "../../data/mock.js";

const PRESETS = [30, 60, 120, 240, 500, 1000];
const METHODS = [
  { id: "pix", icon: "pix", label: "PIX", sub: "Instantâneo · sem taxa" },
  { id: "card", icon: "card", label: "Cartão", sub: "Crédito ou débito" },
  { id: "boleto", icon: "barcode", label: "Boleto", sub: "Compensa em 1–3 dias" },
];

export default function Donate() {
  const [amount, setAmount] = useState(120);
  const [recurring, setRecurring] = useState(true);
  const [method, setMethod] = useState("pix");
  const [project, setProject] = useState("any");

  return (
    <div data-screen-label="Public — Doar" className="fade-up">
      <SEO title="Doar" description="Faça uma doação com destino e prazo claros. PIX, cartão ou boleto." />
      <section style={{ padding: "64px 0 32px", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <span className="eyebrow">Como doar</span>
          <h1 className="display" style={{ fontSize: "clamp(40px, 5vw, 72px)", margin: "18px 0 0" }}>
            Sua doação tem destino e prazo.
          </h1>
        </div>
      </section>

      <section style={{ padding: "48px 0 96px" }}>
        <div className="wrap" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 56, alignItems: "start" }}>
          {/* Form */}
          <div className="card" style={{ padding: 36 }}>
            <span className="eyebrow">1. Frequência</span>
            <div className="row gap-8" style={{ marginTop: 14, marginBottom: 32 }}>
              <button
                className={"btn " + (recurring ? "btn-dark" : "btn-secondary")}
                onClick={() => setRecurring(true)}
                style={{ flex: 1 }}
              >
                Mensal recorrente
              </button>
              <button
                className={"btn " + (!recurring ? "btn-dark" : "btn-secondary")}
                onClick={() => setRecurring(false)}
                style={{ flex: 1 }}
              >
                Doação única
              </button>
            </div>

            <span className="eyebrow">2. Valor</span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 14 }}>
              {PRESETS.map((v) => (
                <button
                  key={v}
                  onClick={() => setAmount(v)}
                  className="card"
                  style={{
                    padding: "16px 12px",
                    textAlign: "center",
                    cursor: "pointer",
                    background: amount === v ? "var(--red)" : "var(--bg-1)",
                    color: amount === v ? "white" : "var(--ink)",
                    borderColor: amount === v ? "var(--red)" : "var(--line)",
                  }}
                >
                  <div className="display" style={{ fontSize: 22 }}>
                    {BRL(v)}
                  </div>
                  {recurring && <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>por mês</div>}
                </button>
              ))}
            </div>
            <div style={{ marginTop: 14 }}>
              <label className="label">Outro valor</label>
              <div className="row gap-8">
                <input
                  className="input"
                  type="number"
                  placeholder="R$"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value || 0))}
                />
              </div>
            </div>

            <hr className="divider" style={{ margin: "32px 0" }} />

            <span className="eyebrow">3. Direcionar a</span>
            <select
              className="select"
              style={{ marginTop: 14 }}
              value={project}
              onChange={(e) => setProject(e.target.value)}
            >
              <option value="any">Onde for mais necessário (recomendado)</option>
              {TPM_PROJECTS.filter((p) => p.status !== "Em breve").map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} — {p.region}
                </option>
              ))}
            </select>

            <hr className="divider" style={{ margin: "32px 0" }} />

            <span className="eyebrow">4. Método</span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 14 }}>
              {METHODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className="card"
                  style={{
                    padding: 18,
                    textAlign: "left",
                    cursor: "pointer",
                    background: method === m.id ? "var(--bg-2)" : "var(--bg-1)",
                    borderColor: method === m.id ? "var(--ink)" : "var(--line)",
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

            <button className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: 32 }}>
              <Icon name="heart" size={16} /> Doar {BRL(amount)} {recurring ? "/ mês" : ""}
            </button>
            <p className="helper" style={{ textAlign: "center", marginTop: 12 }}>
              Você receberá comprovante por e-mail e poderá acompanhar a alocação no seu painel.
            </p>
          </div>

          {/* Summary */}
          <aside>
            <div className="card" style={{ padding: 28 }}>
              <span className="eyebrow">Sua contribuição</span>
              <div className="stat-num" style={{ fontSize: 56, margin: "10px 0 6px", color: "var(--red)" }}>
                {BRL(amount)}
                {recurring && <span style={{ fontSize: 18, color: "var(--ink-3)" }}> / mês</span>}
              </div>
              <p style={{ color: "var(--ink-3)", fontSize: 13, margin: 0 }}>
                Direcionado a{" "}
                {project === "any"
                  ? "alocação dinâmica"
                  : TPM_PROJECTS.find((p) => p.id === project)?.title || "—"}
                .
              </p>
              <hr className="divider" style={{ margin: "24px 0" }} />
              <p style={{ fontSize: 13, color: "var(--ink-3)", margin: 0, lineHeight: 1.55 }}>
                Estimativas de impacto serão publicadas após auditoria dos próximos projetos.
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
                  }}
                >
                  <Icon name="lock" size={16} />
                </div>
                <div>
                  <strong style={{ fontSize: 14 }}>Pagamento seguro</strong>
                  <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>
                    Conexão criptografada · PCI-DSS · LGPD
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
