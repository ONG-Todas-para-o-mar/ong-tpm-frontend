import Icon from "../../components/Icon.jsx";
import { PH } from "../../components/Shared.jsx";
import SEO from "../../components/SEO.jsx";
import { TPM_POSTS } from "../../data/mock.js";

export default function Blog() {
  const featured = TPM_POSTS[0];
  const rest = TPM_POSTS.slice(1);

  return (
    <div data-screen-label="Public — Notícias" className="fade-up">
      <SEO title="Notícias" description="Atualizações, relatórios e bastidores dos projetos da TPM." />
      <section style={{ padding: "64px 0 32px", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <span className="eyebrow">Notícias e transparência</span>
          <h1 className="display" style={{ fontSize: "clamp(40px, 5vw, 72px)", margin: "18px 0 0" }}>
            Atualizações, relatórios e bastidores.
          </h1>
        </div>
      </section>

      <section style={{ padding: "56px 0 96px" }}>
        <div className="wrap">
          <article
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr",
              gap: 56,
              alignItems: "center",
              paddingBottom: 56,
              borderBottom: "1px solid var(--line)",
            }}
          >
            <PH label={"foto — " + featured.title} src={featured.image} ratio="4/3" />
            <div>
              <div className="row gap-8" style={{ marginBottom: 14 }}>
                <span className="tag tag-red">{featured.category}</span>
                <span className="mono muted" style={{ fontSize: 12 }}>
                  {featured.date}
                </span>
              </div>
              <h2 className="display" style={{ fontSize: 40, margin: "0 0 16px", lineHeight: 1.1 }}>
                {featured.title}
              </h2>
              <p style={{ color: "var(--ink-2)", fontSize: 16, margin: 0, lineHeight: 1.6, maxWidth: 480 }}>
                {featured.excerpt}
              </p>
              <button className="btn btn-secondary" style={{ marginTop: 24 }}>
                Ler matéria completa <Icon name="arrow" size={14} />
              </button>
            </div>
          </article>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32, marginTop: 56 }}>
            {rest.map((p) => (
              <article key={p.id}>
                <PH label={p.title} src={p.image} ratio="4/3" />
                <div className="row gap-8" style={{ marginTop: 18 }}>
                  <span className="tag">{p.category}</span>
                  <span className="mono muted" style={{ fontSize: 12 }}>
                    {p.date}
                  </span>
                </div>
                <h3 className="display" style={{ fontSize: 22, margin: "10px 0 8px", lineHeight: 1.2 }}>
                  {p.title}
                </h3>
                <p style={{ color: "var(--ink-3)", fontSize: 14, margin: 0, lineHeight: 1.55 }}>
                  {p.excerpt}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
