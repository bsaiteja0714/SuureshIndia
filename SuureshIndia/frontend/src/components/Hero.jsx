import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const words = ["Trusted.", "Expert.", "Reliable.", "Precise."];

function Hero({ content }) {
  const [visible, setVisible] = useState(false);
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    setVisible(true);
    const interval = setInterval(() => {
      setWordIdx(i => (i + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const title = content?.heroTitle || "P.Suuresh & Associates";
  const subtitle = content?.heroSubtitle || "Tax Filing, GST Compliance, Audit Services, Corporate Advisory and Company Registration — all under one roof.";

  // Split title if it contains & for styling
  const titleParts = title.includes("&") ? title.split("&") : [title];

  return (
    <section style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      justifyContent: "center", position: "relative", overflow: "hidden",
      paddingTop: "100px"
    }}>
      {/* Subtle grid */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.15, pointerEvents: "none" }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={`h${i}`} style={{
            position: "absolute", height: "1px",
            background: "linear-gradient(90deg, transparent, var(--border), transparent)",
            top: `${10 * (i + 1)}%`, left: 0, right: 0
          }} />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={`v${i}`} style={{
            position: "absolute", width: "1px",
            background: "linear-gradient(180deg, transparent, var(--border), transparent)",
            left: `${12.5 * (i + 1)}%`, top: 0, bottom: 0
          }} />
        ))}
      </div>

      {/* Background glowing effects */}
      <div style={{
        position: "absolute", left: "-10%", top: "-10%",
        width: "50vw", height: "50vw", borderRadius: "50%",
        background: "radial-gradient(circle, var(--accent-dim) 0%, transparent 70%)",
        filter: "blur(80px)",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute", right: "-5%", bottom: "10%",
        width: "40vw", height: "40vw", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 60%)",
        filter: "blur(60px)",
        pointerEvents: "none"
      }} />

      <div className="container" style={{ position: "relative", zIndex: 1, padding: "4rem 2rem" }}>
        {/* Eyebrow */}
        <div className={visible ? "fade-up" : ""} style={{ marginBottom: "2rem", display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ display: "inline-block", width: "32px", height: "1px", background: "var(--accent)" }} />
          <span style={{ fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.15em", color: "var(--accent)", textTransform: "uppercase" }}>
            Chartered Accountancy Services
          </span>
        </div>

        {/* Headline */}
        <div style={{ marginBottom: "2.5rem" }}>
          <h1 className={visible ? "fade-up-delay-1" : ""} style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: "clamp(3rem, 9vw, 8rem)", lineHeight: 0.92,
            letterSpacing: "-0.03em", color: "var(--fg)"
          }}>
            {titleParts.map((part, index) => (
              <span key={index} style={{ display: "block" }}>
                {part.trim()} {index === 0 && titleParts.length > 1 ? "&" : ""}
              </span>
            ))}
            <span style={{ display: "block", color: "var(--accent)" }}>
              {words[wordIdx]}
            </span>
          </h1>
        </div>

        {/* Sub + CTA */}
        <div className={visible ? "fade-up-delay-2" : ""} style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "end",
          maxWidth: "900px"
        }}>
          <p style={{ fontSize: "1.15rem", color: "var(--muted)", lineHeight: 1.7 }}>
            {subtitle}
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link to="/contact" style={{
              background: "linear-gradient(135deg, var(--accent) 0%, #b89326 100%)", color: "#000",
              padding: "16px 36px", borderRadius: "100px",
              fontSize: "0.95rem", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "8px",
              boxShadow: "0 10px 25px rgba(212, 175, 55, 0.3)", transition: "transform 0.2s, box-shadow 0.2s"
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 15px 35px rgba(212, 175, 55, 0.4)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 10px 25px rgba(212, 175, 55, 0.3)"; }}>
              Book Consultation →
            </Link>
            <Link to="/services" style={{
              border: "1px solid var(--border)", color: "var(--fg)", background: "rgba(255,255,255,0.03)",
              padding: "16px 36px", borderRadius: "100px", backdropFilter: "blur(10px)",
              fontSize: "0.95rem", fontWeight: 500, transition: "background 0.2s, border-color 0.2s"
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "var(--border)"; }}>
              Our Services
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div className={visible ? "fade-up-delay-4" : ""} style={{
          display: "flex", gap: "3rem", marginTop: "5rem", paddingTop: "2.5rem",
          borderTop: "1px solid var(--border)", flexWrap: "wrap"
        }}>
          {[["15+", "Years Experience"], ["500+", "Clients Served"], ["1000+", "Tax Filings"]].map(([val, label]) => (
            <div key={label}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 700, color: "var(--fg)", lineHeight: 1 }}>{val}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "4px", letterSpacing: "0.05em" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

export default Hero;
