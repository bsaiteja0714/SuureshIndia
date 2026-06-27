import { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import { PageHeader, Button, EmptyState } from "../components/AdminUI";
import ConfirmDialog from "../components/ConfirmDialog";
import { feedbackAPI } from "../../services/api";
import { FaStar, FaCheck, FaTrash } from "react-icons/fa";

function StarDisplay({ rating }) {
  return (
    <span style={{ display: "inline-flex", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <FaStar key={s} size={12}
          style={{ color: s <= rating ? "#d4af37" : "var(--border)" }} />
      ))}
    </span>
  );
}

const tabStyle = (active) => ({
  padding: "0.45rem 1.1rem",
  borderRadius: "100px",
  fontSize: "0.8rem",
  fontWeight: active ? 600 : 400,
  border: "1px solid",
  borderColor: active ? "var(--accent)" : "var(--border)",
  background: active ? "var(--accent-dim)" : "transparent",
  color: active ? "var(--accent)" : "var(--muted)",
  cursor: "pointer",
  transition: "all 0.2s",
});

export default function FeedbackAdmin() {
  const [items, setItems]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [deleteId, setDeleteId]   = useState(null);
  const [filter, setFilter]       = useState("all"); // all | pending | approved

  function load() {
    setLoading(true);
    feedbackAPI.getAll()
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function handleApprove(id) {
    try {
      await feedbackAPI.approve(id);
      load();
    } catch (err) { setError(err.message); }
  }

  async function handleDelete() {
    try {
      await feedbackAPI.delete(deleteId);
      setDeleteId(null);
      load();
    } catch (err) { setError(err.message); }
  }

  const filtered = items.filter((item) => {
    if (filter === "pending")  return !item.approved;
    if (filter === "approved") return  item.approved;
    return true;
  });

  const pendingCount  = items.filter((i) => !i.approved).length;
  const approvedCount = items.filter((i) =>  i.approved).length;

  return (
    <AdminLayout>
      <PageHeader
        title="Feedback & Testimonials"
        subtitle="Approve or reject client reviews before they appear on the website"
      />

      {error && <p style={{ color: "#e57373", marginBottom: "1rem" }}>{error}</p>}

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {[
          { key: "all",      label: `All (${items.length})` },
          { key: "pending",  label: `Pending (${pendingCount})` },
          { key: "approved", label: `Approved (${approvedCount})` },
        ].map(({ key, label }) => (
          <button key={key} style={tabStyle(filter === key)} onClick={() => setFilter(key)}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: "var(--muted)" }}>Loading...</p>
      ) : filtered.length === 0 ? (
        <EmptyState message={filter === "pending" ? "No pending reviews." : "No feedback found."} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filtered.map((item) => (
            <div key={item._id} style={{
              background: "var(--card-bg)", border: "1px solid var(--border)",
              borderRadius: "var(--radius)", padding: "1.5rem",
              borderLeft: item.approved ? "3px solid #22c55e" : "3px solid #d4af37",
            }}>
              {/* Header row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <strong style={{ color: "var(--fg)" }}>{item.name}</strong>
                    <StarDisplay rating={item.rating} />
                    <span style={{
                      fontSize: "0.68rem", fontWeight: 600, padding: "2px 8px",
                      borderRadius: "100px",
                      background: item.approved ? "rgba(34,197,94,0.15)" : "var(--accent-dim)",
                      color: item.approved ? "#22c55e" : "var(--accent)",
                    }}>
                      {item.approved ? "APPROVED" : "PENDING"}
                    </span>
                  </div>
                  {item.email && (
                    <div style={{ color: "var(--muted)", fontSize: "0.78rem", marginTop: "2px" }}>{item.email}</div>
                  )}
                  <div style={{ color: "var(--muted)", fontSize: "0.75rem", marginTop: "2px" }}>
                    {new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                </div>
              </div>

              {/* Message */}
              <p style={{ color: "var(--fg)", fontSize: "0.9rem", lineHeight: 1.6, fontStyle: "italic", marginBottom: "1rem" }}>
                "{item.message}"
              </p>

              {/* Actions */}
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {!item.approved && (
                  <button onClick={() => handleApprove(item._id)} style={{
                    display: "inline-flex", alignItems: "center", gap: "0.4rem",
                    background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.4)",
                    color: "#22c55e", borderRadius: "8px", padding: "0.5rem 1rem",
                    fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
                  }}>
                    <FaCheck size={11} /> Approve
                  </button>
                )}
                <button onClick={() => setDeleteId(item._id)} style={{
                  display: "inline-flex", alignItems: "center", gap: "0.4rem",
                  background: "rgba(229,115,115,0.1)", border: "1px solid rgba(229,115,115,0.3)",
                  color: "#e57373", borderRadius: "8px", padding: "0.5rem 1rem",
                  fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
                }}>
                  <FaTrash size={11} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        message="Delete this feedback? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </AdminLayout>
  );
}
