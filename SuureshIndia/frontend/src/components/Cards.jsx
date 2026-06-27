// ArticleCard
export function ArticleCard({ title, category }) {
  return (
    <div style={{
      padding: "1.75rem 2rem", background: "var(--card-bg)",
      border: "1px solid var(--border)", borderRadius: "var(--radius)",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      transition: "border-color 0.2s", gap: "1rem"
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(201,169,110,0.3)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
    >
      <div>
        <span style={{ fontSize: "0.7rem", letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase", fontWeight: 500 }}>{category}</span>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 700, color: "var(--fg)", marginTop: "4px", lineHeight: 1.3 }}>{title}</h2>
      </div>
      <span style={{ color: "var(--muted)", fontSize: "1.2rem", flexShrink: 0 }}>→</span>
    </div>
  );
}

// UpdateCard
export function UpdateCard({ title, date }) {
  return (
    <div style={{
      padding: "1.5rem 2rem", background: "var(--card-bg)",
      border: "1px solid var(--border)", borderRadius: "var(--radius)",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      transition: "border-color 0.2s", gap: "1rem"
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(201,169,110,0.3)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
    >
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, color: "var(--fg)", lineHeight: 1.3 }}>{title}</h2>
      <span style={{ color: "var(--accent)", fontSize: "0.8rem", fontWeight: 500, whiteSpace: "nowrap", flexShrink: 0 }}>{date}</span>
    </div>
  );
}

// CalendarRow
export function CalendarRow({ compliance, dueDate }) {
  return (
    <tr style={{ borderBottom: "1px solid var(--border)" }}>
      <td style={{ padding: "1rem 1.5rem", color: "var(--fg)", fontSize: "0.9rem" }}>{compliance}</td>
      <td style={{ padding: "1rem 1.5rem", color: "var(--accent)", fontSize: "0.85rem", fontWeight: 500 }}>{dueDate}</td>
    </tr>
  );
}

// Loading
export function Loading() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "4rem 2rem", color: "var(--muted)" }}>
      <div style={{ width: "20px", height: "20px", border: "2px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <span style={{ fontSize: "0.9rem" }}>Loading...</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// Error
export function ErrorMessage() {
  return (
    <div style={{ padding: "2rem", background: "rgba(201,169,110,0.06)", border: "1px solid rgba(201,169,110,0.2)", borderRadius: "var(--radius)", color: "var(--muted)", fontSize: "0.9rem" }}>
      ⚠ Something went wrong. Please try again.
    </div>
  );
}

export default ArticleCard;
