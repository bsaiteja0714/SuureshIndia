import { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import { orgSettingsAPI } from "../../services/api";
import { defaultOrgSettings } from "../../data/orgSettings";

const inputStyle = {
  width: "100%",
  background: "var(--bg)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  padding: "0.65rem 0.9rem",
  color: "var(--fg)",
  fontSize: "0.875rem",
  fontFamily: "var(--font-body)",
  outline: "none",
};

const labelStyle = {
  display: "block",
  fontSize: "0.72rem",
  fontWeight: 600,
  color: "var(--muted)",
  marginBottom: "0.35rem",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const sectionTitle = (text) => (
  <h3 style={{
    fontFamily: "var(--font-display)", fontSize: "1rem", color: "var(--fg)",
    marginBottom: "1.25rem", marginTop: "2.25rem",
    paddingBottom: "0.5rem", borderBottom: "1px solid var(--border)",
  }}>
    {text}
  </h3>
);

export default function OrgSettings() {
  const [form, setForm] = useState(defaultOrgSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    orgSettingsAPI.get()
      .then((data) => {
        if (data && data.companyName) setForm({ ...defaultOrgSettings, ...data });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const setOfficeField = (idx, key, val) => {
    const offices = [...(form.offices || [])];
    offices[idx] = { ...offices[idx], [key]: val };
    set("offices", offices);
  };

  const addOffice = () => {
    set("offices", [...(form.offices || []), { heading: "", address: "", phone: "", email: "", hours: "", mapUrl: "" }]);
  };

  const removeOffice = (idx) => {
    const offices = [...(form.offices || [])];
    offices.splice(idx, 1);
    set("offices", offices);
  };

  const setContactField = (arr, key, idx, field, val) => {
    const list = [...(form[arr] || [])];
    list[idx] = { ...list[idx], [field]: val };
    set(arr, list);
  };

  const addContact = (arr, template) => {
    set(arr, [...(form[arr] || []), template]);
  };

  const removeContact = (arr, idx) => {
    const list = [...(form[arr] || [])];
    list.splice(idx, 1);
    set(arr, list);
  };

  async function handleSave() {
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      await orgSettingsAPI.update(form);
      setMessage({ type: "success", text: "Organization settings saved successfully." });
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Save failed." });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <AdminLayout><p style={{ color: "var(--muted)" }}>Loading settings...</p></AdminLayout>;

  return (
    <AdminLayout>
      <div style={{ maxWidth: 860 }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", color: "var(--fg)", marginBottom: "4px" }}>
            Organization Settings
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
            Manage company information, contact details, offices, and working hours displayed on the website.
          </p>
        </div>

        {message.text && (
          <div style={{
            background: message.type === "success" ? "rgba(34,197,94,0.1)" : "rgba(229,115,115,0.1)",
            border: `1px solid ${message.type === "success" ? "rgba(34,197,94,0.2)" : "rgba(229,115,115,0.2)"}`,
            borderRadius: "8px", padding: "0.75rem 1rem",
            color: message.type === "success" ? "#22c55e" : "#e57373",
            fontSize: "0.82rem", marginBottom: "1.5rem",
          }}>
            {message.text}
          </div>
        )}

        {sectionTitle("Basic Information")}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
          <div>
            <label style={labelStyle}>Company Name</label>
            <input style={inputStyle} value={form.companyName || ""} onChange={(e) => set("companyName", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Established Year</label>
            <input style={inputStyle} value={form.established || ""} onChange={(e) => set("established", e.target.value)} placeholder="e.g. 1996" />
          </div>
        </div>
        <div style={{ marginBottom: "1.25rem" }}>
          <label style={labelStyle}>Tagline</label>
          <input style={inputStyle} value={form.tagline || ""} onChange={(e) => set("tagline", e.target.value)} placeholder="e.g. Chartered Accountants | Tax Consultants | Business Advisors" />
        </div>
        <div style={{ marginBottom: "1.25rem" }}>
          <label style={labelStyle}>Company Description (shown in footer)</label>
          <textarea rows={3} style={{ ...inputStyle, resize: "vertical" }} value={form.description || ""} onChange={(e) => set("description", e.target.value)} />
        </div>
        <div style={{ marginBottom: "1.25rem" }}>
          <label style={labelStyle}>Working Hours</label>
          <input style={inputStyle} value={form.workingHours || ""} onChange={(e) => set("workingHours", e.target.value)} placeholder="e.g. Mon – Sat: 9:30 AM – 7:00 PM" />
        </div>
        <div style={{ marginBottom: "1.25rem" }}>
          <label style={labelStyle}>Registration Details (ICAI Reg No., GSTIN, etc.)</label>
          <textarea rows={2} style={{ ...inputStyle, resize: "vertical" }} value={form.registrationDetails || ""} onChange={(e) => set("registrationDetails", e.target.value)} />
        </div>

        {sectionTitle("Email Addresses")}
        {(form.emails || []).map((em, idx) => (
          <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto", gap: "0.75rem", marginBottom: "0.75rem", alignItems: "end" }}>
            <div>
              <label style={labelStyle}>Label</label>
              <input style={inputStyle} value={em.label || ""} onChange={(e) => setContactField("emails", "emails", idx, "label", e.target.value)} placeholder="e.g. General" />
            </div>
            <div>
              <label style={labelStyle}>Email Address</label>
              <input type="email" style={inputStyle} value={em.address || ""} onChange={(e) => setContactField("emails", "emails", idx, "address", e.target.value)} placeholder="name@suureshindia.com" />
            </div>
            <button onClick={() => removeContact("emails", idx)} style={{ background: "rgba(229,115,115,0.1)", color: "#e57373", border: "1px solid rgba(229,115,115,0.2)", borderRadius: "8px", padding: "0.6rem 0.75rem", cursor: "pointer", fontSize: "0.8rem" }}>✕</button>
          </div>
        ))}
        <button onClick={() => addContact("emails", { label: "", address: "" })} style={{ background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: "8px", padding: "0.5rem 1rem", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", marginBottom: "0.5rem" }}>
          + Add Email
        </button>

        {sectionTitle("Phone Numbers")}
        {(form.phones || []).map((ph, idx) => (
          <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto", gap: "0.75rem", marginBottom: "0.75rem", alignItems: "end" }}>
            <div>
              <label style={labelStyle}>Label</label>
              <input style={inputStyle} value={ph.label || ""} onChange={(e) => setContactField("phones", "phones", idx, "label", e.target.value)} placeholder="e.g. Main Office" />
            </div>
            <div>
              <label style={labelStyle}>Phone Number</label>
              <input style={inputStyle} value={ph.number || ""} onChange={(e) => setContactField("phones", "phones", idx, "number", e.target.value)} placeholder="+91 40 1234 5678" />
            </div>
            <button onClick={() => removeContact("phones", idx)} style={{ background: "rgba(229,115,115,0.1)", color: "#e57373", border: "1px solid rgba(229,115,115,0.2)", borderRadius: "8px", padding: "0.6rem 0.75rem", cursor: "pointer", fontSize: "0.8rem" }}>✕</button>
          </div>
        ))}
        <button onClick={() => addContact("phones", { label: "", number: "" })} style={{ background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: "8px", padding: "0.5rem 1rem", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", marginBottom: "0.5rem" }}>
          + Add Phone
        </button>

        {sectionTitle("Google Maps (Primary Office)")}
        <div style={{ marginBottom: "1.25rem" }}>
          <label style={labelStyle}>Google Maps Embed URL (for Contact page iframe)</label>
          <input style={inputStyle} value={form.googleMapsEmbedUrl || ""} onChange={(e) => set("googleMapsEmbedUrl", e.target.value)} placeholder="https://www.google.com/maps/embed?pb=..." />
        </div>

        {sectionTitle("Global Offices")}
        {(form.offices || []).map((off, idx) => (
          <div key={idx} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.5rem", marginBottom: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <span style={{ fontWeight: 600, color: "var(--fg)", fontSize: "0.875rem" }}>Office {idx + 1}: {off.heading || "(unnamed)"}</span>
              <button onClick={() => removeOffice(idx)} style={{ background: "rgba(229,115,115,0.1)", color: "#e57373", border: "1px solid rgba(229,115,115,0.2)", borderRadius: "6px", padding: "0.3rem 0.65rem", cursor: "pointer", fontSize: "0.75rem" }}>Remove</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              {[["heading", "Office Name"], ["phone", "Phone"], ["email", "Email"], ["hours", "Working Hours"]].map(([field, lbl]) => (
                <div key={field}>
                  <label style={labelStyle}>{lbl}</label>
                  <input style={inputStyle} value={off[field] || ""} onChange={(e) => setOfficeField(idx, field, e.target.value)} />
                </div>
              ))}
            </div>
            <div style={{ marginTop: "0.75rem" }}>
              <label style={labelStyle}>Full Address</label>
              <textarea rows={2} style={{ ...inputStyle, resize: "vertical" }} value={off.address || ""} onChange={(e) => setOfficeField(idx, "address", e.target.value)} />
            </div>
            <div style={{ marginTop: "0.75rem" }}>
              <label style={labelStyle}>Google Maps URL</label>
              <input style={inputStyle} value={off.mapUrl || ""} onChange={(e) => setOfficeField(idx, "mapUrl", e.target.value)} placeholder="https://www.google.com/maps/search/?..." />
            </div>
          </div>
        ))}
        <button onClick={addOffice} style={{ background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: "8px", padding: "0.5rem 1rem", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", marginBottom: "2rem" }}>
          + Add Office
        </button>

        <div style={{ paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              background: "var(--accent)", color: "#0a0a0a", border: "none",
              borderRadius: "100px", padding: "0.75rem 2.5rem",
              fontSize: "0.95rem", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? "Saving..." : "Save Organization Settings"}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
