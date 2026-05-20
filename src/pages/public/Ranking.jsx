import RankingTable from "../../components/RankingTable.jsx";
import SEO from "../../components/SEO.jsx";

export default function Ranking() {
  return (
    <div className="fade-up" data-screen-label="Public — Ranking">
      <SEO title="Ranking" description="Lista pública de doadores e empresas que mais contribuíram para a TPM." />
      <section style={{ padding: "64px 0 32px", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <span className="eyebrow">Ranking de doadores</span>
          <h1 className="display" style={{ fontSize: "clamp(40px, 5vw, 72px)", margin: "18px 0 16px" }}>
            Quem sustenta a maré.
          </h1>
          <p style={{ fontSize: 17, color: "var(--ink-2)", maxWidth: 620, margin: 0 }}>
            Lista pública de pessoas e empresas que mais contribuíram para a TPM. A participação no
            ranking é opcional — quem prefere doar anonimamente aparece com apelido.
          </p>
        </div>
      </section>

      <section style={{ padding: "32px 0 96px" }}>
        <div className="wrap">
          <RankingTable isAdmin={false} />

          <div
            className="card"
            style={{
              padding: 28,
              marginTop: 40,
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 32,
              alignItems: "center",
            }}
          >
            <div>
              <span className="eyebrow">Sobre o ranking</span>
              <h3 className="display" style={{ fontSize: 24, margin: "10px 0 8px" }}>
                Reconhecimento, não competição.
              </h3>
              <p style={{ color: "var(--ink-2)", margin: 0, fontSize: 14, maxWidth: 600 }}>
                Os tiers (Albatroz, Coral, Maré) são definidos pelo total doado em 12 meses. Você pode
                optar por aparecer anonimamente — basta marcar essa opção no seu painel.
              </p>
            </div>
            <button className="btn btn-primary">Aparecer no ranking</button>
          </div>
        </div>
      </section>
    </div>
  );
}
