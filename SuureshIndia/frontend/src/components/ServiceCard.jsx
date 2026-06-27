function ServiceCard({ title, description }) {
  return (
    <div style={{
      padding: "2rem", background: "var(--card-bg)",
      border: "1px solid var(--border)", borderRadius: "var(--radius)",
      transition: "border-color 0.2s, background 0.2s"
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,169,110,0.3)"; e.currentTarget.style.background = "rgba(201,169,110,0.04)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--card-bg)"; }}
    >
      <h2 style={{
        fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700,
        color: "var(--fg)", marginBottom: "0.75rem", letterSpacing: "-0.02em"
      }}>{title}</h2>
      <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>{description}</p>
      <button style={{
        border: "1px solid var(--border)", background: "transparent",
        color: "var(--fg)", padding: "8px 20px", borderRadius: "100px",
        fontSize: "0.8rem", cursor: "pointer", transition: "all 0.2s"
      }}
        onMouseEnter={e => { e.target.style.background = "var(--fg)"; e.target.style.color = "var(--bg)"; }}
        onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "var(--fg)"; }}
      >
        Learn More →
      </button>
    </div>
  );
}

export default ServiceCard;
