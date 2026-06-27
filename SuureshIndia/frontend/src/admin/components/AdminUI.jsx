// Shared small UI building blocks used across admin pages
export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
      <div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 700, color: "var(--fg)" }}>{title}</h1>
        {subtitle && <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginTop: "0.25rem" }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Button({ children, variant = "primary", ...props }) {
  const styles = {
    primary: { background: "var(--accent)", color: "#0a0a0a", border: "none" },
    ghost: { background: "transparent", color: "var(--fg)", border: "1px solid var(--border)" },
    danger: { background: "transparent", color: "#e57373", border: "1px solid rgba(229,115,115,0.3)" },
  };
  return (
    <button {...props} style={{
      padding: "0.55rem 1.2rem", borderRadius: "100px", fontWeight: 600, fontSize: "0.85rem",
      cursor: "pointer", ...styles[variant], ...(props.style || {})
    }}>
      {children}
    </button>
  );
}

export function Input({ label, ...props }) {
  return (
    <div style={{ marginBottom: "1.1rem" }}>
      {label && <label style={{ display: "block", fontSize: "0.8rem", color: "var(--muted)", marginBottom: "0.35rem" }}>{label}</label>}
      <input {...props} style={{
        width: "100%", padding: "0.65rem 0.85rem", background: "var(--bg)",
        border: "1px solid var(--border)", borderRadius: "8px", color: "var(--fg)", fontSize: "0.88rem"
      }} />
    </div>
  );
}

export function Textarea({ label, ...props }) {
  return (
    <div style={{ marginBottom: "1.1rem" }}>
      {label && <label style={{ display: "block", fontSize: "0.8rem", color: "var(--muted)", marginBottom: "0.35rem" }}>{label}</label>}
      <textarea {...props} style={{
        width: "100%", padding: "0.65rem 0.85rem", background: "var(--bg)",
        border: "1px solid var(--border)", borderRadius: "8px", color: "var(--fg)",
        fontSize: "0.88rem", fontFamily: "inherit", resize: "vertical", minHeight: "100px"
      }} />
    </div>
  );
}

export function Select({ label, children, ...props }) {
  return (
    <div style={{ marginBottom: "1.1rem" }}>
      {label && <label style={{ display: "block", fontSize: "0.8rem", color: "var(--muted)", marginBottom: "0.35rem" }}>{label}</label>}
      <select {...props} style={{
        width: "100%", padding: "0.65rem 0.85rem", background: "var(--bg)",
        border: "1px solid var(--border)", borderRadius: "8px", color: "var(--fg)", fontSize: "0.88rem"
      }}>
        {children}
      </select>
    </div>
  );
}

export function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 150,
      display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem"
    }}>
      <div style={{
        background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius)",
        padding: "2rem", width: "100%", maxWidth: "520px", maxHeight: "90vh", overflowY: "auto"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--fg)" }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--muted)", fontSize: "1.2rem" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function StatusBadge({ active, onLabel = "Published", offLabel = "Draft" }) {
  return (
    <span style={{
      fontSize: "0.7rem", fontWeight: 600, padding: "2px 10px", borderRadius: "100px",
      background: active ? "rgba(120,200,140,0.15)" : "rgba(245,245,240,0.08)",
      color: active ? "#7ee08a" : "var(--muted)"
    }}>
      {active ? onLabel : offLabel}
    </span>
  );
}

export function EmptyState({ message }) {
  return (
    <div style={{ padding: "3rem", textAlign: "center", color: "var(--muted)", fontSize: "0.9rem" }}>
      {message}
    </div>
  );
}
