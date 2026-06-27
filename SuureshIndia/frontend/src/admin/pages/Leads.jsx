import { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import { PageHeader, Button, EmptyState } from "../components/AdminUI";
import ConfirmDialog from "../components/ConfirmDialog";
import { contactAPI } from "../../services/api";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [expanded, setExpanded] = useState({});

  function load() {
    setLoading(true);

    contactAPI
      .getAll()
      .then(setLeads)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function markRead(id) {
    try {
      await contactAPI.markRead(id);

      setLeads((prev) =>
        prev.map((lead) => (lead._id === id ? { ...lead, read: true } : lead)),
      );
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete() {
    try {
      await contactAPI.delete(deleteId);
      setDeleteId(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <AdminLayout>
      <PageHeader
        title="Contact Leads"
        subtitle="Messages submitted through the website's contact form"
      />

      {error && (
        <p
          style={{
            color: "#e57373",
            marginBottom: "1rem",
          }}
        >
          {error}
        </p>
      )}

      {loading ? (
        <p style={{ color: "var(--muted)" }}>Loading...</p>
      ) : leads.length === 0 ? (
        <EmptyState message="No leads yet. Submissions from the Contact page will appear here." />
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {leads.map((lead) => {
            const isExpanded = expanded[lead._id];
            const message = lead.message || "";
            const previewLength = 180;

            return (
              <div
                key={lead._id}
                style={{
                  background: "var(--card-bg)",
                  border: `1px solid ${
                    lead.read ? "var(--border)" : "var(--accent)"
                  }`,
                  borderRadius: "var(--radius)",
                  padding: "1.5rem",
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "1rem",
                    marginBottom: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <strong
                      style={{
                        color: "var(--fg)",
                        fontSize: "1rem",
                      }}
                    >
                      {lead.name}
                    </strong>

                    {!lead.read && (
                      <span
                        style={{
                          marginLeft: "10px",
                          background: "var(--accent-dim)",
                          color: "var(--accent)",
                          padding: "3px 10px",
                          borderRadius: "999px",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                        }}
                      >
                        NEW
                      </span>
                    )}

                    <div
                      style={{
                        color: "var(--muted)",
                        marginTop: "6px",
                        fontSize: "0.85rem",
                      }}
                    >
                      {lead.email}

                      {lead.phone && ` • ${lead.phone}`}

                      {lead.service && ` • ${lead.service}`}
                    </div>
                  </div>

                  <span
                    style={{
                      color: "var(--muted)",
                      fontSize: "0.8rem",
                    }}
                  >
                    {new Date(lead.createdAt).toLocaleString()}
                  </span>
                </div>

                {/* Message */}
                <div
                  style={{
                    marginBottom: "1rem",
                  }}
                >
                  <p
                    style={{
                      color: "var(--fg)",
                      lineHeight: 1.7,
                      fontSize: "0.9rem",
                      marginBottom: "0.5rem",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    {isExpanded || message.length <= previewLength
                      ? message
                      : message.substring(0, previewLength) + "..."}
                  </p>

                  {message.length > previewLength && (
                    <button
                      onClick={() =>
                        setExpanded((prev) => ({
                          ...prev,
                          [lead._id]: !prev[lead._id],
                        }))
                      }
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--accent)",
                        cursor: "pointer",
                        fontWeight: 600,
                        padding: 0,
                        fontSize: "0.85rem",
                      }}
                    >
                      {isExpanded ? "Show Less ▲" : "Read More ▼"}
                    </button>
                  )}
                </div>

                {/* Actions */}
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  {!lead.read && (
                    <Button variant="ghost" onClick={() => markRead(lead._id)}>
                      Mark as Read
                    </Button>
                  )}

                  <Button
                    variant="danger"
                    onClick={() => setDeleteId(lead._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        message="Delete this lead permanently?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </AdminLayout>
  );
}
