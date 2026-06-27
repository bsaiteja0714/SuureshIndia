import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageBanner from "../components/PageBanner";
import { servicesAPI } from "../services/api";
import {
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaArrowRight,
} from "react-icons/fa";

// ── FAQ Accordion ─────────────────────────────────────────────────────────
function FAQ({ items = [] }) {
  const [open, setOpen] = useState(null);
  if (!items.length) {
    return <p style={{ color: "var(--muted)" }}>No FAQs available.</p>;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            border: "1px solid var(--border)",
            borderRadius: "10px",
            overflow: "hidden",
            transition: "border-color 0.2s",
            borderColor: open === i ? "rgba(212,175,55,0.4)" : "var(--border)",
          }}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: "100%",
              background: "var(--card-bg)",
              border: "none",
              padding: "1rem 1.25rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <span
              style={{
                color: "var(--fg)",
                fontSize: "0.9rem",
                fontWeight: 500,
              }}
            >
              {item.question}
            </span>
            {open === i ? (
              <FaChevronUp
                size={13}
                style={{ color: "var(--accent)", flexShrink: 0 }}
              />
            ) : (
              <FaChevronDown
                size={13}
                style={{ color: "var(--muted)", flexShrink: 0 }}
              />
            )}
          </button>
          <div
            style={{
              maxHeight: open === i ? "300px" : "0",
              overflow: "hidden",
              transition: "max-height 0.35s ease",
            }}
          >
            <div
              style={{
                padding: "0 1.25rem 1.25rem",
                color: "var(--muted)",
                fontSize: "0.875rem",
                lineHeight: 1.7,
              }}
            >
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Service Detail Card ───────────────────────────────────────────────────
function ServiceDetail({ service }) {
  const [expanded, setExpanded] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const fullDescription = service.fullDescription || service.description || "";
  const hasLongDescription = fullDescription.length > 320;
  const previewDescription = hasLongDescription
    ? `${fullDescription.slice(0, 320).trim()}...`
    : fullDescription;

  return (
    <div
      id={service.slug || service.title}
      style={{
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        background: "var(--card-bg)",
        overflow: "hidden",
        transition: "border-color 0.3s, box-shadow 0.3s",
        boxShadow: expanded ? "0 16px 48px rgba(212,175,55,0.12)" : "none",
        borderColor: expanded ? "rgba(212,175,55,0.4)" : "var(--border)",
        marginBottom: "1.5rem",
      }}
    >
      {/* Card header (always visible) */}
      <div
        className="service-detail-header"
        style={{
          padding: "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "1.5rem",
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "0.75rem",
            }}
          >
            <span
              style={{
                fontSize: "2rem",
                width: 52,
                height: 52,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--accent-dim)",
                borderRadius: "12px",
              }}
            >
              {service.icon}
            </span>
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.3rem",
                  color: "var(--fg)",
                  marginBottom: "4px",
                }}
              >
                {service.title}
              </h2>
              <p
                style={{
                  color: "var(--muted)",
                  fontSize: "0.875rem",
                  lineHeight: 1.6,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {service.description}
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexShrink: 0 }}>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              background: expanded ? "var(--accent-dim)" : "transparent",
              border: "1px solid var(--border)",
              color: expanded ? "var(--accent)" : "var(--muted)",
              borderRadius: "100px",
              padding: "0.6rem 1.25rem",
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            {expanded ? (
              <>
                <FaChevronUp size={11} /> Less Info
              </>
            ) : (
              <>
                <FaChevronDown size={11} /> Learn More
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expanded content */}
      <div
        style={{
          maxHeight: expanded ? "2000px" : "0",
          overflow: "hidden",
          transition: "max-height 0.5s ease",
        }}
      >
        <div style={{ borderTop: "1px solid var(--border)", padding: "2rem" }}>
          {/* Full description */}
          <p
            style={{
              color: "var(--muted)",
              lineHeight: 1.8,
              marginBottom: hasLongDescription ? "1rem" : "2.5rem",
              fontSize: "0.925rem",
              whiteSpace: "pre-line",
              overflowWrap: "break-word",
              wordBreak: "break-word",
            }}
          >
            {showFullDesc ? fullDescription : previewDescription}
          </p>
          {hasLongDescription && (
            <button
              type="button"
              onClick={() => setShowFullDesc((prev) => !prev)}
              style={{
                border: "none",
                background: "none",
                color: "var(--accent)",
                fontWeight: 700,
                cursor: "pointer",
                marginBottom: "1.5rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.9rem",
              }}
            >
              <>
                {showFullDesc ? (
                  <>
                    Show Less <FaChevronUp size={12} />
                  </>
                ) : (
                  <>
                    Read More <FaChevronDown size={12} />
                  </>
                )}
              </>
            </button>
          )}

          <div
            className="service-expanded-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "2.5rem",
            }}
          >
            {/* Benefits */}
            <div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.1rem",
                  color: "var(--fg)",
                  marginBottom: "1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <FaCheckCircle size={16} style={{ color: "var(--accent)" }} />{" "}
                Key Benefits
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.6rem",
                }}
              >
                {(service.benefits || []).map((b, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "var(--accent)",
                        flexShrink: 0,
                        marginTop: "0.45rem",
                      }}
                    />
                    <span
                      style={{
                        color: "var(--muted)",
                        fontSize: "0.875rem",
                        lineHeight: 1.6,
                      }}
                    >
                      {b}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Process */}
            <div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.1rem",
                  color: "var(--fg)",
                  marginBottom: "1.25rem",
                }}
              >
                Our Process
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {(service.processFlow || []).map((p) => (
                  <div
                    key={p.step || p.title}
                    style={{
                      display: "flex",
                      gap: "1rem",
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "var(--accent-dim)",
                        border: "1px solid rgba(212,175,55,0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--accent)",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {p.step}
                    </span>

                    <div>
                      <div
                        style={{
                          color: "var(--fg)",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                        }}
                      >
                        {p.title}
                      </div>

                      <div
                        style={{
                          color: "var(--muted)",
                          fontSize: "0.82rem",
                          lineHeight: 1.6,
                        }}
                      >
                        {p.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div style={{ marginTop: "2.5rem" }}>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.1rem",
                color: "var(--fg)",
                marginBottom: "1.25rem",
              }}
            >
              Frequently Asked Questions
            </h3>
            <FAQ items={service.faqs || []} />
          </div>

          {/* CTA */}
          <div
            style={{
              marginTop: "2rem",
              padding: "1.5rem",
              background: "var(--accent-dim)",
              border: "1px solid rgba(212,175,55,0.25)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1.5rem",
              flexWrap: "wrap"
            }}
          >
            <div>
              <div
                style={{
                  color: "var(--fg)",
                  fontWeight: 600,
                  marginBottom: "4px",
                }}
              >
                Ready to get started with {service.title}?
              </div>
              <div style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                Book a free 30-minute consultation with our expert team.
              </div>
            </div>
            <Link
              to="/contact"
              style={{
                background: "var(--accent)",
                color: "#0a0a0a",
                border: "none",
                borderRadius: "100px",
                padding: "0.75rem 1.75rem",
                fontSize: "0.875rem",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              Book Free Consultation <FaArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Services Page ──────────────────────────────────────────────────────────
function Services() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    servicesAPI
      .getAll()
      .then((res) => {
        setData(res);
      })
      .catch((err) => console.error("Error fetching services:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <PageBanner
        title="Our Services"
        subtitle="Comprehensive financial and compliance services tailored to your business needs."
      />

      <section style={{ padding: "4rem 0" }}>
        <div className="container">
          {loading ? (
            <div
              style={{
                color: "var(--muted)",
                textAlign: "center",
                padding: "4rem 0",
              }}
            >
              Loading services...
            </div>
          ) : data.length === 0 ? (
            <div
              style={{
                color: "var(--muted)",
                textAlign: "center",
                padding: "4rem 0",
              }}
            >
              No services found.
            </div>
          ) : (
            data.map((service) => (
              <ServiceDetail
                key={service._id || service.id || service.title}
                service={{
                  ...service,
                  icon: service.iconEmoji || service.icon || "📋",
                }}
              />
            ))
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section
        style={{
          padding: "5rem 0",
          background: "var(--card-bg)",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div className="container" style={{ textAlign: "center" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "2rem",
              color: "var(--fg)",
              marginBottom: "1rem",
            }}
          >
            Can't find what you're looking for?
          </h2>
          <p
            style={{
              color: "var(--muted)",
              maxWidth: 480,
              margin: "0 auto 2rem",
              lineHeight: 1.7,
            }}
          >
            Our team handles a wide range of financial and compliance
            requirements. Contact us to discuss your specific needs.
          </p>
          <Link
            to="/contact"
            style={{
              background: "var(--accent)",
              color: "#0a0a0a",
              padding: "0.875rem 2.5rem",
              borderRadius: "100px",
              fontWeight: 700,
              fontSize: "0.95rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            Talk to an Expert <FaArrowRight size={13} />
          </Link>
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .service-expanded-grid { grid-template-columns: 1fr !important; }
          .service-detail-header { flex-direction: column; gap: 1rem; }
        }
      `}</style>
    </>
  );
}

export default Services;
