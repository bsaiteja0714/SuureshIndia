import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageBanner from "../components/PageBanner";
import { articlesAPI, updatesAPI, calendarAPI, teamAPI } from "../services/api";
import {
  FaLinkedinIn,
  FaTwitter,
  FaFacebookF,
  FaEnvelope,
  FaPhone,
  FaSearch,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";

const tabStyle = (active) => ({
  padding: "0.45rem 1.1rem",
  borderRadius: "100px",
  fontSize: "0.82rem",
  fontWeight: active ? 600 : 400,
  border: "1px solid",
  borderColor: active ? "var(--accent)" : "var(--border)",
  background: active ? "var(--accent-dim)" : "transparent",
  color: active ? "var(--accent)" : "var(--muted)",
  cursor: "pointer",
  transition: "all 0.2s",
});

// ── Team ────────────────────────────────────────────────────────────────────
export function Team() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    teamAPI
      .getAll()
      .then((data) => {
        if (data.length) setMembers(data);
      })
      .catch(() => { });
  }, []);

  return (
    <>
      <Navbar />
      <PageBanner
        title="Our Team"
        subtitle="Meet the professionals behind your financial success."
      />
      <section style={{ padding: "5rem 0" }}>
        <div className="container">
          <div
            className="team-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1.75rem",
            }}
          >
            {members.map((m) => (
              <TeamProfileCard key={m.id || m._id} member={m} />
            ))}
          </div>
        </div>
      </section>
      <Footer />
      <style>{`@media(max-width:900px){.team-grid{grid-template-columns:1fr 1fr !important;}} @media(max-width:600px){.team-grid{grid-template-columns:1fr !important;}}`}</style>
    </>
  );
}

function TeamProfileCard({ member }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        overflow: "hidden",
        transition: "border-color 0.25s, box-shadow 0.25s",
        boxShadow: expanded ? "0 12px 40px rgba(212,175,55,0.12)" : "none",
        borderColor: expanded ? "rgba(212,175,55,0.35)" : "var(--border)",
      }}
    >
      {/* Photo */}
      {member.photo ? (
        <img
          src={member.photo}
          alt={member.name}
          style={{
            width: "100%",
            height: 200,
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: 200,
            background: "var(--accent-dim)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "3rem",
            color: "var(--accent)",
          }}
        >
          {member.name ? member.name[0].toUpperCase() : "?"}
        </div>
      )}

      <div style={{ padding: "1.5rem" }}>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.1rem",
            color: "var(--fg)",
            marginBottom: "4px",
          }}
        >
          {member.name}
        </h3>
        <div
          style={{
            color: "var(--accent)",
            fontSize: "0.8rem",
            fontWeight: 600,
            marginBottom: "0.4rem",
          }}
        >
          {member.qualification || member.position}
        </div>
        {member.expertise && (
          <div
            style={{
              color: "var(--muted)",
              fontSize: "0.8rem",
              marginBottom: "1rem",
            }}
          >
            {member.expertise}
          </div>
        )}

        {/* Contact links */}
        {(member.email || member.phone) && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.4rem",
              marginBottom: "1rem",
            }}
          >
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "var(--muted)",
                  fontSize: "0.8rem",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--accent)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--muted)")
                }
              >
                <FaEnvelope size={12} style={{ flexShrink: 0 }} />
                {member.email}
              </a>
            )}
            {member.phone && (
              <a
                href={`tel:${member.phone}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "var(--muted)",
                  fontSize: "0.8rem",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--accent)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--muted)")
                }
              >
                <FaPhone size={12} style={{ flexShrink: 0 }} />
                {member.phone}
              </a>
            )}
          </div>
        )}

        {/* Bio expandable */}
        {member.bio && (
          <div>
            <p
              style={{
                color: "var(--muted)",
                fontSize: "0.82rem",
                lineHeight: 1.6,
                maxHeight: expanded ? "200px" : "0",
                overflow: "hidden",
                transition: "max-height 0.4s ease",
                marginBottom: expanded ? "0.75rem" : 0,
              }}
            >
              {member.bio}
            </p>
            <button
              onClick={() => setExpanded(!expanded)}
              style={{
                background: "none",
                border: "none",
                color: "var(--accent)",
                fontSize: "0.78rem",
                fontWeight: 600,
                cursor: "pointer",
                padding: 0,
                marginBottom: "0.75rem",
              }}
            >
              {expanded ? "Show less ↑" : "Read bio ↓"}
            </button>
          </div>
        )}

        {/* Social links */}
        {(member.linkedin || member.twitter || member.facebook) && (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                style={socialIcon}
              >
                <FaLinkedinIn size={13} />
              </a>
            )}
            {member.twitter && (
              <a
                href={member.twitter}
                target="_blank"
                rel="noopener noreferrer"
                style={socialIcon}
              >
                <FaTwitter size={13} />
              </a>
            )}
            {member.facebook && (
              <a
                href={member.facebook}
                target="_blank"
                rel="noopener noreferrer"
                style={socialIcon}
              >
                <FaFacebookF size={13} />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const socialIcon = {
  width: 30,
  height: 30,
  borderRadius: "50%",
  border: "1px solid var(--border)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--muted)",
  transition: "all 0.2s",
};

// ── Journal ─────────────────────────────────────────────────────────────────
const ARTICLE_CATS = [
  "All",
  "Firm News",
  "Industry News",
  "Tax Updates",
  "Events",
  "Circulars",
];

export function Journal() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    articlesAPI
      .getPublished()
      .then((data) => {
        if (data && data.length > 0) setArticles(data);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const filtered = articles.filter((a) => {
    const matchCat =
      filter === "All" ||
      (a.category || "").toLowerCase() === filter.toLowerCase();
    const matchQ =
      search === "" ||
      (a.title + " " + a.desc).toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <>
      <Navbar />
      <PageBanner
        title="Articles & Journal"
        subtitle="Insights on taxation, compliance, and financial planning from our team."
      />
      <section style={{ padding: "5rem 0" }}>
        <div className="container">
          {/* Filter + Search */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              marginBottom: "2rem",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {ARTICLE_CATS.map((cat) => (
                <button
                  key={cat}
                  style={tabStyle(filter === cat)}
                  onClick={() => setFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "0.5rem 1rem",
              }}
            >
              <FaSearch size={13} style={{ color: "var(--muted)" }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles..."
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: "var(--fg)",
                  fontSize: "0.875rem",
                  width: 180,
                }}
              />
            </div>
          </div>

          {loading ? (
            <p style={{ color: "var(--muted)" }}>Loading articles...</p>
          ) : filtered.length === 0 ? (
            <p style={{ color: "var(--muted)" }}>No articles found.</p>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {filtered.map((a) => (
                <Link
                  key={a._id || a.id}
                  to={`/journal/${a._id}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <div
                    style={{
                      padding: "2rem",
                      background: "var(--card-bg)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius)",
                      display: "grid",
                      gridTemplateColumns: "auto 1fr auto",
                      gap: "2rem",
                      alignItems: "center",
                      transition: "border-color 0.2s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor =
                      "rgba(201,169,110,0.3)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor = "var(--border)")
                    }
                  >
                    <span
                      style={{
                        fontSize: "0.7rem",
                        letterSpacing: "0.1em",
                        color: "var(--accent)",
                        textTransform: "uppercase",
                        fontWeight: 500,
                        writingMode: "vertical-rl",
                        transform: "rotate(180deg)",
                      }}
                    >
                      {a.category || "Article"}
                    </span>

                    <div style={{ minWidth: 0, maxWidth: "100%" }}>
                      <h2
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "1.2rem",
                          fontWeight: 700,
                          color: "var(--fg)",
                          marginBottom: "0.4rem",
                          wordBreak: "break-word",
                        }}
                      >
                        {a.title || "Untitled article"}
                      </h2>

                      <p
                        style={{
                          color: "var(--muted)",
                          fontSize: "0.875rem",
                          lineHeight: 1.6,
                          wordBreak: "break-word",
                        }}
                      >
                        {a.desc || "Summary currently unavailable."}
                      </p>

                      {a.date && (
                        <div
                          style={{
                            color: "var(--accent)",
                            fontSize: "0.75rem",
                            fontWeight: 500,
                            marginTop: "0.5rem",
                          }}
                        >
                          {a.date}
                        </div>
                      )}
                    </div>

                    <div
                      style={{
                        background: "var(--accent)",
                        color: "#000",
                        padding: "10px 18px",
                        borderRadius: "999px",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Read More →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}

// ── Government Updates ───────────────────────────────────────────────────────
const UPDATE_CATS = [
  "All",
  "Circular",
  "Announcement",
  "Regulatory",
  "General",
];
const catBadge = {
  Circular: { bg: "rgba(59,130,246,0.15)", color: "#60a5fa" },
  Announcement: { bg: "rgba(212,175,55,0.15)", color: "#d4af37" },
  Regulatory: { bg: "rgba(34,197,94,0.15)", color: "#22c55e" },
  General: { bg: "rgba(148,163,184,0.15)", color: "#94a3b8" },
};

export function Updates() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    setLoading(true);
    updatesAPI
      .getPublished()
      .then((data) => {
        if (data && data.length > 0) setUpdates(data);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "All"
      ? updates
      : updates.filter((u) => (u.category || "General") === filter);

  return (
    <>
      <Navbar />
      <PageBanner
        title="Government Updates"
        subtitle="Stay informed about the latest regulatory changes and compliance requirements."
      />
      <section style={{ padding: "5rem 0" }}>
        <div className="container">
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              marginBottom: "2rem",
              alignItems: "center",
            }}
          >
            {UPDATE_CATS.map((cat) => (
              <button
                key={cat}
                style={tabStyle(filter === cat)}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
            <Link
              to="/downloads"
              style={{
                marginLeft: "auto",
                background: "var(--accent)",
                color: "#0a0a0a",
                padding: "0.75rem 1.25rem",
                borderRadius: "100px",
                fontWeight: 700,
                fontSize: "0.85rem",
                textDecoration: "none",
              }}
            >
              View Files
            </Link>
          </div>

          {loading ? (
            <p style={{ color: "var(--muted)" }}>Loading updates...</p>
          ) : filtered.length === 0 ? (
            <p style={{ color: "var(--muted)" }}>No updates posted yet.</p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {filtered.map((u) => {
                const cat = u.category || "General";
                const badge = catBadge[cat] || catBadge["General"];
                return (
                  <Link
                    key={u._id || u.id}
                    to={`/updates/${u._id || u.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div
                      style={{
                        padding: "1.5rem 2rem",
                        background: "var(--card-bg)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "1rem",
                        transition: "border-color 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.borderColor =
                          "rgba(201,169,110,0.3)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.borderColor = "var(--border)")
                      }
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                          flex: "1 1 250px",
                        }}
                      >
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "var(--accent)",
                            display: "inline-block",
                            flexShrink: 0,
                          }}
                        />
                        <div>
                          <h2
                            style={{
                              fontFamily: "var(--font-display)",
                              fontSize: "1.05rem",
                              fontWeight: 700,
                              color: "var(--fg)",
                            }}
                          >
                            {u.title}
                          </h2>
                          <span
                            style={{
                              fontSize: "0.68rem",
                              fontWeight: 600,
                              padding: "2px 8px",
                              borderRadius: "100px",
                              background: badge.bg,
                              color: badge.color,
                              marginTop: "4px",
                              display: "inline-block",
                            }}
                          >
                            {cat}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                        <span
                          style={{
                            color: "var(--accent)",
                            fontSize: "0.8rem",
                            fontWeight: 500,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {u.date ||
                            (u.createdAt
                              ? new Date(u.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })
                              : "Date unavailable")}
                        </span>
                        <div
                          style={{
                            background: "var(--accent)",
                            color: "#000",
                            padding: "8px 16px",
                            borderRadius: "999px",
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Read More →
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}

// ── Compliance Calendar ──────────────────────────────────────────────────────
const CAL_CATS = ["All", "Income Tax", "GST", "TDS", "Corporate"];
const VIEWS = ["all", "upcoming", "overdue"];

function isOverdue(dueDate) {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
}

function formatDate(d) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return d;
  }
}

export function ComplianceCalendar() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [view, setView] = useState("all");

  useEffect(() => {
    calendarAPI
      .getAll()
      .then((data) => {
        if (data.length) setRows(data);
      })
      .catch(() => { });
  }, []);

  const filtered = rows.filter((row) => {
    const matchSearch =
      search === "" ||
      row.compliance.toLowerCase().includes(search.toLowerCase());
    const matchCat =
      catFilter === "All" || (row.category || "General") === catFilter;
    const overdue = isOverdue(row.dueDate);
    const matchView =
      view === "all" || (view === "overdue" ? overdue : !overdue);
    return matchSearch && matchCat && matchView;
  });

  const overdueCount = rows.filter((r) => isOverdue(r.dueDate)).length;
  const upcomingCount = rows.filter((r) => !isOverdue(r.dueDate)).length;

  return (
    <>
      <Navbar />
      <PageBanner
        title="Compliance Calendar"
        subtitle="Never miss a statutory deadline. Key due dates for your business."
      />
      <section style={{ padding: "5rem 0" }}>
        <div className="container">
          {/* Summary cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            {[
              {
                label: "Total Deadlines",
                count: rows.length,
                icon: FaCalendarAlt,
                color: "var(--accent)",
              },
              {
                label: "Upcoming",
                count: upcomingCount,
                icon: FaCheckCircle,
                color: "#22c55e",
              },
              {
                label: "Overdue",
                count: overdueCount,
                icon: FaExclamationTriangle,
                color: "#e57373",
              },
            ].map(({ label, count, icon: Icon, color }) => (
              <div
                key={label}
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  padding: "1.25rem 1.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <Icon size={22} style={{ color }} />
                <div>
                  <div
                    style={{
                      fontSize: "1.6rem",
                      fontWeight: 700,
                      color: "var(--fg)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {count}
                  </div>
                  <div style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
                    {label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              marginBottom: "1.5rem",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* View tabs */}
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {[
                { key: "all", label: "All" },
                { key: "upcoming", label: "Upcoming" },
                { key: "overdue", label: "Overdue" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  style={tabStyle(view === key)}
                  onClick={() => setView(key)}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Category + Search */}
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <select
                value={catFilter}
                onChange={(e) => setCatFilter(e.target.value)}
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--fg)",
                  padding: "0.45rem 0.9rem",
                  fontSize: "0.82rem",
                }}
              >
                {CAL_CATS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "0.45rem 0.9rem",
                }}
              >
                <FaSearch size={12} style={{ color: "var(--muted)" }} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  style={{
                    background: "none",
                    border: "none",
                    outline: "none",
                    color: "var(--fg)",
                    fontSize: "0.82rem",
                    width: 140,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div
            style={{
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    background: "var(--card-bg)",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  {["Compliance", "Category", "Due Date", "Status"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "1rem 1.5rem",
                        textAlign: "left",
                        fontSize: "0.72rem",
                        letterSpacing: "0.1em",
                        color: "var(--accent)",
                        textTransform: "uppercase",
                        fontWeight: 500,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      style={{
                        padding: "2rem",
                        textAlign: "center",
                        color: "var(--muted)",
                      }}
                    >
                      No entries match your filter.
                    </td>
                  </tr>
                ) : (
                  filtered.map((row, i) => {
                    const overdue = isOverdue(row.dueDate);
                    return (
                      <tr
                        key={row._id || i}
                        style={{
                          borderBottom:
                            i < filtered.length - 1
                              ? "1px solid var(--border)"
                              : "none",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "var(--card-bg)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <td
                          style={{
                            padding: "1rem 1.5rem",
                            color: "var(--fg)",
                            fontSize: "0.9rem",
                            fontWeight: 500,
                          }}
                        >
                          {row.compliance}
                        </td>
                        <td style={{ padding: "1rem 1.5rem" }}>
                          <span
                            style={{
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              padding: "2px 8px",
                              borderRadius: "100px",
                              background: "var(--accent-dim)",
                              color: "var(--accent)",
                            }}
                          >
                            {row.category || "General"}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "1rem 1.5rem",
                            color: overdue ? "#e57373" : "var(--accent)",
                            fontSize: "0.85rem",
                            fontWeight: 500,
                          }}
                        >
                          {formatDate(row.dueDate)}
                        </td>
                        <td style={{ padding: "1rem 1.5rem" }}>
                          {overdue ? (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                fontSize: "0.72rem",
                                fontWeight: 600,
                                padding: "3px 10px",
                                borderRadius: "100px",
                                background: "rgba(229,115,115,0.15)",
                                color: "#e57373",
                              }}
                            >
                              <FaExclamationTriangle size={10} /> Overdue
                            </span>
                          ) : (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                fontSize: "0.72rem",
                                fontWeight: 600,
                                padding: "3px 10px",
                                borderRadius: "100px",
                                background: "rgba(34,197,94,0.15)",
                                color: "#22c55e",
                              }}
                            >
                              <FaCheckCircle size={10} /> Upcoming
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <p
            style={{
              color: "var(--muted)",
              fontSize: "0.78rem",
              marginTop: "1rem",
              textAlign: "center",
            }}
          >
            * Deadlines are indicative. Always verify with the official
            government portal.
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Team;


