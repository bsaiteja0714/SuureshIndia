function AboutSection({ content }) {
  const title = content?.aboutTitle || "";
  const desc = content?.aboutDescription || "";

  return (
    <section style={{ padding: "7rem 0", borderTop: "1px solid var(--border)" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
          <div>
            <span style={{
              fontSize: "0.75rem", letterSpacing: "0.15em", color: "var(--accent)",
              textTransform: "uppercase", fontWeight: 500
            }}>About Us</span>
            <h2 style={{
              fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
              fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1,
              marginTop: "1.5rem", color: "var(--fg)"
            }}>
              {title}
            </h2>
          </div>
          <div>
            <p style={{ color: "var(--muted)", lineHeight: 1.85, fontSize: "1.05rem", whiteSpace: "pre-line" }}>
              {desc}
            </p>
            <div style={{
              marginTop: "2.5rem", padding: "1.5rem 2rem",
              background: "linear-gradient(145deg, rgba(201,169,110,0.1) 0%, rgba(15,23,42,0.8) 100%)", 
              borderRadius: "var(--radius)",
              border: "1px solid rgba(201,169,110,0.3)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              backdropFilter: "blur(10px)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 10px #22c55e", animation: "pulse-dot 2s infinite" }} />
                <span style={{ fontSize: "0.9rem", color: "var(--accent)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>  {content?.aboutCardTitle || "Currently Accepting New Clients"} </span>
              </div>
              <p style={{ fontSize: "0.95rem", color: "var(--fg)", opacity: 0.8 }}> {content?.aboutCardDescription || "Reach out for a free initial consultation and strategic planning."} </p>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          section div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}

export default AboutSection;
