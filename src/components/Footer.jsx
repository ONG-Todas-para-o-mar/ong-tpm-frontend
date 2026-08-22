import { Link } from "react-router-dom";
import Icon from "./Icon.jsx";
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
            <div className="row gap-8" style={{ marginTop: 18, flexWrap: "wrap" }}>
              <span className="tag mono">CNPJ 32.418.902/0001-44</span>
              <a
                className="tag mono"
                href="https://instagram.com/tpm.todasparaomar"
                target="_blank"
                rel="noreferrer noopener"
              >
                <Icon name="instagram" size={12} /> @tpm.todasparaomar
              </a>
            </div>
          </div>

          <div>
            <h4>Plataforma</h4>
            <Link to="/sobre">Sobre a ONG</Link>
            <Link to="/projetos">Projetos</Link>
            <Link to="/noticias">Notícias</Link>
            <Link to="/tpm-na-midia">TPM na Mídia</Link>
            <Link to="/fique-por-dentro">Fique por dentro</Link>
            <Link to="/socios">Selos de sócio</Link>
            <Link to="/ranking">Ranking de doadores</Link>
          </div>

          <div>
            <h4>Apoie</h4>
            <Link to="/doar">Como doar</Link>
            <Link to="/doar">Doação recorrente</Link>
            <Link to="/contato">Parcerias</Link>
            <Link to="/contato">Voluntariado</Link>
            <Link to="/cadastro">Criar conta</Link>
          </div>

          <div>
            <h4>Transparência</h4>
            <Link to="/transparencia">Prestação de contas</Link>
            <Link to="/noticias">Relatórios publicados</Link>
            <Link to="/transparencia">Registros de impacto</Link>
            <Link to="/contato">Falar com a diretoria</Link>
          </div>
        </div>

        <div className="foot-bot">
          <div>© 2026 TPM · Todas Para o Mar. Organização sem fins lucrativos.</div>
          <div className="row gap-16">
            <a
              className="mono"
              href="mailto:hello@tpmar.org"
              style={{ fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase" }}
            >
              hello@tpmar.org · +55 (81) 3000-0000
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
