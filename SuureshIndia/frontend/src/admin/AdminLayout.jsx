import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaBullhorn,
  FaBuilding,
  FaCalendarAlt,
  FaCog,
  FaFileAlt,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUsers,
  FaCommentAlt,
  FaFilePdf,
  FaBars,
  FaTimes,
  FaCogs,
  FaHome,
  FaShareAlt,
  FaShieldAlt,
  FaGavel,
  FaInfoCircle
} from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { useAuth } from "./AuthContext";

const navGroups = [
  {
    label: "Overview",
    items: [
      { to: "/admin/dashboard", label: "Dashboard", icon: FaTachometerAlt },
    ]
  },
  {
    label: "Content Management",
    items: [
      { to: "/admin/services", label: "Services", icon: FaCogs },
      { to: "/admin/articles", label: "Articles", icon: FaFileAlt },
      { to: "/admin/updates", label: "Updates", icon: FaBullhorn },
      { to: "/admin/calendar", label: "Calendar", icon: FaCalendarAlt },
    ]
  },
  {
    label: "CRM & Comm",
    items: [
      { to: "/admin/leads", label: "Contact Leads", icon: HiOutlineMail },
      { to: "/admin/feedback", label: "Feedback", icon: FaCommentAlt },
    ]
  },
  {
    label: "Website Policies",
    items: [
      { to: "/admin/policies/privacy", label: "Privacy Policy", icon: FaShieldAlt },
      { to: "/admin/policies/terms", label: "Terms & Conditions", icon: FaGavel },
      { to: "/admin/policies/disclaimer", label: "Disclaimer", icon: FaInfoCircle },
    ]
  },
  {
    label: "Management",
    items: [
      { to: "/admin/team", label: "Team Members", icon: FaUsers },
      { to: "/admin/files", label: "Downloads & Files", icon: FaFilePdf },
      { to: "/admin/settings", label: "Site Settings", icon: FaCog },
      { to: "/admin/settings/org", label: "Org & Offices", icon: FaBuilding },
      { to: "/admin/settings/social", label: "Social Links", icon: FaShareAlt },
      { to: "/admin/settings/home", label: "Home Page", icon: FaHome },
    ]
  }
];

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/admin/login");
  }

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--fg)", display: "flex", flexDirection: "column" }}>
      {/* Mobile Header */}
      <header className="admin-mobile-header" style={{
        display: "none",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem",
        background: "var(--card-bg)",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        zIndex: 50
      }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.2rem" }}>
          SuureshIndia <span style={{ color: "var(--accent)", fontSize: "0.7rem", letterSpacing: "0.1em" }}>ADMIN</span>
        </div>
        <button onClick={toggleMobileMenu} style={{ background: "none", border: "none", color: "var(--fg)" }}>
          {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </header>

      <div style={{ display: "flex", flex: 1, position: "relative" }}>
        {/* Sidebar */}
        <aside
          className={`admin-sidebar ${mobileMenuOpen ? 'open' : ''}`}
          style={{
            width: "260px",
            flexShrink: 0,
            background: "var(--card-bg)",
            borderRight: "1px solid var(--border)",
            padding: "1.5rem 1rem",
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            position: "sticky",
            top: 0,
            overflowY: "auto",
            transition: "transform 0.3s ease",
            zIndex: 40,
          }}
        >
          <div className="admin-sidebar-brand" style={{ padding: "0 0.75rem", marginBottom: "2rem" }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.4rem" }}>
              SuureshIndia
            </div>
            <div style={{ color: "var(--accent)", fontSize: "0.75rem", letterSpacing: "0.15em", marginTop: "0.2rem" }}>
              ADMIN PANEL
            </div>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: "1.5rem", flex: 1 }}>
            {navGroups.map((group, idx) => (
              <div key={idx}>
                <div style={{
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--muted)",
                  padding: "0 0.75rem",
                  marginBottom: "0.5rem",
                  fontWeight: 600
                }}>
                  {group.label}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  {group.items.map((item) => {
                    const active = location?.pathname.startsWith(item.to);
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileMenuOpen(false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          padding: "0.6rem 0.75rem",
                          borderRadius: "8px",
                          fontSize: "0.875rem",
                          fontWeight: active ? 600 : 400,
                          color: active ? "var(--fg)" : "var(--muted)",
                          background: active ? "var(--accent-dim)" : "transparent",
                          borderLeft: active ? "3px solid var(--accent)" : "3px solid transparent",
                          transition: "all 0.2s",
                        }}
                      >
                        <Icon size={16} style={{ color: active ? "var(--accent)" : "inherit" }} />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem", marginTop: "2rem" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--muted)", padding: "0 0.75rem", marginBottom: "0.75rem" }}>
              Logged in as
              <br />
              <strong style={{ color: "var(--fg)" }}>{admin?.email}</strong>
            </div>
            <Link
              to="/"
              style={{
                display: "block",
                padding: "0.6rem 0.75rem",
                borderRadius: "8px",
                fontSize: "0.85rem",
                color: "var(--muted)",
                transition: "background 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                <FaArrowLeft size={14} />
                View Website
              </span>
            </Link>
            <button
              onClick={handleLogout}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "0.6rem 0.75rem",
                borderRadius: "8px",
                fontSize: "0.85rem",
                color: "#e57373",
                background: "none",
                border: "none",
                marginTop: "0.25rem",
                cursor: "pointer",
                transition: "background 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(229, 115, 115, 0.1)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                <FaSignOutAlt size={14} />
                Logout
              </span>
            </button>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {mobileMenuOpen && (
          <div 
            className="admin-mobile-overlay"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: "fixed",
              top: 0, left: 0, right: 0, bottom: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 30
            }}
          />
        )}

        <main style={{ flex: 1, padding: "2rem", overflowY: "auto", minWidth: 0 }}>{children}</main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-mobile-header { display: flex !important; }
          .admin-sidebar {
            position: fixed !important;
            transform: translateX(-100%);
          }
          .admin-sidebar.open {
            transform: translateX(0);
          }
          .admin-sidebar-brand { display: none; }
        }
      `}</style>
    </div>
  );
}
