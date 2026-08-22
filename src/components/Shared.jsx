import { useEffect } from "react";
import Icon from "./Icon.jsx";
import { iniciais } from "../lib/format.js";

export const PH = ({ label, ratio = "16/10", style, src }) => {
  if (src) {
    return (
      <div
        className="ph"
        style={{
          aspectRatio: ratio,
          padding: 0,
          overflow: "hidden",
          ...style,
        }}
      >
        <img
          src={src}
          alt={label}
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
    );
  }
  return (
    <div className="ph" style={{ aspectRatio: ratio, ...style }}>
      <span>{label}</span>
    </div>
  );
};

export const WaveLine = ({ opacity = 0.5 }) => (
  <svg
    className="wave-rule"
    viewBox="0 0 600 14"
    preserveAspectRatio="none"
    style={{ opacity }}
    aria-hidden
  >
    <path
      d="M0 7c30 0 30-6 60-6s30 6 60 6 30-6 60-6 30 6 60 6 30-6 60-6 30 6 60 6 30-6 60-6 30 6 60 6 30-6 60-6 30 6 60 6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const Progress = ({ value, max = 100, label }) => {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div style={{ position: "relative" }}>
      <div
        style={{ height: 6, background: "var(--bg-2)", borderRadius: 999, overflow: "hidden" }}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || "Progresso da campanha"}
      >
        <div
          style={{
            width: pct + "%",
            height: "100%",
            background: "var(--red)",
            borderRadius: 999,
            transition: "width .4s",
          }}
        />
      </div>
    </div>
  );
};

export const Spinner = ({ size = 18 }) => (
  <span
    aria-label="Carregando"
    role="status"
    style={{
      display: "inline-block",
      width: size,
      height: size,
      border: "2px solid var(--line)",
      borderTopColor: "var(--red)",
      borderRadius: "50%",
      animation: "spin .8s linear infinite",
    }}
  />
);

export const LoadingState = ({ label = "Carregando…" }) => (
  <div
    className="row gap-12"
    style={{ justifyContent: "center", padding: "48px 0", color: "var(--ink-3)" }}
  >
    <Spinner /> <span style={{ fontSize: 14 }}>{label}</span>
  </div>
);

export const ErrorState = ({ message = "Erro ao carregar dados.", onRetry }) => (
  <div style={{ padding: "32px 0", textAlign: "center", color: "var(--ink-3)" }}>
    <div style={{ fontSize: 14, marginBottom: onRetry ? 12 : 0 }}>{message}</div>
    {onRetry && (
      <button className="btn btn-secondary btn-sm" onClick={onRetry}>
        Tentar novamente
      </button>
    )}
  </div>
);

export const EmptyState = ({ title, description, action }) => (
  <div style={{ padding: "56px 24px", textAlign: "center" }}>
    <div className="display" style={{ fontSize: 20, marginBottom: 8 }}>
      {title}
    </div>
    {description && (
      <p style={{ color: "var(--ink-3)", fontSize: 14, maxWidth: 420, margin: "0 auto" }}>
        {description}
      </p>
    )}
    {action && <div style={{ marginTop: 20 }}>{action}</div>}
  </div>
);

export const StatBlock = ({ value, label, sub }) => (
  <div>
    <div className="stat-num">{value}</div>
    <div style={{ marginTop: 8, fontSize: 13, color: "var(--ink-3)", lineHeight: 1.4 }}>
      <strong style={{ color: "var(--ink-2)", fontWeight: 600, display: "block" }}>{label}</strong>
      {sub}
    </div>
  </div>
);

const TONS = {
  info: { bg: "var(--bg-2)", fg: "var(--ink-2)" },
  sucesso: { bg: "var(--red-soft)", fg: "var(--red-ink)" },
  erro: { bg: "var(--red-soft)", fg: "var(--red-ink)" },
};

export const Notice = ({ tone = "info", children, onDismiss }) => {
  const cor = TONS[tone] || TONS.info;
  return (
    <div
      role={tone === "erro" ? "alert" : "status"}
      className="row gap-12"
      style={{
        padding: "12px 14px",
        background: cor.bg,
        color: cor.fg,
        borderRadius: "var(--r-sm)",
        fontSize: 13,
        lineHeight: 1.5,
        alignItems: "flex-start",
      }}
    >
      <span style={{ flex: 1 }}>{children}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Fechar aviso"
          style={{ background: "none", border: 0, cursor: "pointer", padding: 0, opacity: 0.7 }}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export const Avatar = ({ nome, size = 38, destaque = false }) => (
  <div
    aria-hidden
    style={{
      width: size,
      height: size,
      borderRadius: "var(--r-sm)",
      background: destaque ? "var(--red)" : "var(--bg-2)",
      color: destaque ? "white" : "var(--ink-2)",
      display: "grid",
      placeItems: "center",
      fontFamily: "var(--f-display)",
      fontSize: size * 0.36,
      fontWeight: 600,
      flexShrink: 0,
    }}
  >
    {iniciais(nome)}
  </div>
);

export const SeloTag = ({ selo, size = 12 }) => {
  if (!selo?.nome) return null;
  return (
    <span
      className="tag"
      style={{
        fontSize: 10,
        background: selo.cor ? `${selo.cor}22` : "var(--bg-2)",
        color: selo.cor || "var(--ink-2)",
      }}
      title={selo.descricao || selo.nome}
    >
      <Icon name={selo.icone && selo.icone !== "shell" && selo.icone !== "wing" ? selo.icone : "medal"} size={size} />
      {selo.nome}
    </span>
  );
};

export const RichText = ({ children }) => (
  <div style={{ display: "grid", gap: 18 }}>
    {String(children || "")
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p, i) => (
        <p key={i} style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: "var(--ink-2)" }}>
          {p}
        </p>
      ))}
  </div>
);

export function Modal({ title, onClose, children, width = 640 }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.classList.add("no-scroll");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("no-scroll");
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,.45)",
        display: "grid",
        placeItems: "center",
        padding: 20,
        overflowY: "auto",
      }}
    >
      <div
        className="card"
        style={{ width: "100%", maxWidth: width, background: "var(--bg-1)", margin: "auto" }}
      >
        <div
          className="row"
          style={{
            justifyContent: "space-between",
            padding: "20px 24px",
            borderBottom: "1px solid var(--line)",
          }}
        >
          <h2 className="display" style={{ fontSize: 20, margin: 0 }}>
            {title}
          </h2>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onClose}
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}
