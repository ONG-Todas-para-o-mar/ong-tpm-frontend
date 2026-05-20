import { BRL } from "../lib/format.js";

export const Sparkline = ({ data, height = 80, color = "var(--red)" }) => {
  const w = 600;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const stepX = w / (data.length - 1);
  const points = data.map((v, i) => [i * stepX, height - ((v - min) / range) * (height - 12) - 6]);
  const path = points
    .map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + "," + p[1].toFixed(1))
    .join(" ");
  const area = path + ` L${w},${height} L0,${height} Z`;
  return (
    <svg
      viewBox={`0 0 ${w} ${height}`}
      preserveAspectRatio="none"
      style={{ width: "100%", height, display: "block", overflow: "visible" }}
    >
      <defs>
        <linearGradient id="sparkfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sparkfill)" />
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

export const BarChart = ({ data, labels, height = 220, highlight = -1 }) => {
  const max = Math.max(...data);
  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${data.length}, 1fr)`,
          gap: 6,
          alignItems: "end",
          height,
        }}
      >
        {data.map((v, i) => {
          const h = (v / max) * (height - 28);
          const isHi = i === (highlight < 0 ? data.length - 1 : highlight);
          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                height: "100%",
                position: "relative",
              }}
            >
              {isHi && (
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
          gridTemplateColumns: `repeat(${data.length}, 1fr)`,
          gap: 6,
          marginTop: 8,
        }}
      >
        {labels.map((l, i) => (
          <div
            key={i}
            className="mono"
            style={{
              fontSize: 10,
              color: "var(--ink-3)",
              textAlign: "center",
              letterSpacing: ".04em",
            }}
          >
            {l}
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
    <div className="wrap" style={{ padding: "32px 32px 64px", maxWidth: 1400 }}>
      {children}
    </div>
  </div>
);
