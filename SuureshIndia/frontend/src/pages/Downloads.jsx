import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageBanner from "../components/PageBanner";
import { filesAPI } from "../services/api";
import { FaFilePdf, FaDownload, FaFilter } from "react-icons/fa";

export default function Downloads() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    filesAPI.getAll()
      .then(setFiles)
      .catch((err) => console.error("Error fetching downloads:", err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["All", "Tax Guide", "Circular", "Compliance Document", "Other"];

  const filteredFiles = filter === "All" 
    ? files 
    : files.filter(f => f.category === filter);

  return (
    <>
      <Navbar />
      <PageBanner title="Tax Guides & Circulars" subtitle="Download statutory compliance guides, circulars, and tax resources." />
      
      <section style={{ padding: "5rem 0", background: "var(--bg)", color: "var(--fg)", minHeight: "60vh" }}>
        <div className="container">
          
          {/* Category Tabs */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            justifyContent: "center",
            marginBottom: "3rem",
            borderBottom: "1px solid var(--border)",
            paddingBottom: "1.5rem"
          }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                style={{
                  background: filter === cat ? "var(--accent)" : "var(--card-bg)",
                  color: filter === cat ? "#000000" : "var(--fg)",
                  border: `1px solid ${filter === cat ? "var(--accent)" : "var(--border)"}`,
                  padding: "0.5rem 1.25rem",
                  borderRadius: "100px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  transition: "all 0.2s"
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", color: "var(--muted)", padding: "2rem" }}>Loading documents...</div>
          ) : filteredFiles.length === 0 ? (
            <div style={{ textAlign: "center", color: "var(--muted)", padding: "4rem 0" }}>
              <p style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>No documents found</p>
              <p style={{ fontSize: "0.875rem" }}>There are no publications uploaded in this category yet.</p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.5rem"
            }}>
              {filteredFiles.map((doc) => (
                <div
                  key={doc._id}
                  style={{
                    background: "var(--card-bg)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "1.5rem",
                    transition: "transform 0.2s, border-color 0.2s"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "var(--accent)";
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div>
                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
                      <FaFilePdf size={28} style={{ color: "#ef4444", flexShrink: 0 }} />
                      <span style={{
                        fontSize: "0.7rem",
                        textTransform: "uppercase",
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                        color: "var(--accent)",
                        background: "var(--accent-dim)",
                        padding: "2px 8px",
                        borderRadius: "4px"
                      }}>
                        {doc.category}
                      </span>
                    </div>

                    <h3 style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      color: "var(--fg)",
                      marginBottom: "0.5rem",
                      lineHeight: "1.4"
                    }}>
                      {doc.title}
                    </h3>

                    {doc.description && (
                      <p style={{
                        color: "var(--muted)",
                        fontSize: "0.825rem",
                        lineHeight: "1.5",
                        marginBottom: "1rem"
                      }}>
                        {doc.description}
                      </p>
                    )}
                  </div>

                  {/* Actions footer */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderTop: "1px solid var(--border)",
                    paddingTop: "1rem"
                  }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                      Published: {new Date(doc.publishDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: "var(--accent)"
                      }}
                    >
                      <FaDownload size={12} /> Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
