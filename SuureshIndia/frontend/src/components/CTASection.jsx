import { Link } from "react-router-dom";

function CTASection() {
  return (
    <section style={{ padding: "7rem 0", borderTop: "1px solid var(--border)" }}>
      <div className="container">
        <div style={{
          background: "var(--card-bg)", border: "1px solid var(--border)",
          borderRadius: "24px", padding: "5rem 4rem", textAlign: "center",
          position: "relative", overflow: "hidden"
        }}>
          {/* Glow */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: "500px", height: "300px", borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(201,169,110,0.07) 0%, transparent 70%)",
            pointerEvents: "none"
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <span style={{ fontSize: "0.75rem", letterSpacing: "0.15em", color: "var(--accent)", textTransform: "uppercase", fontWeight: 500 }}>
              Get Started
            </span>
            <h2 style={{
              fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 4rem)",
              fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1,
              color: "var(--fg)", margin: "1rem 0 1.5rem"
            }}>
              Need Professional<br />Tax Assistance?
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "1.1rem", maxWidth: "500px", margin: "0 auto 2.5rem", lineHeight: 1.7 }}>
              Contact our experts for GST, Tax Filing, Audit, and Advisory services. Your first consultation is free.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/contact" style={{
                background: "var(--accent)", color: "#0a0a0a",
                padding: "14px 36px", borderRadius: "100px",
                fontWeight: 600, fontSize: "0.9rem"
              }}>
                Book Consultation →
              </Link>
              <Link to="/services" style={{
                border: "1px solid var(--border)", color: "var(--fg)",
                padding: "14px 36px", borderRadius: "100px",
                fontSize: "0.9rem"
              }}>
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
