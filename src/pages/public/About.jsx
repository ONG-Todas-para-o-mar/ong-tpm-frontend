import { PH } from "../../components/Shared.jsx";
import SEO from "../../components/SEO.jsx";
import { FOTO_SOBRE } from "../../data/fotos.js";
import { secaoVisivel } from "../../lib/secoes.js";

const PILAR_TRANSPARENCIA = {
  n: "03",
  t: "Transparência ativa",
  d: "Relatórios trimestrais auditados, extratos públicos e rastreabilidade de cada doação até a aplicação final.",
};

const PILAR_CULTURA = {
  n: "03",
  t: "Cultura e convivência",
  d: "Cineclube TPM – Tela, Pipoca e Mar e encontros de cinema, memória e celebração na comunidade.",
};

// Atividades e marcos conferidos em reportagens (Terra, Marco Zero, Waves, Lupa do
// Bem, Continente, Alma Preta, Brasil de Fato), no Diário Oficial e na Receita Federal.
const ATIVIDADES = [
  { t: "Inclua Surf TPM", d: "Aulas gratuitas de surfe aos sábados para crianças e adolescentes de 7 a 17 anos da comunidade." },
  { t: "Surf Day", d: "Encontro mensal com aulas de surfe para mulheres, ioga e rodas de conversa." },
  { t: "Maraca Surf Festival", d: "Campeonato de surfe feminino que dá visibilidade às mulheres e às surfistas negras desde 2016." },
  { t: "Educação", d: "Reforço escolar, idiomas, alfabetização e letramento racial." },
  { t: "Cultura", d: "Capoeira, maracatu, teatro, dança e o Cineclube TPM – Tela, Pipoca e Mar." },
  { t: "Inclua Mulheres", d: "Geração de renda para as mulheres da comunidade com artesanato e pesca." },
];

const LINHA_DO_TEMPO = [
  { y: "2016", t: "Idealização por Nuala Costa", d: "A ex-surfista profissional inicia as ações na Baía de Maracaípe; em agosto acontece o 1º Maraca Surf Festival, de surfe feminino." },
  { y: "2021", t: "5º TPM Surf Festival", d: "Três dias de campeonato, rodas de conversa, oficinas e música na praia de Maracaípe, no encerramento do mês da Consciência Negra." },
  { y: "2022", t: "Associação formalizada", d: "Registro da Associação de Mulheres TPM – Todas Para o Mar, presidida por Nuala Costa." },
  { y: "2024", t: "Prêmio Periferia Viva", d: "A TPM é selecionada pelo Ministério das Cidades na categoria Cultura e Identidade Periférica." },
  { y: "2025", t: "Na ONU", d: "Nuala Costa fala sobre racismo no surfe na consulta regional da ONU sobre racismo no esporte, na Cidade do México." },
  { y: "2025", t: "Plataforma digital", d: "Doações diretas e dashboard público de prestação de contas.", secao: "doacao" },
  { y: "2026", t: "Selos de sócio e ranking", d: "Reconhecimento público de doadores recorrentes e empresas parceiras.", secao: "socios" },
];

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
        <div className="wrap" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 64, alignItems: "start" }}>
          <div>
            <span className="eyebrow">Nossa história</span>
            <p style={{ fontSize: 16, color: "var(--ink-2)", marginTop: 16, lineHeight: 1.65 }}>
              A TPM foi idealizada em 2016 pela ex-surfista profissional{" "}
              <strong style={{ color: "var(--ink)" }}>Nuala Costa</strong>, na Baía de Maracaípe,
              Litoral Sul de Pernambuco. Nasceu como instituição socioeducativa voltada a crianças,
              adolescentes e mulheres da comunidade.
            </p>
            <p style={{ fontSize: 16, color: "var(--ink-2)", marginTop: 16, lineHeight: 1.65 }}>
              Nuala foi a primeira mulher — e a primeira mulher negra — a representar Pernambuco em
              competições de surfe, e hoje coordena a TPM.
            </p>
            <p style={{ fontSize: 16, color: "var(--ink-2)", marginTop: 16, lineHeight: 1.65 }}>
              Atuamos na <strong style={{ color: "var(--ink)" }}>democratização do surf</strong>, no
              empreendedorismo e na promoção do bem-viver — com foco no empoderamento de
              <strong style={{ color: "var(--ink)" }}> mulheres negras e seus filhos</strong>, e em
              compromisso com os ODS 5, 10 e 16 da ONU.
            </p>
          </div>
          <PH label="foto — equipe & beneficiárias" src={FOTO_SOBRE} ratio="4/3" />
        </div>
      </section>

      <section style={{ padding: "56px 0 72px", borderTop: "1px solid var(--line)" }}>
        <div className="wrap">
          <span className="eyebrow">O que fazemos</span>
          <h2 className="display" style={{ fontSize: "clamp(26px, 3vw, 44px)", margin: "10px 0 32px" }}>
            Do mar para a comunidade.
          </h2>
          <div className="g3">
            {ATIVIDADES.map((a) => (
              <article key={a.t} className="card" style={{ padding: 26 }}>
                <h3 className="display" style={{ fontSize: 20, margin: "0 0 8px" }}>
                  {a.t}
                </h3>
                <p style={{ color: "var(--ink-3)", fontSize: 14, margin: 0, lineHeight: 1.55 }}>{a.d}</p>
              </article>
            ))}
          </div>
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
                secaoVisivel("transparencia") ? PILAR_TRANSPARENCIA : PILAR_CULTURA,
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
              {LINHA_DO_TEMPO.filter((e) => !e.secao || secaoVisivel(e.secao)).map((e, i, arr) => (
                <div
                  key={e.y + e.t}
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
