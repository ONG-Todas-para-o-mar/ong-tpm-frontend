import { Link } from "react-router-dom";
import Mark from "./Mark.jsx";

export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div className="row gap-12" style={{ marginBottom: 14 }}>
              <div className="brand-mark" style={{ width: 56, height: 56 }}>
                <Mark size={56} />
              </div>
              <div>
                <div className="brand-name">Todas Para o Mar</div>
              </div>
            </div>
            <p style={{ color: "var(--ink-3)", fontSize: 14, maxWidth: 320, margin: 0 }}>
              Organização feminista e antirracista que democratiza o surf e empodera mulheres negras
              e seus filhos na Baía de Maracaípe, Litoral Sul de Pernambuco. Desde 2016.
            </p>
            <div className="row gap-8" style={{ marginTop: 18 }}>
              <span className="tag mono">CNPJ 32.418.902/0001-44</span>
            </div>
          </div>
          <div>
            <h4>Plataforma</h4>
            <Link to="/sobre">Sobre a ONG</Link>
            <Link to="/projetos">Projetos</Link>
            <Link to="/noticias">Notícias</Link>
            <Link to="/ranking">Ranking</Link>
          </div>
          <div>
            <h4>Apoie</h4>
            <Link to="/doar">Como doar</Link>
            <Link to="/doar">Doação recorrente</Link>
            <Link to="/contato">Parcerias</Link>
            <Link to="/contato">Voluntariado</Link>
          </div>
          <div>
            <h4>Transparência</h4>
            <a>Relatórios anuais</a>
            <a>Auditoria independente</a>
            <a>Política de privacidade</a>
            <a>Estatuto</a>
          </div>
        </div>
        <div className="foot-bot">
          <div>© 2026 TPM · Todas Para o Mar. Organização sem fins lucrativos.</div>
          <div className="row gap-16">
            <span
              className="mono"
              style={{ fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase" }}
            >
              hello@tpmar.org · +55 (81) 3000-0000
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
