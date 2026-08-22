import { Link } from "react-router-dom";
import RankingTable from "../../components/RankingTable.jsx";
import SEO from "../../components/SEO.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";

export default function Ranking() {
  const { isAuthed } = useAuth();

  return (
    <div className="fade-up" data-screen-label="Public — Ranking">
      <SEO
        title="Ranking"
        description="Lista pública de doadores e empresas que mais contribuíram para a TPM."
      />
      <section style={{ padding: "64px 0 32px", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <span className="eyebrow">Ranking de doadores</span>
          <h1 className="display" style={{ fontSize: "clamp(34px, 5vw, 72px)", margin: "18px 0 16px" }}>
            Quem sustenta a maré.
          </h1>
          <p style={{ fontSize: 17, color: "var(--ink-2)", maxWidth: 620, margin: 0 }}>
            Lista pública de pessoas e empresas que mais contribuíram para a TPM. A participação é
            opcional — quem prefere doar anonimamente pode se retirar do ranking a qualquer momento.
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
                Os selos de sócio (Maré, Coral, Albatroz e os selos de recorrência) são definidos
                pelo total doado e pelo tempo de contribuição. Você controla a exibição do seu nome
                na sua própria conta.
              </p>
            </div>
            <Link to={isAuthed ? "/minha-conta" : "/cadastro"} className="btn btn-primary">
              {isAuthed ? "Gerenciar minha conta" : "Aparecer no ranking"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
