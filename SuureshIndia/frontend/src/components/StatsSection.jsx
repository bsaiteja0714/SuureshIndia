function StatsSection({ content }) {
  const stats = content?.stats || [];

  if (!stats.length) return null;

  return (
    <section style={{ padding: "7rem 0", borderTop: "1px solid var(--border)", background: "rgba(201,169,110,0.03)" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span style={{ fontSize: "0.75rem", letterSpacing: "0.15em", color: "var(--accent)", textTransform: "uppercase", fontWeight: 500 }}>By the Numbers</span>
          <h2 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
            fontWeight: 700, letterSpacing: "-0.03em", marginTop: "0.5rem", color: "var(--fg)"
          }}>Our Impact</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", background: "var(--border)" }}>
          {stats.map((s, i) => (
            <div key={i} style={{ padding: "2.5rem 2rem", background: "var(--bg)", textAlign: "center" }}>
              <div style={{
                fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
                fontWeight: 800, color: "var(--fg)", letterSpacing: "-0.04em", lineHeight: 1
              }}>{s.value}</div>
              <div style={{ color: "var(--fg)", fontWeight: 500, marginTop: "0.75rem", fontSize: "0.95rem" }}>{s.label}</div>
              <div style={{ color: "var(--muted)", fontSize: "0.8rem", marginTop: "0.25rem" }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          section div[style*="grid-template-columns: repeat(4, 1fr)"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 400px) {
          section div[style*="grid-template-columns: repeat(4, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

export default StatsSection;
