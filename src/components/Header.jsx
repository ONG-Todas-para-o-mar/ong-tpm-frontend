import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Icon from "./Icon.jsx";
import Mark from "./Mark.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import { useTheme } from "../hooks/useTheme.jsx";
import { secaoVisivel } from "../lib/secoes.js";

const NAV_PUBLIC = [
  { to: "/", label: "Início", end: true },
  { to: "/sobre", label: "Sobre" },
  { to: "/projetos", label: "Projetos", secao: "projetos" },
  { to: "/noticias", label: "Notícias" },
  { to: "/tpm-na-midia", label: "TPM na Mídia" },
  { to: "/fique-por-dentro", label: "Fique por dentro" },
  { to: "/socios", label: "Sócios", secao: "socios" },
  { to: "/contato", label: "Contato" },
].filter((it) => !it.secao || secaoVisivel(it.secao));

const NAV_ADMIN = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/campanhas", label: "Campanhas" },
  { to: "/admin/noticias", label: "Notícias" },
  { to: "/admin/midia", label: "Mídia" },
  { to: "/admin/doacoes", label: "Doações" },
  { to: "/admin/selos", label: "Selos" },
  { to: "/admin/mensagens", label: "Mensagens" },
  { to: "/admin/ranking", label: "Ranking" },
];

export default function Header() {
  const { isAuthed, isAdmin, logout } = useAuth();
  const { dark, toggleDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [aberto, setAberto] = useState(false);

  const items = isAdmin ? NAV_ADMIN : NAV_PUBLIC;

  useEffect(() => {
    setAberto(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", aberto);
    return () => document.body.classList.remove("no-scroll");
  }, [aberto]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const acoes = (
    <>
      <button
        className="btn btn-ghost btn-sm"
        onClick={toggleDark}
        aria-label={dark ? "Usar tema claro" : "Usar tema escuro"}
        title={dark ? "Tema claro" : "Tema escuro"}
      >
        <Icon name={dark ? "sun" : "moon"} size={15} />
      </button>
      {isAdmin ? (
        <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
          <Icon name="logout" size={15} /> Sair
        </button>
      ) : isAuthed ? (
        <>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate("/minha-conta")}>
            <Icon name="user" size={15} /> Minha conta
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate("/doar")}>
            Doar agora
          </button>
        </>
      ) : (
        <>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate("/login")}>
            Entrar
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate("/doar")}>
            Doar agora
          </button>
        </>
      )}
    </>
  );

  return (
    <header className="hdr">
      <div className="wrap hdr-inner">
        <div
          className="brand"
          role="link"
          tabIndex={0}
          onClick={() => navigate(isAdmin ? "/admin" : "/")}
          onKeyDown={(e) => e.key === "Enter" && navigate(isAdmin ? "/admin" : "/")}
        >
          <div className="brand-mark">
            <Mark size={52} />
          </div>
          <div className="brand-text">
            <div className="brand-name">Todas Para o Mar</div>
          </div>
        </div>

        <nav className="nav" aria-label="Navegação principal">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.end}
              className={({ isActive }) => "nav-link " + (isActive ? "active" : "")}
            >
              {it.label}
            </NavLink>
          ))}
        </nav>

        <div className="hdr-cta">{acoes}</div>

        <button
          className="nav-toggle"
          onClick={() => setAberto((a) => !a)}
          aria-expanded={aberto}
          aria-controls="menu-mobile"
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
        >
          <Icon name={aberto ? "close" : "menu"} size={20} />
        </button>
      </div>

      {aberto && (
        <div className="nav-mobile" id="menu-mobile">
          <nav aria-label="Navegação principal (mobile)">
            {items.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                end={it.end}
                className={({ isActive }) => "nav-mobile-link " + (isActive ? "active" : "")}
              >
                {it.label}
              </NavLink>
            ))}
          </nav>
          <div className="nav-mobile-cta">{acoes}</div>
        </div>
      )}
    </header>
  );
}
