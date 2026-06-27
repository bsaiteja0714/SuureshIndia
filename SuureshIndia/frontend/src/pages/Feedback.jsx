import { useState } from "react";
import { FaStar, FaCheckCircle } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageBanner from "../components/PageBanner";
import { feedbackAPI } from "../services/api";
import { Link } from "react-router-dom";

function StarRating({ value, onChange, readOnly = false }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div style={{ display: "flex", gap: "0.4rem" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readOnly && onChange && onChange(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          style={{
            background: "none",
            border: "none",
            cursor: readOnly ? "default" : "pointer",
            fontSize: "1.75rem",
            color: star <= (hovered || value) ? "#d4af37" : "var(--border)",
            transition: "color 0.15s, transform 0.15s",
            transform: !readOnly && star <= hovered ? "scale(1.2)" : "scale(1)",
            padding: 0,
          }}
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
        >
          <FaStar />
        </button>
      ))}
    </div>
  );
}

const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

export default function Feedback() {
  const [form, setForm] = useState({ name: "", email: "", rating: 0, message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errMsg, setErrMsg]   = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.rating === 0) { setErrMsg("Please select a star rating."); return; }
    if (!form.name.trim())  { setErrMsg("Please enter your name."); return; }
    if (!form.message.trim()) { setErrMsg("Please write a brief message."); return; }

    setStatus("sending"); setErrMsg("");
    try {
      await feedbackAPI.submit({
        name:    form.name.trim(),
        email:   form.email.trim(),
        rating:  form.rating,
        message: form.message.trim(),
      });
      setStatus("success");
    } catch (err) {
      setErrMsg(err.message || "Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <>
        <Navbar />
        <PageBanner title="Feedback" subtitle="We value your opinion." />
        <section style={{ padding: "6rem 0", textAlign: "center" }}>
          <div className="container" style={{ maxWidth: 520 }}>
            <FaCheckCircle size={56} style={{ color: "#22c55e", marginBottom: "1.5rem" }} />
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", color: "var(--fg)", marginBottom: "1rem" }}>
              Thank you for your feedback!
            </h2>
            <p style={{ color: "var(--muted)", lineHeight: 1.7, marginBottom: "2rem" }}>
              Your review has been submitted and will appear on our website once approved by our team. We appreciate you taking the time to share your experience.
            </p>
            <Link to="/" style={{
              background: "var(--accent)", color: "#0a0a0a",
              padding: "0.75rem 2rem", borderRadius: "100px",
              fontWeight: 700, fontSize: "0.9rem", display: "inline-block",
            }}>
              Back to Home
            </Link>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <PageBanner
        title="Share Your Feedback"
        subtitle="Help us improve by sharing your experience with P. Suuresh & Associates."
      />

      <section style={{ padding: "5rem 0" }}>
        <div className="container" style={{ maxWidth: 680 }}>

          {/* Info card */}
          <div style={{
            background: "var(--accent-dim)", border: "1px solid rgba(212,175,55,0.25)",
            borderRadius: "var(--radius)", padding: "1.25rem 1.5rem",
            marginBottom: "2.5rem", display: "flex", gap: "0.75rem", alignItems: "flex-start",
          }}>
            <FaStar size={20} style={{ color: "var(--accent)", flexShrink: 0, marginTop: 2 }} />
            <p style={{ color: "var(--fg)", fontSize: "0.9rem", lineHeight: 1.6 }}>
              Your feedback will be reviewed and approved by our team before appearing on the website.
            </p>
          </div>

          <form onSubmit={handleSubmit}
            style={{
              background: "var(--card-bg)", border: "1px solid var(--border)",
              borderRadius: "var(--radius)", padding: "2.5rem",
            }}
          >
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--fg)", marginBottom: "2rem" }}>
              Your Review
            </h2>

            {/* Star rating */}
            <div style={{ marginBottom: "1.75rem" }}>
              <label style={labelStyle}>Overall Rating <span style={{ color: "var(--accent)" }}>*</span></label>
              <StarRating value={form.rating} onChange={(r) => setForm((f) => ({ ...f, rating: r }))} />
              {form.rating > 0 && (
                <div style={{ color: "var(--accent)", fontSize: "0.85rem", marginTop: "0.4rem", fontWeight: 500 }}>
                  {labels[form.rating]}
                </div>
              )}
            </div>

            {/* Name */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={labelStyle} htmlFor="fb-name">Your Name <span style={{ color: "var(--accent)" }}>*</span></label>
              <input id="fb-name" type="text" style={inputStyle} required
                value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Full name" />
            </div>

            {/* Email (optional) */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={labelStyle} htmlFor="fb-email">Email <span style={{ color: "var(--muted)", fontWeight: 400 }}>(optional)</span></label>
              <input id="fb-email" type="email" style={inputStyle}
                value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="your@email.com" />
            </div>

            {/* Message */}
            <div style={{ marginBottom: "1.75rem" }}>
              <label style={labelStyle} htmlFor="fb-message">Your Experience <span style={{ color: "var(--accent)" }}>*</span></label>
              <textarea id="fb-message" rows={5} style={inputStyle} required
                value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                placeholder="Share your experience working with P. Suuresh & Associates..." />
            </div>

            {errMsg && (
              <p style={{ color: "#e57373", fontSize: "0.85rem", marginBottom: "1rem" }}>{errMsg}</p>
            )}

            <button type="submit" disabled={status === "sending"} style={{
              background: "var(--accent)", color: "#0a0a0a", border: "none",
              borderRadius: "100px", padding: "0.875rem 2.5rem",
              fontWeight: 700, fontSize: "0.9rem", fontFamily: "var(--font-body)",
              cursor: status === "sending" ? "not-allowed" : "pointer",
              opacity: status === "sending" ? 0.65 : 1, width: "100%",
              transition: "opacity 0.2s",
            }}>
              {status === "sending" ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
}

const labelStyle = {
  display: "block", fontSize: "0.78rem", fontWeight: 600,
  textTransform: "uppercase", letterSpacing: "0.07em",
  color: "var(--muted)", marginBottom: "0.5rem",
};

const inputStyle = {
  width: "100%", background: "var(--bg)", border: "1px solid var(--border)",
  borderRadius: "8px", color: "var(--fg)", fontFamily: "var(--font-body)",
  fontSize: "0.9rem", padding: "0.75rem 1rem", outline: "none",
};
