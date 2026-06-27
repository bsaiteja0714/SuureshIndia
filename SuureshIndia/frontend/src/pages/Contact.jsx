import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import {
  FaArrowRight,
  FaFacebookF,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaTwitter,
  FaCheckCircle,
  FaTimesCircle,
  FaGlobe,
  FaBuilding,
  FaDirections,
} from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageBanner from "../components/PageBanner";
import { contactAPI, orgSettingsAPI, socialLinksAPI } from "../services/api";
import "./Contact.css";

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const contactDetails = [
  [HiOutlineMail, "Email", "contact@suureshindia.com"],
  [FaPhoneAlt, "Phone", "+91 98765 43210"],
  [FaMapMarkerAlt, "Office", "Hyderabad, Telangana, India"],
];

const defaultSocialLinks = [
  { label: "LinkedIn", icon: FaLinkedinIn, href: "https://linkedin.com", key: "linkedin" },
  { label: "Twitter / X", icon: FaTwitter, href: "https://twitter.com", key: "twitter" },
  { label: "Facebook", icon: FaFacebookF, href: "https://facebook.com", key: "facebook" },
];

// Office locations data
// Default offices data fallback
const defaultOffices = [
  {
    country: "India",
    flag: "🇮🇳",
    icon: FaBuilding,
    name: "P. Suuresh & Associates",
    address:
      "Plot No. 12, Kavuri Hills, Madhapur,\nHyderabad – 500 033,\nTelangana, India",
    phone: "+91 98765 43210",
    email: "contact@suureshindia.com",
    mapsUrl:
      "https://maps.google.com/?q=Kavuri+Hills+Madhapur+Hyderabad+Telangana+India",
    embedQuery: "Kavuri+Hills,+Madhapur,+Hyderabad,+Telangana,+India",
  },
  {
    country: "USA",
    flag: "🇺🇸",
    icon: FaGlobe,
    name: "SuureshIndia Consulting LLC",
    address:
      "1234 Financial Drive, Suite 500,\nFremant, CA 94538,\nUnited States",
    phone: "+1 (510) 555-0192",
    email: "usa@suureshindia.com",
    mapsUrl: "https://maps.google.com/?q=Fremont+CA+94538+USA",
    embedQuery: "Fremont,+CA+94538,+United+States",
  },
];

// Validate Indian mobile number
function isValidPhone(phone) {
  if (!phone) return true; // optional
  return /^[6-9]\d{9}$/.test(phone.replace(/[\s\-+]/g, ""));
}

function Spinner() {
  return (
    <span
      style={{
        display: "inline-block",
        width: 16,
        height: 16,
        border: "2px solid rgba(0,0,0,0.3)",
        borderTopColor: "#0a0a0a",
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
      }}
    />
  );
}

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    service: "Income Tax Filing",
    message: "",
    honeypot: "", // hidden spam field
  });
  const [status, setStatus] = useState({ state: "idle", message: "" });
  const [phoneError, setPhoneErr] = useState("");
  const toastRef = useRef(null);
  
  const [offices, setOffices] = useState(defaultOffices);
  const [socialLinks, setSocialLinks] = useState(defaultSocialLinks);

  useEffect(() => {
    orgSettingsAPI.get()
      .then(data => {
        if (data && data.offices && data.offices.length > 0) {
          // Add default icons and flags based on heading/country
          const mappedOffices = data.offices.map(o => ({
            ...o,
            country: o.heading?.includes("USA") ? "USA" : "India",
            flag: o.heading?.includes("USA") ? "🇺🇸" : "🇮🇳",
            icon: o.heading?.includes("USA") ? FaGlobe : FaBuilding,
            name: o.heading,
            embedQuery: encodeURIComponent(o.address)
          }));
          setOffices(mappedOffices);
        }
      })
      .catch(() => {});
      
    socialLinksAPI.get()
      .then(data => {
        if (data) {
          setSocialLinks(prev => prev.map(s => ({
            ...s,
            href: data[s.key] || s.href
          })).filter(s => data[s.key])); // Only show if URL exists
        }
      })
      .catch(() => {});
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    if (field === "phone") setPhoneErr("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Honeypot check — bots fill hidden fields
    if (form.honeypot) return;

    // Phone validation
    if (form.phone && !isValidPhone(form.phone)) {
      setPhoneErr("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    setStatus({ state: "sending", message: "" });

    try {
      // 1. Save to Sanity via backend
      const res = await contactAPI.submit({
        name: form.name,
        email: form.email,
        phone: form.phone,
        companyName: form.companyName,
        service: form.service,
        message: form.message,
      });

      // 2. Send EmailJS notification (best-effort)
      if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
        try {
          await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            {
              from_name: form.name,
              from_email: form.email,
              phone: form.phone || "Not provided",
              company_name: form.companyName || "Not provided",
              service_type: form.service,
              message: form.message,
              reply_to: form.email,
            },
            { publicKey: EMAILJS_PUBLIC_KEY },
          );
        } catch (emailErr) {
          console.error("EmailJS notification failed:", emailErr);
          // Don't block success — Sanity already saved the lead
        }
      }

      setStatus({
        state: "success",
        message: res.message || "Message sent! We'll be in touch shortly.",
      });
      setForm({
        name: "",
        email: "",
        phone: "",
        companyName: "",
        service: "Income Tax Filing",
        message: "",
        honeypot: "",
      });

      // Auto-dismiss success after 6 seconds
      clearTimeout(toastRef.current);
      toastRef.current = setTimeout(() => {
        setStatus((s) =>
          s.state === "success" ? { state: "idle", message: "" } : s,
        );
      }, 6000);
    } catch (err) {
      setStatus({
        state: "error",
        message: err.message || "Something went wrong. Please try again.",
      });
    }
  }

  return (
    <>
      <Navbar />
      <PageBanner
        title="Contact Us"
        subtitle="Let's talk about how we can help your business grow."
      />

      {/* Toast Notifications */}
      {(status.state === "success" || status.state === "error") && (
        <div className={`contact-toast ${status.state}`} role="alert">
          {status.state === "success" ? (
            <FaCheckCircle size={18} />
          ) : (
            <FaTimesCircle size={18} />
          )}
          <span>{status.message}</span>
          <button
            onClick={() => setStatus({ state: "idle", message: "" })}
            className="contact-toast__close"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      <section className="contact-section">
        <div className="container contact-grid">
          {/* Left column — details */}
          <div>
            <h3 className="contact-heading">Get in touch</h3>
            <p className="contact-intro">
              Whether you need help with taxes, GST registration, or business
              advisory, our expert team is ready to assist.
            </p>

            {contactDetails.map(([Icon, label, value]) => (
              <div key={label} className="contact-detail">
                <span className="contact-detail__icon">
                  <Icon size={18} />
                </span>
                <div>
                  <div className="contact-detail__label">{label}</div>
                  <div className="contact-detail__value">{value}</div>
                </div>
              </div>
            ))}

            <div className="contact-socials">
              {socialLinks.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-social-link"
                    aria-label={s.label}
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right column — form */}
          <form onSubmit={handleSubmit} className="contact-form" noValidate>
            {/* Honeypot — hidden from humans, bots fill it */}
            <input
              type="text"
              name="website"
              value={form.honeypot}
              onChange={(e) => update("honeypot", e.target.value)}
              style={{ display: "none" }}
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="contact-form__fields">
              <div className="contact-field">
                <label htmlFor="cf-name">
                  Name <span style={{ color: "var(--accent)" }}>*</span>
                </label>
                <input
                  id="cf-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Your full name"
                />
              </div>

              <div className="contact-field">
                <label htmlFor="cf-email">
                  Email <span style={{ color: "var(--accent)" }}>*</span>
                </label>
                <input
                  id="cf-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@example.com"
                />
              </div>

              <div className="contact-field">
                <label htmlFor="cf-phone">Phone</label>
                <input
                  id="cf-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                />
                {phoneError && (
                  <span className="contact-field__error">{phoneError}</span>
                )}
              </div>

              <div className="contact-field">
                <label htmlFor="cf-company">Company / Firm Name</label>
                <input
                  id="cf-company"
                  type="text"
                  value={form.companyName}
                  onChange={(e) => update("companyName", e.target.value)}
                  placeholder="Your company name (optional)"
                />
              </div>

              <div className="contact-field">
                <label htmlFor="cf-service">Service Required</label>
                <select
                  id="cf-service"
                  value={form.service}
                  onChange={(e) => update("service", e.target.value)}
                >
                  <option>Income Tax Filing</option>
                  <option>GST Compliance</option>
                  <option>Audit Services</option>
                  <option>Corporate Advisory</option>
                  <option>Company Registration</option>
                  <option>TDS / TCS Compliance</option>
                  <option>Payroll Services</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="contact-field">
                <label htmlFor="cf-message">
                  Message <span style={{ color: "var(--accent)" }}>*</span>
                </label>
                <textarea
                  id="cf-message"
                  rows="4"
                  required
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder="Describe your requirement in brief..."
                />
              </div>

              <button
                type="submit"
                disabled={status.state === "sending"}
                className="contact-submit"
                id="contact-submit-btn"
              >
                {status.state === "sending" ? (
                  <>
                    <Spinner /> Sending...
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <FaArrowRight size={12} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Global Presence Section */}
      <section
        style={{
          padding: "3rem 0",
          background: "var(--bg)",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ maxWidth: 640 }}>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.55rem",
                color: "var(--fg)",
                marginBottom: "0.75rem",
              }}
            >
              Help us improve with your feedback
            </h3>
            <p
              style={{
                color: "var(--muted)",
                lineHeight: 1.75,
                fontSize: "0.95rem",
              }}
            >
              Found our service useful? Share your review and feedback with
              us so we can better serve clients like you.
            </p>
          </div>
          <div>
            <Link
              to="/feedback"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "var(--accent)",
                color: "#0a0a0a",
                padding: "0.85rem 1.5rem",
                borderRadius: "100px",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Share Feedback
              <FaArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <section className="offices-section">
        <div className="container">
          <div className="offices-header">
            <span className="offices-label">Our Locations</span>
            <h2 className="offices-title">Global Presence</h2>
            <p className="offices-subtitle">
              Serving clients across India and the United States with dedicated
              local expertise.
            </p>
          </div>

          <div className="offices-grid">
            {offices.map((office) => {
              const Icon = office.icon;
              return (
                <div key={office.country} className="office-card">
                  <div className="office-card__header">
                    <span className="office-card__flag">{office.flag}</span>
                    <div>
                      <div className="office-card__country">
                        {office.country} Office
                      </div>
                      <div className="office-card__name">{office.name}</div>
                    </div>
                  </div>

                  {/* Map embed */}
                  <div className="office-card__map">
                    <iframe
                      title={`${office.country} Office Map`}
                      src={`https://maps.google.com/maps?q=${office.embedQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                      width="100%"
                      height="200"
                      style={{ border: 0, borderRadius: "8px" }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>

                  <div className="office-card__details">
                    <div className="office-card__detail">
                      <FaMapMarkerAlt size={14} className="office-card__icon" />
                      <pre className="office-card__address">
                        {office.address}
                      </pre>
                    </div>
                    <div className="office-card__detail">
                      <FaPhoneAlt size={14} className="office-card__icon" />
                      <a href={`tel:${office.phone.replace(/\s/g, "")}`}>
                        {office.phone}
                      </a>
                    </div>
                    <div className="office-card__detail">
                      <HiOutlineMail size={14} className="office-card__icon" />
                      <a href={`mailto:${office.email}`}>{office.email}</a>
                    </div>
                  </div>

                  <a
                    href={office.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="office-card__directions"
                  >
                    <FaDirections size={14} />
                    Get Directions
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}

export default Contact;
