import Icon from "./Icon.jsx";

export default function AuthFrame({ title, eyebrow, children, side }) {
  return (
    <div
      style={{
        minHeight: "calc(100vh - 68px)",
        display: "grid",
        gridTemplateColumns: "1fr 1.1fr",
        background: "var(--bg)",
      }}
      data-screen-label={"Auth — " + eyebrow}
    >
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "64px 64px" }}>
        <div style={{ maxWidth: 420, width: "100%", margin: "0 auto" }}>
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="display" style={{ fontSize: "clamp(32px, 3.6vw, 48px)", margin: "16px 0 32px" }}>
            {title}
          </h1>
          {children}
        </div>
      </div>

      <div
        className="red-block"
        style={{
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
        }}
      >
        <div className="row gap-8" style={{ color: "rgba(255,255,255,0.7)" }}>
          <Icon name="waveDouble" size={16} />
          <span
            className="mono"
            style={{ fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase" }}
          >
            TPM · Plataforma 2026
          </span>
        </div>

        {side}

        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.1,
            backgroundImage:
              "repeating-linear-gradient(135deg, transparent 0 22px, rgba(255,255,255,.8) 22px 23px)",
          }}
        />
      </div>
    </div>
  );
}
