import { PH } from "../../components/Shared.jsx";
import SEO from "../../components/SEO.jsx";
import { TPM_ABOUT_IMAGE } from "../../data/mock.js";

export default function About() {
  return (
    <div data-screen-label="Public — Sobre" className="fade-up">
      <SEO title="Sobre" description="Organização feminista e antirracista que democratiza o surf e empodera mulheres negras no Litoral Sul de Pernambuco." />
      <section style={{ padding: "64px 0 48px", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <span className="eyebrow">Sobre a TPM</span>
          <h1 className="display" style={{ fontSize: "clamp(40px, 5vw, 72px)", margin: "18px 0 0", maxWidth: 900 }}>
            Organização feminista e antirracista que faz do mar uma porta de entrada para
            oportunidade.
          </h1>
        </div>
      </section>

      <section style={{ padding: "64px 0" }}>
        <div className="wrap" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 80, alignItems: "start" }}>
          <div>
            <span className="eyebrow">Nossa história</span>
            <p style={{ fontSize: 16, color: "var(--ink-2)", marginTop: 16, lineHeight: 1.65 }}>
              A TPM foi idealizada em 2016 pela ex-surfista profissional{" "}
              <strong style={{ color: "var(--ink)" }}>Nuala Costa</strong>, na Baía de Maracaípe,
              Litoral Sul de Pernambuco. Nasceu como instituição socioeducativa voltada a crianças,
              adolescentes e mulheres da comunidade.
            </p>
            <p style={{ fontSize: 16, color: "var(--ink-2)", marginTop: 16, lineHeight: 1.65 }}>
              Atuamos na <strong style={{ color: "var(--ink)" }}>democratização do surf</strong>, no
              empreendedorismo e na promoção do bem-viver — com foco no empoderamento de
              <strong style={{ color: "var(--ink)" }}> mulheres negras e seus filhos</strong>, e em
              compromisso com os ODS 5, 10 e 16 da ONU.
            </p>
          </div>
          <PH label="foto — equipe & beneficiárias" src={TPM_ABOUT_IMAGE} ratio="4/3" />
        </div>
      </section>

      <section style={{ padding: "32px 0 96px", borderTop: "1px solid var(--line)" }}>
        <div className="wrap">
          <div style={{ paddingTop: 56 }}>
            <span className="eyebrow">Pilares</span>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 1,
                background: "var(--line)",
                marginTop: 24,
                border: "1px solid var(--line)",
                borderRadius: "var(--r-card)",
                overflow: "hidden",
              }}
            >
              {[
                { n: "01", t: "Democratização do surf", d: "Acesso gratuito ao surf para crianças e adolescentes da comunidade da Baía de Maracaípe, com pranchas, aulas e acompanhamento contínuo." },
                { n: "02", t: "Empoderamento feminino e antirracismo", d: "Formação profissional, empreendedorismo e apoio psicossocial para mulheres negras chefes de família." },
                { n: "03", t: "Transparência ativa", d: "Relatórios trimestrais auditados, extratos públicos e rastreabilidade de cada doação até a aplicação final." },
              ].map((p) => (
                <div key={p.n} style={{ background: "var(--bg-1)", padding: "36px 28px" }}>
                  <div className="mono" style={{ fontSize: 12, color: "var(--red)", letterSpacing: ".1em" }}>
                    {p.n}
                  </div>
                  <h3 className="display" style={{ fontSize: 22, margin: "12px 0 10px" }}>
                    {p.t}
                  </h3>
                  <p style={{ color: "var(--ink-3)", fontSize: 14, margin: 0, lineHeight: 1.55 }}>{p.d}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 80 }}>
            <span className="eyebrow">Linha do tempo</span>
            <div style={{ marginTop: 32, display: "grid", gap: 0 }}>
              {[
                { y: "2016", t: "Idealização por Nuala Costa", d: "Ex-surfista profissional inicia ações socioeducativas na Baía de Maracaípe." },
                { y: "2018", t: "Primeiras turmas de surf", d: "Aulas gratuitas para crianças e adolescentes da comunidade local." },
                { y: "2021", t: "Consolidação como ONG", d: "Estatuto registrado e formalização da atuação feminista e antirracista." },
                { y: "2023", t: "Expansão para empreendedorismo", d: "Programas de geração de renda para mulheres negras chefes de família." },
                { y: "2025", t: "Plataforma digital", d: "Doações diretas e dashboard público de prestação de contas." },
                { y: "2026", t: "Gamificação e ranking", d: "Reconhecimento público de doadores recorrentes e empresas parceiras." },
              ].map((e, i, arr) => (
                <div
                  key={e.y}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "120px 1fr",
                    gap: 32,
                    padding: "24px 0",
                    borderTop: i === 0 ? "1px solid var(--line-strong)" : "1px solid var(--line)",
                    borderBottom: i === arr.length - 1 ? "1px solid var(--line-strong)" : "none",
                  }}
                >
                  <div className="display" style={{ fontSize: 32, color: "var(--red)" }}>
                    {e.y}
                  </div>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 6 }}>{e.t}</div>
                    <div style={{ fontSize: 14, color: "var(--ink-3)" }}>{e.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
