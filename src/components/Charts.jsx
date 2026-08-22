import { BRL } from "../lib/format.js";

const SemDados = ({ height, label = "Sem dados no período" }) => (
  <div
    style={{
      height,
      display: "grid",
      placeItems: "center",
      color: "var(--ink-3)",
      fontSize: 13,
      border: "1px dashed var(--line)",
      borderRadius: "var(--r-sm)",
    }}
  >
    {label}
  </div>
);

export const Sparkline = ({ data = [], height = 80, color = "var(--red)", id = "spark" }) => {
  const valores = (data || []).map((v) => Number(v) || 0);
  if (valores.length < 2) {
    return (
      <svg viewBox={`0 0 600 ${height}`} preserveAspectRatio="none" style={{ width: "100%", height, display: "block" }}>
        <line
          x1="0"
          y1={height - 6}
          x2="600"
          y2={height - 6}
          stroke="var(--line)"
          strokeWidth="2"
          strokeDasharray="4 6"
        />
      </svg>
    );
  }

  const w = 600;
  const max = Math.max(...valores);
  const min = Math.min(...valores);
  const range = max - min || 1;
  const stepX = w / (valores.length - 1);
  const pontos = valores.map((v, i) => [
    i * stepX,
    height - ((v - min) / range) * (height - 12) - 6,
  ]);
  const path = pontos
    .map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + "," + p[1].toFixed(1))
    .join(" ");
  const area = path + ` L${w},${height} L0,${height} Z`;
  const gradiente = `sparkfill-${id}`;

  return (
    <svg
      viewBox={`0 0 ${w} ${height}`}
      preserveAspectRatio="none"
      style={{ width: "100%", height, display: "block", overflow: "visible" }}
      aria-hidden
    >
      <defs>
        <linearGradient id={gradiente} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradiente})`} />
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const BarChart = ({ data = [], labels = [], height = 220, highlight = -1 }) => {
  const valores = (data || []).map((v) => Number(v) || 0);
  if (!valores.length) return <SemDados height={height} />;

  const max = Math.max(...valores);
  const escala = max > 0 ? max : 1;

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${valores.length}, 1fr)`,
          gap: 6,
          alignItems: "end",
          height,
        }}
      >
        {valores.map((v, i) => {
          const h = Math.max(v > 0 ? 3 : 1, (v / escala) * (height - 28));
          const isHi = i === (highlight < 0 ? valores.length - 1 : highlight);
          return (
            <div
              key={i}
              title={`${labels[i] || ""} · ${BRL(v)}`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                height: "100%",
                position: "relative",
              }}
            >
              {isHi && v > 0 && (
                <div
                  className="mono"
                  style={{ fontSize: 11, marginBottom: 4, color: "var(--ink)", fontWeight: 600 }}
                >
                  {BRL(v)}
                </div>
              )}
              <div
                style={{
                  width: "100%",
                  height: h,
                  background: isHi ? "var(--red)" : "var(--bg-2)",
                  borderRadius: "var(--r-sm) var(--r-sm) 0 0",
                  transition: "height .3s",
                  border: isHi ? "1px solid var(--red-deep)" : "1px solid var(--line)",
                  borderBottom: 0,
                }}
              />
            </div>
          );
        })}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${valores.length}, 1fr)`,
          gap: 6,
          marginTop: 8,
        }}
      >
        {valores.map((_, i) => (
          <div
            key={i}
            className="mono"
            style={{
              fontSize: 10,
              color: "var(--ink-3)",
              textAlign: "center",
              letterSpacing: ".04em",
              overflow: "hidden",
            }}
          >
            {labels[i] ?? ""}
          </div>
        ))}
      </div>
    </div>
  );
};

export const AdminLayout = ({ children, label }) => (
  <div
    data-screen-label={"Admin — " + label}
    style={{ background: "var(--bg-1)", minHeight: "calc(100vh - 68px)" }}
  >
    <div className="wrap admin-wrap" style={{ padding: "32px 32px 64px", maxWidth: 1400 }}>
      {children}
    </div>
  </div>
);
