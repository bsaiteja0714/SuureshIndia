import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaClock,
  FaChevronUp,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { socialLinksAPI } from "../services/api";
import { defaultSocialLinks } from "../data/socialLinks";
import { defaultOrgSettings } from "../data/orgSettings";
import "./Footer.css";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "Our Services", to: "/services" },
  { label: "Meet the Team", to: "/team" },
  { label: "News & Journal", to: "/journal" },
  { label: "Government Updates", to: "/updates" },
  { label: "Compliance Calendar", to: "/calendar" },
  { label: "Downloads", to: "/downloads" },
  { label: "Contact Us", to: "/contact" },
];

const practiceAreas = [
  { label: "Income Tax Filing", to: "/services#income-tax-filing" },
  { label: "GST Compliance", to: "/services#gst-compliance" },
  { label: "Audit Services", to: "/services#audit-services" },
  { label: "Corporate Advisory", to: "/services#corporate-advisory" },
  { label: "Company Registration", to: "/services#company-registration" },
  { label: "NRI Taxation", to: "/services" },
  { label: "Payroll Services", to: "/services" },
  { label: "ROC Compliance", to: "/services" },
];

const SOCIAL_ICON_MAP = {
  linkedin: { Icon: FaLinkedinIn, label: "LinkedIn" },
  facebook: { Icon: FaFacebookF, label: "Facebook" },
  instagram: { Icon: FaInstagram, label: "Instagram" },
  twitter: { Icon: FaTwitter, label: "X (Twitter)" },
  youtube: { Icon: FaYoutube, label: "YouTube" },
  whatsapp: { Icon: FaWhatsapp, label: "WhatsApp", isWhatsApp: true },
  generalEmail: { Icon: FaEnvelope, label: "Email", isEmail: true },
};

function buildSocialHref(key, value) {
  if (key === "whatsapp") {
    const number = value.replace(/[^0-9+]/g, "");
    const msg = defaultSocialLinks.whatsappMessage || "";
    return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
  }
  if (key === "generalEmail") return `mailto:${value}`;
  return value;
}

function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState(null);
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [socialLinks, setSocialLinks] = useState(defaultSocialLinks);
  // The offices will be fetched dynamically via orgSettingsAPI

  const emailJsEnabled = useMemo(() => {
    return (
      import.meta.env.VITE_EMAILJS_SERVICE_ID &&
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID &&
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );
  }, []);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 420);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (newsletterStatus === "success") {
      const timeout = setTimeout(() => setNewsletterStatus(null), 4500);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [newsletterStatus]);

  useEffect(() => {
    socialLinksAPI
      .get()
      .then((data) => {
        if (data && Object.keys(data).length > 0) {
          setSocialLinks({ ...defaultSocialLinks, ...data });
        }
      })
      .catch(() => {});
  }, []);

  const [orgSettings, setOrgSettings] = useState(defaultOrgSettings);
  useEffect(() => {
    import("../services/api").then(({ orgSettingsAPI }) => {
      orgSettingsAPI
        .get()
        .then((data) => {
          if (data && Object.keys(data).length > 0) {
            setOrgSettings((prev) => ({ ...prev, ...data }));
          }
        })
        .catch(() => {});
    });
  }, []);

  const offices = (orgSettings.offices || defaultOrgSettings.offices).filter(
    (office) => office.heading !== "Dubai Liaison Office",
  );

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function handleSubscribe(event) {
    event.preventDefault();
    if (!isValidEmail(newsletterEmail)) {
      setNewsletterStatus("invalid");
      return;
    }

    setNewsletterLoading(true);
    setNewsletterStatus(null);

    if (!emailJsEnabled) {
      setNewsletterStatus("missing-config");
      setNewsletterLoading(false);
      return;
    }

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { email: newsletterEmail },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );
      setNewsletterStatus("success");
      setNewsletterEmail("");
    } catch (error) {
      console.error(error);
      setNewsletterStatus("error");
    } finally {
      setNewsletterLoading(false);
    }
  }

  return (
    <footer className="site-footer footer-premium">
      <div className="footer-inner container">
        <div className="footer-top">
          {/* ── Column 1: Brand + Social ── */}
          <motion.section
            className="footer-brand-panel"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <div
              className="footer-logo"
              aria-label="P. Suuresh & Associates logo"
            >
              <span>PSA</span>
            </div>
            <div className="footer-brand-copy">
              <h2>P. Suuresh & Associates</h2>
              <p className="footer-subtitle">
                Chartered Accountants | Tax Consultants | Business Advisors
              </p>
              <p className="footer-description">
                P. Suuresh & Associates is a leading Chartered Accountancy firm
                providing taxation, GST compliance, audit, accounting, business
                registration, and financial advisory services across India with
                international support for global clients.
              </p>

              {/* Social Icons */}
              <div
                className="footer-socials"
                role="list"
                aria-label="Social media links"
              >
                {Object.entries(SOCIAL_ICON_MAP).map(
                  ([key, { Icon, label, isWhatsApp }]) => {
                    const val = socialLinks[key];
                    if (!val) return null;
                    const href = buildSocialHref(key, val);
                    return (
                      <a
                        key={key}
                        href={href}
                        target={key !== "generalEmail" ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className={`footer-social-link${isWhatsApp ? " whatsapp" : ""}`}
                        aria-label={label}
                        role="listitem"
                      >
                        <Icon />
                      </a>
                    );
                  },
                )}
              </div>

              <p className="footer-established">
                ✦ Established {orgSettings.established} · Serving 500+ Clients
              </p>
            </div>
          </motion.section>

          {/* ── Column 2: Practice Areas ── */}
          <motion.section
            className="footer-practice"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            <h3>Practice Areas</h3>
            <nav
              aria-label="Practice area links"
              className="footer-practice-list"
            >
              {practiceAreas.map((area) => (
                <Link
                  key={area.label}
                  to={area.to}
                  className="footer-practice-link"
                >
                  {area.label}
                </Link>
              ))}
            </nav>

            <h3 style={{ marginTop: "2rem" }}>Quick Links</h3>
            <nav aria-label="Quick links" className="footer-practice-list">
              {quickLinks.slice(0, 5).map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="footer-practice-link"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.section>

          {/* ── Column 3: Global Offices ── */}
          <motion.section
            className="footer-offices"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1 }}
          >
            <h3>Global Offices</h3>
            {offices.map((office) => (
              <div key={office.heading} className="footer-office-card">
                <h4>{office.heading}</h4>
                <p className="office-detail">
                  <FaMapMarkerAlt className="office-icon" aria-hidden="true" />
                  <span>{office.address}</span>
                </p>
                <p className="office-detail">
                  <FaPhoneAlt className="office-icon" aria-hidden="true" />
                  <a
                    href={`tel:${office.phone.replace(/[^0-9+]/g, "")}`}
                    className="footer-link-inline"
                  >
                    {office.phone}
                  </a>
                </p>
                <p className="office-detail">
                  <FaEnvelope className="office-icon" aria-hidden="true" />
                  <a
                    href={`mailto:${office.email}`}
                    className="footer-link-inline"
                  >
                    {office.email}
                  </a>
                </p>
                <p className="office-detail">
                  <FaClock className="office-icon" aria-hidden="true" />
                  <span>{office.hours}</span>
                </p>
                {office.mapUrl && (
                  <a
                    className="office-map-button"
                    href={office.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${office.heading} in Google Maps`}
                  >
                    <FaExternalLinkAlt style={{ fontSize: "0.65rem" }} />
                    View on Maps
                  </a>
                )}
              </div>
            ))}
          </motion.section>
        </div>

        {/* ── Secondary Bar ── */}
        <div className="footer-secondary">
          <p className="footer-copyright">
            © {new Date().getFullYear()} P. Suuresh & Associates. All Rights
            Reserved.
          </p>
          <nav className="footer-policy-nav" aria-label="Footer policy links">
            <Link to="/privacy" className="footer-policy-link">
              Privacy Policy
            </Link>
            <Link to="/terms" className="footer-policy-link">
              Terms & Conditions
            </Link>
            <Link to="/disclaimer" className="footer-policy-link">
              Disclaimer
            </Link>
            <Link to="/sitemap" className="footer-policy-link">
              Sitemap
            </Link>
            <Link to="/contact" className="footer-policy-link">
              Contact
            </Link>
          </nav>
        </div>

        {/* ── Legal Disclaimer ── */}
        <div className="footer-disclaimer-block">
          <p>
            The information provided on this website is for general
            informational purposes only and should not be considered legal, tax,
            or financial advice. Please consult our professionals before making
            any financial or business decisions. P. Suuresh & Associates is
            regulated by the Institute of Chartered Accountants of India (ICAI).
          </p>
        </div>
      </div>

      {showBackToTop && (
        <button
          type="button"
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
        >
          <FaChevronUp />
        </button>
      )}
    </footer>
  );
}

export default Footer;
