import { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import { socialLinksAPI } from "../../services/api";
import { defaultSocialLinks } from "../../data/socialLinks";
import {
  FaFacebookF, FaLinkedinIn, FaTwitter,
  FaInstagram, FaYoutube, FaWhatsapp, FaEnvelope,
} from "react-icons/fa";

const FIELDS = [
  { key: "linkedin", label: "LinkedIn URL", icon: FaLinkedinIn, placeholder: "https://linkedin.com/company/..." },
  { key: "facebook", label: "Facebook URL", icon: FaFacebookF, placeholder: "https://facebook.com/..." },
  { key: "instagram", label: "Instagram URL", icon: FaInstagram, placeholder: "https://instagram.com/..." },
  { key: "twitter", label: "X / Twitter URL", icon: FaTwitter, placeholder: "https://twitter.com/..." },
  { key: "youtube", label: "YouTube Channel URL", icon: FaYoutube, placeholder: "https://youtube.com/@..." },
  { key: "whatsapp", label: "WhatsApp Number", icon: FaWhatsapp, placeholder: "+919876543210" },
  { key: "whatsappMessage", label: "WhatsApp Pre-filled Message", icon: null, placeholder: "Hello, I'd like to enquire about your services." },
  { key: "generalEmail", label: "General Contact Email", icon: FaEnvelope, placeholder: "info@suureshindia.com" },
];

export default function SocialLinksAdmin() {
  const [form, setForm] = useState(defaultSocialLinks);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    socialLinksAPI.get()
      .then((data) => {
        if (data && Object.keys(data).length > 0) setForm({ ...defaultSocialLinks, ...data });
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      await socialLinksAPI.update(form);
      setMessage({ type: "success", text: "Social media links saved successfully." });
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Save failed." });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <AdminLayout><p style={{ color: "var(--muted)" }}>Loading...</p></AdminLayout>;

  return (
    <AdminLayout>
      <div style={{ maxWidth: 720 }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", color: "var(--fg)", marginBottom: "4px" }}>
            Social Media Links
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
            Update all social media platform URLs that appear in the website footer and other sections.
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

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {FIELDS.map(({ key, label, icon: Icon, placeholder }) => (
            <div
              key={key}
              style={{
                background: "var(--card-bg)", border: "1px solid var(--border)",
                borderRadius: "12px", padding: "1.25rem 1.5rem",
                display: "grid", gridTemplateColumns: "36px 1fr", gap: "1rem", alignItems: "center",
              }}
            >
              {Icon ? (
                <div style={{
                  width: 36, height: 36, borderRadius: "10px",
                  background: "var(--accent-dim)", border: "1px solid rgba(212,175,55,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--accent)", fontSize: "0.9rem",
                }}>
                  <Icon />
                </div>
              ) : <div />}
              <div>
                <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 600, color: "var(--muted)", marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {label}
                </label>
                <input
                  style={{
                    width: "100%", background: "var(--bg)", border: "1px solid var(--border)",
                    borderRadius: "8px", padding: "0.6rem 0.9rem", color: "var(--fg)",
                    fontSize: "0.875rem", fontFamily: "var(--font-body)", outline: "none",
                  }}
                  value={form[key] || ""}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                />
                {form[key] && key !== "whatsappMessage" && key !== "generalEmail" && key !== "whatsapp" && (
                  <a
                    href={form[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: "0.72rem", color: "var(--accent)", marginTop: "0.3rem", display: "inline-block" }}
                  >
                    Preview link ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
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
            {saving ? "Saving..." : "Save Social Media Links"}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
