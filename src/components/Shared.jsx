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

export const Progress = ({ value, max = 100 }) => {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div style={{ position: "relative" }}>
      <div style={{ height: 6, background: "var(--bg-2)", borderRadius: 999, overflow: "hidden" }}>
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
  <div className="row gap-12" style={{ justifyContent: "center", padding: "48px 0", color: "var(--ink-3)" }}>
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

export const StatBlock = ({ value, label, sub }) => (
  <div>
    <div className="stat-num">{value}</div>
    <div style={{ marginTop: 8, fontSize: 13, color: "var(--ink-3)", lineHeight: 1.4 }}>
      <strong style={{ color: "var(--ink-2)", fontWeight: 600, display: "block" }}>{label}</strong>
      {sub}
    </div>
  </div>
);
