import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { searchAPI } from "../services/api";
import { FaSearch, FaTimes, FaNewspaper, FaConciergeBell, FaBullhorn, FaCalendarAlt, FaUser } from "react-icons/fa";

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setResults([]);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Search query effect
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const data = await searchAPI.query(query);
        setResults(data);
      } catch (err) {
        console.error("Search error:", err.message);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounce);
  }, [query]);

  if (!isOpen) return null;

  function highlightText(text, highlight) {
    if (!highlight || !text) return text;
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={i} style={{ background: "var(--accent-dim)", color: "var(--accent)", padding: "0 2px", borderRadius: "4px" }}>
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  }

  function getIcon(type) {
    switch (type) {
      case "article":
        return <FaNewspaper style={{ color: "var(--accent)" }} />;
      case "service":
        return <FaConciergeBell style={{ color: "var(--accent)" }} />;
      case "governmentUpdate":
        return <FaBullhorn style={{ color: "var(--accent)" }} />;
      case "complianceDeadline":
        return <FaCalendarAlt style={{ color: "var(--accent)" }} />;
      case "teamMember":
        return <FaUser style={{ color: "var(--accent)" }} />;
      default:
        return <FaSearch />;
    }
  }

  function getLink(type) {
    switch (type) {
      case "article":
        return "/journal";
      case "service":
        return "/services";
      case "governmentUpdate":
        return "/updates";
      case "complianceDeadline":
        return "/calendar";
      case "teamMember":
        return "/team";
      default:
        return "/";
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(3, 7, 18, 0.75)",
        backdropFilter: "blur(8px)",
        display: "flex",
        justifyContent: "center",
        paddingTop: "10vh",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "600px",
          height: "fit-content",
          maxHeight: "75vh",
          boxShadow: "var(--shadow)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Search header */}
        <div style={{ display: "flex", alignItems: "center", padding: "1rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
          <FaSearch style={{ color: "var(--muted)", marginRight: "1rem" }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search articles, services, updates, calendar..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              color: "var(--fg)",
              fontSize: "1rem",
              fontFamily: "var(--font-body)",
            }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              style={{ background: "none", border: "none", color: "var(--muted)", marginRight: "1rem" }}
            >
              Clear
            </button>
          )}
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--muted)" }}>
            <FaTimes size={18} />
          </button>
        </div>

        {/* Results Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1rem 0", maxHeight: "50vh" }}>
          {loading && (
            <div style={{ padding: "1.5rem", textAlign: "center", color: "var(--muted)" }}>Searching...</div>
          )}

          {!loading && !query.trim() && (
            <div style={{ padding: "2rem", textAlign: "center", color: "var(--muted)", fontSize: "0.85rem" }}>
              Type a word to search across the entire platform
            </div>
          )}

          {!loading && query.trim() && results.length === 0 && (
            <div style={{ padding: "2rem", textAlign: "center", color: "var(--muted)", fontSize: "0.85rem" }}>
              No results matching "{query}"
            </div>
          )}

          {!loading && results.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {results.map((item) => (
                <div
                  key={item._id}
                  onClick={() => {
                    navigate(getLink(item._type));
                    onClose();
                  }}
                  style={{
                    padding: "0.75rem 1.5rem",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1rem",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--border)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{ marginTop: "3px" }}>{getIcon(item._type)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "10px" }}>
                      <strong style={{ fontSize: "0.9rem", color: "var(--fg)" }}>
                        {highlightText(item.title, query)}
                      </strong>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          textTransform: "uppercase",
                          color: "var(--accent)",
                          background: "var(--accent-dim)",
                          padding: "1px 6px",
                          borderRadius: "4px",
                          fontWeight: 500,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.subtitle || item._type}
                      </span>
                    </div>
                    {item.description && (
                      <p
                        style={{
                          color: "var(--muted)",
                          fontSize: "0.8rem",
                          marginTop: "0.2rem",
                          lineHeight: 1.4,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {highlightText(item.description, query)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
