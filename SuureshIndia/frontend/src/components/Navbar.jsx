import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaSun,
  FaMoon,
  FaSearch,
  FaUserLock,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import SearchModal from "./SearchModal";

const navLinks = [
  { name: "Home", to: "/" },
  { name: "Services", to: "/services" },
  { name: "Journal", to: "/journal" },
  { name: "Updates", to: "/updates" },
  { name: "Calendar", to: "/calendar" },
  { name: "Team", to: "/team" },
  { name: "Contact", to: "/contact" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  // Handle Theme Change
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const isAdminLoggedIn = !!localStorage.getItem("admin_token");

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: scrolled ? "16px" : "0",
          left: scrolled ? "16px" : "0",
          right: scrolled ? "16px" : "0",
          zIndex: 100,
          transition: "all 0.4s ease",
        }}
      >
        <nav
          style={{
            maxWidth: scrolled ? "1150px" : "100%",
            margin: "0 auto",
            background: scrolled ? "var(--nav-bg)" : "transparent",
            backdropFilter: scrolled ? "blur(20px)" : "none",
            border: scrolled ? "1px solid var(--border)" : "none",
            boxShadow: scrolled ? "var(--shadow)" : "none",
            borderRadius: scrolled ? "16px" : "0",
            padding: scrolled ? "0 2rem" : "0 2rem",
            transition: "all 0.4s ease",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: scrolled ? "60px" : "80px",
              transition: "height 0.4s ease",
            }}
          >
            {/* Logo */}
            <Link
              to="/"
              style={{ display: "flex", alignItems: "baseline", gap: "6px" }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: scrolled ? "1.2rem" : "1.5rem",
                  color: "var(--fg)",
                  transition: "font-size 0.4s ease",
                  letterSpacing: "-0.01em",
                }}
              >
                SuureshIndia
              </span>
              <span
                style={{
                  color: "var(--accent)",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                }}
              >
                CA
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div
              style={{ display: "flex", gap: "1.75rem", alignItems: "center" }}
              className="desktop-nav"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    fontSize: "0.85rem",
                    color:
                      location.pathname === link.to
                        ? "var(--accent)"
                        : "var(--muted)",
                    fontWeight: location.pathname === link.to ? 600 : 400,
                    transition: "color 0.2s",
                    position: "relative",
                    paddingBottom: "2px",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "var(--fg)")}
                  onMouseLeave={(e) =>
                    (e.target.style.color =
                      location.pathname === link.to
                        ? "var(--accent)"
                        : "var(--muted)")
                  }
                >
                  {link.name}
                  {location.pathname === link.to && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: "-4px",
                        left: "15%",
                        right: "15%",
                        height: "2px",
                        background: "var(--accent)",
                        borderRadius: "10px",
                      }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* CTA + Tools (Theme switcher, Search, Admin portal) */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(true)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--muted)",
                  fontSize: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "8px",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--fg)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--muted)")
                }
                aria-label="Global Search"
              >
                <FaSearch />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--muted)",
                  fontSize: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "8px",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--fg)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--muted)")
                }
                aria-label="Toggle Theme"
              >
                {theme === "dark" ? <FaSun /> : <FaMoon />}
              </button>

              {/* Admin Portal Gateway */}
              <Link
                to={isAdminLoggedIn ? "/admin/dashboard" : "/admin/login"}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid var(--border)",
                  color: "var(--muted)",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.color = "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.color = "var(--muted)";
                }}
                className="desktop-nav"
              >
                <FaUserLock /> {isAdminLoggedIn ? "Admin Panel" : "Login"}
              </Link>

              {/* Main Consultation Link */}
              <Link
                to="/contact"
                style={{
                  background: "var(--accent)",
                  color: "#0a0a0a",
                  padding: scrolled ? "8px 20px" : "10px 24px",
                  borderRadius: "100px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  boxShadow: "0 4px 14px rgba(212,175,55,0.25)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.target.style.opacity = "1")}
                className="desktop-nav"
              >
                Book Consultation
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--fg)",
                  fontSize: "1.3rem",
                  display: "none",
                }}
                className="mobile-menu-btn"
                aria-label="Menu"
              >
                {menuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Overlay Menu */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "var(--bg)",
          zIndex: 90,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "2rem",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      >
        {navLinks.map((link, i) => (
          <Link
            key={link.to}
            to={link.to}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "2.2rem",
              fontWeight: 700,
              color:
                location.pathname === link.to ? "var(--accent)" : "var(--fg)",
              marginBottom: "1.2rem",
              transform: menuOpen ? "translateY(0)" : "translateY(20px)",
              opacity: menuOpen ? 1 : 0,
              transition: `all 0.4s ${i * 50}ms ease`,
            }}
          >
            {link.name}
          </Link>
        ))}

        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            transform: menuOpen ? "translateY(0)" : "translateY(20px)",
            opacity: menuOpen ? 1 : 0,
            transition: "all 0.4s 350ms ease",
          }}
        >
          <Link
            to="/contact"
            style={{
              background: "var(--accent)",
              color: "#0a0a0a",
              textAlign: "center",
              padding: "12px",
              borderRadius: "100px",
              fontSize: "0.95rem",
              fontWeight: 600,
            }}
          >
            Book Consultation
          </Link>

          <Link
            to={isAdminLoggedIn ? "/admin/dashboard" : "/admin/login"}
            style={{
              border: "1px solid var(--border)",
              color: "var(--fg)",
              textAlign: "center",
              padding: "12px",
              borderRadius: "100px",
              fontSize: "0.95rem",
              fontWeight: 500,
              background: "var(--card-bg)",
            }}
          >
            {isAdminLoggedIn ? "Admin Dashboard" : "Admin Login Portal"}
          </Link>
        </div>
      </div>

      {/* Global Search Component */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}

export default Navbar;
