import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageBanner from "../components/PageBanner";
import { legalPagesAPI } from "../services/api";

// Helper to extract text from Portable Text blocks for the simple view
const getBlockText = (blocks) => {
  if (!blocks || !Array.isArray(blocks)) return "";
  return blocks
    .map(block => {
      if (block._type !== 'block' || !block.children) return '';
      return block.children.map(child => child.text).join('');
    })
    .join('\n\n');
};

// ── Shared TOC sidebar ────────────────────────────────────────────────────
function LegalLayout({ type }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("");

  useEffect(() => {
    setLoading(true);
    legalPagesAPI.get(type)
      .then((res) => {
        setData(res);
        if (res?.sections?.length > 0) {
          setActive(res.sections[0]._key || 0);
        }
      })
      .catch((err) => console.error("Error loading legal page:", err))
      .finally(() => setLoading(false));
  }, [type]);

  function handleAnchor(id) {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const y = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActive(id);
    }
  }

  const title = data?.title || "";
  const subtitle = data?.subtitle || "";
  const sections = data?.sections || [];

  return (
    <>
      <Navbar />
      <PageBanner title={title} subtitle={subtitle} />
      <section style={{ padding: "5rem 0", background: "var(--bg)" }}>
        <div
          className="container legal-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "240px 1fr",
            gap: "3rem",
            alignItems: "start",
          }}
        >
          {/* Sidebar TOC */}
          <aside
            className="legal-toc"
            style={{
              position: "sticky",
              top: "6rem",
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              padding: "1.5rem",
            }}
          >
            <div
              style={{
                fontSize: "0.7rem",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "var(--accent)",
                fontWeight: 600,
                marginBottom: "1rem",
              }}
            >
              Contents
            </div>
            <nav
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
              }}
            >
              {loading ? (
                <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Loading...</p>
              ) : sections.length === 0 ? (
                <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>No sections.</p>
              ) : (
                sections.map((s, index) => {
                  const id = s._key || index;
                  return (
                    <button
                      key={id}
                      onClick={() => handleAnchor(id)}
                      style={{
                        textAlign: "left",
                        background: "none",
                        border: "none",
                        padding: "0.45rem 0.75rem",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "0.82rem",
                        fontWeight: active === id ? 600 : 400,
                        color: active === id ? "var(--accent)" : "var(--muted)",
                        background:
                          active === id ? "var(--accent-dim)" : "transparent",
                        transition: "all 0.2s",
                      }}
                    >
                      {s.title}
                    </button>
                  );
                })
              )}
            </nav>
          </aside>

          {/* Content */}
          <div style={{ maxWidth: 700, lineHeight: 1.8 }}>
            {loading ? (
              <p style={{ color: "var(--muted)", textAlign: "center", padding: "3rem" }}>Loading content...</p>
            ) : sections.length === 0 ? (
              <p style={{ color: "var(--muted)", padding: "3rem 0" }}>This policy is currently being updated. Please check back later.</p>
            ) : (
              sections.map((s, index) => {
                const id = s._key || index;
                return (
                  <div
                    key={id}
                    id={id}
                    style={{ marginBottom: "3rem", scrollMarginTop: "7rem" }}
                  >
                    <h2
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.35rem",
                        color: "var(--fg)",
                        marginBottom: "1rem",
                        paddingBottom: "0.75rem",
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      {index + 1}. {s.title}
                    </h2>
                    <div style={{
                      color: "var(--muted)",
                      fontSize: "0.95rem",
                      lineHeight: 1.85,
                      whiteSpace: "pre-line",
                    }}>
                      {getBlockText(s.content)}
                    </div>
                  </div>
                );
              })
            )}

            {!loading && data && (
              <div
                style={{
                  fontSize: "0.78rem",
                  color: "var(--muted)",
                  borderTop: "1px solid var(--border)",
                  paddingTop: "2rem",
                  marginTop: "2rem",
                }}
              >
                <p>
                  {data.lastUpdated && `Last updated: ${new Date(data.lastUpdated).toLocaleDateString()}. `}
                  {data.contactEmail && (
                    <>
                      For questions contact{" "}
                      <a
                        href={`mailto:${data.contactEmail}`}
                        style={{ color: "var(--accent)" }}
                      >
                        {data.contactEmail}
                      </a>
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />

      <style>{`
        @media(max-width:900px){
          .legal-grid { grid-template-columns: 1fr !important; }
          .legal-toc  { display: none; }
        }
      `}</style>
    </>
  );
}

export function Terms() {
  return (
    <LegalLayout type="terms" />
  );
}

export function Privacy() {
  return (
    <LegalLayout type="privacy" />
  );
}

export function Disclaimer() {
  return (
    <LegalLayout type="disclaimer" />
  );
}

export function Sitemap() {
  return (
    <LegalLayout type="sitemap" />
  );
}
