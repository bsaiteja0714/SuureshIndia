import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { servicesAPI } from "../services/api";

function ServicesPreview() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    servicesAPI.getAll()
      .then(data => setServices(data.slice(0, 4)))
      .catch(err => console.error("Error loading services:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section style={{ padding: "7rem 0", borderTop: "1px solid var(--border)" }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "4rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <span style={{ fontSize: "0.75rem", letterSpacing: "0.15em", color: "var(--accent)", textTransform: "uppercase", fontWeight: 500 }}>What We Do</span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                marginTop: "0.5rem",
                color: "var(--fg)",
              }}
            >
              Our Services
            </h2>
          </div>
          <Link
            to="/services"
            style={{ fontSize: "0.85rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: "6px" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
          >
            <span>View all services</span>
            <FaArrowRight size={12} />
          </Link>
        </div>

        {loading ? (
          <div style={{ color: "var(--muted)" }}>Loading services...</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
            {services.map((s) => (
              <div
                key={s._id || s.title}
                style={{
                  padding: "2rem",
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  transition: "border-color 0.2s, background 0.2s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(201,169,110,0.3)";
                  e.currentTarget.style.background = "rgba(201,169,110,0.04)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.background = "var(--card-bg)";
                }}
              >
                <div style={{ color: "var(--accent)", marginBottom: "1rem", fontSize: "1.5rem" }}>
                  {s.iconEmoji || "📋"}
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, color: "var(--fg)", marginBottom: "0.5rem" }}>
                  {s.title}
                </h3>
                <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>{s.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`
        @media (max-width: 640px) {
          section div[style*="grid-template-columns: repeat(2, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

export default ServicesPreview;
