import { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import { servicesAPI } from "../../services/api";
import { services as fallbackServices } from "../../data/services";

const emptyForm = {
  title: "",
  description: "",
  iconEmoji: "📋",
  fullDescription: "",
  benefits: "",
  processFlow: "",
  faqs: "",
};

function tag(label, color = "var(--accent)") {
  return (
    <span
      style={{
        background: "var(--accent-dim)",
        color,
        fontSize: "0.68rem",
        fontWeight: 600,
        padding: "2px 8px",
        borderRadius: "100px",
        border: "1px solid rgba(212,175,55,0.25)",
      }}
    >
      {label}
    </span>
  );
}

export default function ServicesAdmin() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    setLoading(true);
    try {
      const data = await servicesAPI.getAll();
      setServices(data && data.length > 0 ? data : fallbackServices);
    } catch {
      setServices(fallbackServices);
    } finally {
      setLoading(false);
    }
  }

  function openNew() {
    setEditId(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function openEdit(service) {
    setEditId(service._id || service.id);
    const bList = Array.isArray(service.benefits) ? service.benefits.join("\n") : service.benefits || "";
    const pList = Array.isArray(service.process)
      ? service.process.map((p) => `${p.step}. ${p.title}: ${p.desc}`).join("\n")
      : Array.isArray(service.processFlow)
      ? service.processFlow.map((p) => (typeof p === "object" ? `${p.step}. ${p.title}: ${p.description || p.desc || ""}` : p)).join("\n")
      : "";
    const fList = Array.isArray(service.faq)
      ? service.faq.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n")
      : Array.isArray(service.faqs)
      ? service.faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")
      : "";
    setForm({
      title: service.title || "",
      description: service.description || "",
      iconEmoji: service.iconEmoji || service.icon || "📋",
      fullDescription: service.fullDescription || service.detailedContent || "",
      benefits: bList,
      processFlow: pList,
      faqs: fList,
    });
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.title.trim()) { setError("Service title is required."); return; }
    if (!form.description.trim()) { setError("Short description is required."); return; }

    setSaving(true);
    setError("");
    setSuccess("");

    const benefitsArr = form.benefits.split("\n").map((b) => b.trim()).filter(Boolean);
    const processArr = form.processFlow
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line, idx) => {
        const match = line.match(/^(\d+)\.\s*(.+?):\s*(.*)$/);
        if (match) return { step: Number(match[1]), title: match[2].trim(), description: match[3].trim() };
        return { step: idx + 1, title: line, description: "" };
      });

    const faqsArr = form.faqs
      .split("\n\n")
      .map((block) => block.trim())
      .filter(Boolean)
      .map((block) => {
        const lines = block.split("\n");
        const q = (lines[0] || "").replace(/^Q:\s*/i, "").trim();
        const a = (lines[1] || "").replace(/^A:\s*/i, "").trim();
        return { question: q, answer: a };
      })
      .filter((f) => f.question && f.answer);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      iconEmoji: form.iconEmoji.trim() || "📋",
      fullDescription: form.fullDescription.trim(),
      benefits: benefitsArr,
      processFlow: processArr,
      faqs: faqsArr,
    };

    try {
      if (editId) {
        await servicesAPI.update(editId, payload);
        setSuccess("Service updated successfully.");
      } else {
        await servicesAPI.create(payload);
        setSuccess("Service created successfully.");
      }
      setShowForm(false);
      loadServices();
    } catch (err) {
      setError(err.message || "Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this service? This cannot be undone.")) return;
    try {
      await servicesAPI.delete(id);
      loadServices();
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  }

  const inputStyle = {
    width: "100%",
    background: "var(--bg)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    padding: "0.6rem 0.9rem",
    color: "var(--fg)",
    fontSize: "0.875rem",
    fontFamily: "var(--font-body)",
    outline: "none",
    resize: "vertical",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "var(--muted)",
    marginBottom: "0.35rem",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  };

  return (
    <AdminLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", color: "var(--fg)", marginBottom: "4px" }}>
            Services Management
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
            Add, edit, or remove the services shown on the public website.
          </p>
        </div>
        <button
          onClick={openNew}
          style={{
            background: "var(--accent)", color: "#0a0a0a", border: "none",
            borderRadius: "100px", padding: "0.65rem 1.5rem",
            fontSize: "0.875rem", fontWeight: 700, cursor: "pointer",
          }}
        >
          + Add Service
        </button>
      </div>

      {/* Service List */}
      {loading ? (
        <p style={{ color: "var(--muted)" }}>Loading services...</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {services.map((svc) => (
            <div
              key={svc._id || svc.id}
              style={{
                background: "var(--card-bg)", border: "1px solid var(--border)",
                borderRadius: "var(--radius)", padding: "1.5rem 2rem",
                display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1.5rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: "1.8rem", flexShrink: 0 }}>
                  {svc.iconEmoji || svc.icon || "📋"}
                </span>
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", color: "var(--fg)", marginBottom: "4px" }}>
                    {svc.title}
                  </h3>
                  <p style={{ color: "var(--muted)", fontSize: "0.82rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {svc.description}
                  </p>
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                    {tag(`${(svc.benefits || []).length} Benefits`)}
                    {tag(`${(svc.processFlow || svc.process || []).length} Steps`, "var(--muted)")}
                    {tag(`${(svc.faqs || svc.faq || []).length} FAQs`, "var(--muted)")}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                <button
                  onClick={() => openEdit(svc)}
                  style={{
                    background: "var(--accent-dim)", color: "var(--accent)",
                    border: "1px solid rgba(212,175,55,0.3)", borderRadius: "8px",
                    padding: "0.45rem 1rem", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
                  }}
                >
                  Edit
                </button>
                {(svc._id) && (
                  <button
                    onClick={() => handleDelete(svc._id)}
                    style={{
                      background: "rgba(229,115,115,0.1)", color: "#e57373",
                      border: "1px solid rgba(229,115,115,0.25)", borderRadius: "8px",
                      padding: "0.45rem 1rem", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
            zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center",
            padding: "2rem", overflowY: "auto",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}
        >
          <div
            style={{
              background: "var(--card-bg)", border: "1px solid var(--border)",
              borderRadius: "16px", padding: "2.5rem", width: "100%", maxWidth: "720px",
              maxHeight: "90vh", overflowY: "auto",
            }}
          >
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "var(--fg)", marginBottom: "1.75rem" }}>
              {editId ? "Edit Service" : "Add New Service"}
            </h2>

            {error && (
              <div style={{ background: "rgba(229,115,115,0.1)", border: "1px solid rgba(229,115,115,0.2)", borderRadius: "8px", padding: "0.75rem 1rem", color: "#e57373", fontSize: "0.82rem", marginBottom: "1.25rem" }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "8px", padding: "0.75rem 1rem", color: "#22c55e", fontSize: "0.82rem", marginBottom: "1.25rem" }}>
                {success}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
              <div>
                <label style={labelStyle}>Service Title *</label>
                <input style={{ ...inputStyle }} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. GST Compliance" />
              </div>
              <div>
                <label style={labelStyle}>Icon Emoji</label>
                <input style={{ ...inputStyle }} value={form.iconEmoji} onChange={(e) => setForm({ ...form, iconEmoji: e.target.value })} placeholder="e.g. 🧾" maxLength={4} />
              </div>
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <label style={labelStyle}>Short Description * (shown on service card)</label>
              <textarea rows={2} style={{ ...inputStyle }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="A concise 1-2 line summary of this service..." />
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <label style={labelStyle}>Full Description (shown in "Learn More" section)</label>
              <textarea rows={5} style={{ ...inputStyle }} value={form.fullDescription} onChange={(e) => setForm({ ...form, fullDescription: e.target.value })} placeholder="Detailed service description..." />
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <label style={labelStyle}>Key Benefits (one per line)</label>
              <textarea rows={5} style={{ ...inputStyle }} value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })} placeholder={"Maximum deduction optimization\nAll ITR forms covered\nDigital filing with instant acknowledgment"} />
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <label style={labelStyle}>Process Steps (format: "1. Step Title: Step description" — one per line)</label>
              <textarea rows={5} style={{ ...inputStyle }} value={form.processFlow} onChange={(e) => setForm({ ...form, processFlow: e.target.value })} placeholder={"1. Document Collection: Share your Form 16 and statements.\n2. Review: Our CAs compute your tax liability.\n3. Filing: We file on the portal and send acknowledgment."} />
            </div>

            <div style={{ marginBottom: "1.75rem" }}>
              <label style={labelStyle}>FAQs (format: "Q: question\nA: answer" — separate each FAQ with a blank line)</label>
              <textarea rows={7} style={{ ...inputStyle }} value={form.faqs} onChange={(e) => setForm({ ...form, faqs: e.target.value })} placeholder={"Q: What documents do I need?\nA: Form 16, bank statements, investment proofs.\n\nQ: What is the deadline?\nA: July 31 for individuals."} />
            </div>

            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  background: "transparent", border: "1px solid var(--border)",
                  borderRadius: "8px", padding: "0.6rem 1.5rem",
                  color: "var(--muted)", fontSize: "0.875rem", cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  background: "var(--accent)", color: "#0a0a0a",
                  border: "none", borderRadius: "8px",
                  padding: "0.6rem 1.75rem", fontSize: "0.875rem",
                  fontWeight: 700, cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? "Saving..." : editId ? "Save Changes" : "Create Service"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
