export default function ConfirmDialog({ open, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200,
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "var(--card-bg)", border: "1px solid var(--border)",
        borderRadius: "var(--radius)", padding: "1.75rem", maxWidth: "360px", width: "90%"
      }}>
        <p style={{ color: "var(--fg)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>{message}</p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={{
            padding: "0.5rem 1.2rem", borderRadius: "100px", border: "1px solid var(--border)",
            background: "transparent", color: "var(--fg)", fontSize: "0.85rem"
          }}>Cancel</button>
          <button onClick={onConfirm} style={{
            padding: "0.5rem 1.2rem", borderRadius: "100px", border: "none",
            background: "#e57373", color: "#0a0a0a", fontWeight: 600, fontSize: "0.85rem"
          }}>Delete</button>
        </div>
      </div>
    </div>
  );
}
