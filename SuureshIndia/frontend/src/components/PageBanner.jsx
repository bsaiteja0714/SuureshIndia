function PageBanner({ title, subtitle }) {
  return (
    <section style={{
      paddingTop: "140px", paddingBottom: "5rem",
      borderBottom: "1px solid var(--border)", position: "relative", overflow: "hidden"
    }}>
      <div style={{
        position: "absolute", inset: 0, opacity: 0.1, pointerEvents: "none"
      }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{
            position: "absolute", height: "1px",
            background: "linear-gradient(90deg, transparent, var(--border), transparent)",
            top: `${12.5 * (i + 1)}%`, left: 0, right: 0
          }} />
        ))}
      </div>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem" }}>
          <span style={{ width: "32px", height: "1px", background: "var(--accent)", display: "inline-block" }} />
          <span style={{ fontSize: "0.75rem", letterSpacing: "0.15em", color: "var(--accent)", textTransform: "uppercase", fontWeight: 500 }}>P.Suuresh & Associates</span>
        </div>
        <h1 style={{
          fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 6vw, 5rem)",
          fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.95,
          color: "var(--fg)"
        }}>{title}</h1>
        {subtitle && <p style={{ color: "var(--muted)", fontSize: "1.1rem", marginTop: "1.5rem", maxWidth: "500px", lineHeight: 1.7 }}>{subtitle}</p>}
      </div>
    </section>
  );
}

export default PageBanner;
