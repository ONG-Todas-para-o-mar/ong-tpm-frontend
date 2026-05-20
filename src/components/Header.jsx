import { NavLink, useNavigate } from "react-router-dom";
import Icon from "./Icon.jsx";
import Mark from "./Mark.jsx";
import { useAuth } from "../hooks/useAuth.jsx";

const NAV_PUBLIC = [
  { to: "/", label: "Início", end: true },
  { to: "/sobre", label: "Sobre" },
  { to: "/projetos", label: "Projetos" },
  { to: "/noticias", label: "Notícias" },
  { to: "/doar", label: "Como doar" },
  { to: "/ranking", label: "Ranking" },
  { to: "/contato", label: "Contato" },
];

const NAV_ADMIN = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/ranking", label: "Ranking" },
];

export default function Header() {
  const { isAuthed, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const items = isAdmin ? NAV_ADMIN : NAV_PUBLIC;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="hdr">
      <div className="wrap hdr-inner">
        <div className="brand" onClick={() => navigate(isAdmin ? "/admin" : "/")}>
          <div className="brand-mark">
            <Mark size={52} />
          </div>
          <div className="brand-text">
            <div className="brand-name">Todas Para o Mar</div>
          </div>
        </div>
        <nav className="nav">
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
        <div className="hdr-cta">
          {isAdmin ? (
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
              <Icon name="logout" size={15} /> Sair
            </button>
          ) : isAuthed ? (
            <>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate("/admin")}>
                <Icon name="dashboard" size={15} /> Painel
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
        </div>
      </div>
    </header>
  );
}
