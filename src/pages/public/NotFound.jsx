import { Link, useLocation } from "react-router-dom";
import Icon from "../../components/Icon.jsx";
import SEO from "../../components/SEO.jsx";
import { WaveLine } from "../../components/Shared.jsx";
import { secaoVisivel } from "../../lib/secoes.js";

export default function NotFound() {
  const location = useLocation();

  return (
    <div data-screen-label="Public — 404" className="fade-up">
      <SEO title="Página não encontrada" />
      <section style={{ padding: "96px 0 120px" }}>
        <div className="wrap-narrow" style={{ textAlign: "center" }}>
          <div style={{ maxWidth: 240, margin: "0 auto 32px" }}>
            <WaveLine opacity={0.8} />
          </div>
          <span className="eyebrow">Erro 404</span>
          <h1 className="display" style={{ fontSize: "clamp(40px, 6vw, 80px)", margin: "18px 0 20px" }}>
            Essa onda não quebrou aqui.
          </h1>
          <p style={{ color: "var(--ink-2)", fontSize: 17, maxWidth: 520, margin: "0 auto 12px" }}>
            A página que você procurou não existe ou foi movida.
          </p>
          <p className="mono" style={{ fontSize: 12, color: "var(--ink-3)", marginBottom: 36 }}>
            {location.pathname}
          </p>

          <div className="row gap-12" style={{ justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/" className="btn btn-primary">
              <Icon name="arrowLeft" size={15} /> Voltar ao início
            </Link>
            {secaoVisivel("projetos") && (
              <Link to="/projetos" className="btn btn-secondary">
                Ver projetos
              </Link>
            )}
            {secaoVisivel("doacao") ? (
              <Link to="/doar" className="btn btn-ghost">
                Fazer uma doação <Icon name="arrow" size={14} />
              </Link>
            ) : (
              <Link to="/contato" className="btn btn-ghost">
                Fale com a gente <Icon name="arrow" size={14} />
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
