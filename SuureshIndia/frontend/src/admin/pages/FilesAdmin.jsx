import { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import { PageHeader, Button, Input, EmptyState } from "../components/AdminUI";
import ConfirmDialog from "../components/ConfirmDialog";
import { filesAPI } from "../../services/api";
import { FaFilePdf, FaDownload, FaTrash, FaCloudUploadAlt } from "react-icons/fa";

const CATEGORIES = [
  "PDF Document",
  "Compliance Document",
  "Circular",
  "Tax Guide",
  "Resource",
  "Announcement",
  "Other",
];

const categoryColor = {
  "Circular":             { bg: "rgba(59,130,246,0.15)", color: "#60a5fa" },
  "Tax Guide":            { bg: "rgba(212,175,55,0.15)", color: "#d4af37" },
  "Compliance Document":  { bg: "rgba(34,197,94,0.15)",  color: "#22c55e" },
  "PDF Document":         { bg: "rgba(168,85,247,0.15)", color: "#c084fc" },
  "Resource":             { bg: "rgba(251,146,60,0.15)", color: "#fb923c" },
  "Announcement":         { bg: "rgba(244,63,94,0.15)",  color: "#fb7185" },
  "Other":                { bg: "rgba(148,163,184,0.15)", color: "#94a3b8" },
};

const emptyForm = { title: "", category: "PDF Document", description: "", file: null };

export default function FilesAdmin() {
  const [files, setFiles]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [form, setForm]         = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [deleteId, setDeleteId] = useState(null);
  const [filterCat, setFilterCat] = useState("All");

  function load() {
    setLoading(true);
    filesAPI.getAll()
      .then(setFiles)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function handleUpload(e) {
    e.preventDefault();
    if (!form.file) { setError("Please select a PDF file to upload."); return; }
    if (!form.title.trim()) { setError("Please enter a document title."); return; }

    setUploading(true); setError(""); setProgress(10);

    try {
      const fd = new FormData();
      fd.append("file",        form.file);
      fd.append("title",       form.title.trim());
      fd.append("category",    form.category);
      fd.append("description", form.description.trim());

      // Simulate progress
      const progTimer = setInterval(() => {
        setProgress((p) => Math.min(p + 15, 85));
      }, 300);

      await filesAPI.upload(fd);
      clearInterval(progTimer);
      setProgress(100);

      setTimeout(() => { setProgress(0); setUploading(false); }, 800);
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.message);
      setUploading(false);
      setProgress(0);
    }
  }

  async function handleDelete() {
    try {
      await filesAPI.delete(deleteId);
      setDeleteId(null);
      load();
    } catch (err) { setError(err.message); }
  }

  const categories = ["All", ...CATEGORIES];
  const filtered = filterCat === "All"
    ? files
    : files.filter((f) => f.category === filterCat);

  return (
    <AdminLayout>
      <PageHeader
        title="Downloads & Files"
        subtitle="Upload and manage downloadable documents for the public"
      />

      {error && <p style={{ color: "#e57373", marginBottom: "1rem" }}>{error}</p>}

      {/* Upload Form */}
      <div style={{
        background: "var(--card-bg)", border: "1px solid var(--border)",
        borderRadius: "var(--radius)", padding: "1.75rem", marginBottom: "2rem",
      }}>
        <h3 style={{ color: "var(--fg)", fontSize: "1rem", fontFamily: "var(--font-display)", marginBottom: "1.25rem" }}>
          <FaCloudUploadAlt style={{ marginRight: "0.5rem", color: "var(--accent)" }} />
          Upload New Document
        </h3>

        <form onSubmit={handleUpload}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <Input label="Document Title *" required value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. GST Circular No. 234/2026" />

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.4rem" }}>
                Category
              </label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={{ width: "100%", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--fg)", padding: "0.7rem 0.9rem", fontSize: "0.875rem" }}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <Input label="Description (optional)" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Brief description of the document" />

          {/* File picker */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.4rem" }}>
              PDF File *
            </label>
            <div style={{
              border: "2px dashed var(--border)", borderRadius: "10px",
              padding: "1.5rem", textAlign: "center",
              background: "var(--bg)", cursor: "pointer",
              transition: "border-color 0.2s",
            }}
              onClick={() => document.getElementById("file-upload").click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files[0];
                if (f) setForm({ ...form, file: f });
              }}
            >
              <input id="file-upload" type="file" accept=".pdf"
                style={{ display: "none" }}
                onChange={(e) => setForm({ ...form, file: e.target.files[0] })} />
              <FaFilePdf size={28} style={{ color: form.file ? "var(--accent)" : "var(--muted)", marginBottom: "0.5rem" }} />
              <div style={{ color: form.file ? "var(--fg)" : "var(--muted)", fontSize: "0.875rem" }}>
                {form.file ? form.file.name : "Click to select or drag & drop a PDF"}
              </div>
              {form.file && (
                <div style={{ color: "var(--muted)", fontSize: "0.75rem", marginTop: "4px" }}>
                  {(form.file.size / 1024 / 1024).toFixed(2)} MB
                </div>
              )}
            </div>
          </div>

          {/* Progress bar */}
          {progress > 0 && (
            <div style={{ background: "var(--border)", borderRadius: "100px", height: 6, marginBottom: "1rem", overflow: "hidden" }}>
              <div style={{ height: "100%", background: "var(--accent)", borderRadius: "100px", width: `${progress}%`, transition: "width 0.3s" }} />
            </div>
          )}

          <Button type="submit" disabled={uploading}>
            {uploading ? `Uploading... ${progress}%` : "Upload Document"}
          </Button>
        </form>
      </div>

      {/* Category filter */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {categories.map((cat) => (
          <button key={cat}
            onClick={() => setFilterCat(cat)}
            style={{
              padding: "0.4rem 1rem", borderRadius: "100px", fontSize: "0.78rem",
              border: "1px solid", cursor: "pointer", transition: "all 0.2s",
              borderColor: filterCat === cat ? "var(--accent)" : "var(--border)",
              background: filterCat === cat ? "var(--accent-dim)" : "transparent",
              color: filterCat === cat ? "var(--accent)" : "var(--muted)",
            }}>
            {cat}
          </button>
        ))}
      </div>

      {/* File list */}
      {loading ? (
        <p style={{ color: "var(--muted)" }}>Loading...</p>
      ) : filtered.length === 0 ? (
        <EmptyState message="No documents uploaded yet." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {filtered.map((file) => {
            const col = categoryColor[file.category] || categoryColor["Other"];
            return (
              <div key={file._id} style={{
                background: "var(--card-bg)", border: "1px solid var(--border)",
                borderRadius: "var(--radius)", padding: "1.25rem 1.5rem",
                display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: 0 }}>
                  <FaFilePdf size={22} style={{ color: "#e57373", flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: "var(--fg)", fontWeight: 600, fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {file.title}
                    </div>
                    {file.description && (
                      <div style={{ color: "var(--muted)", fontSize: "0.78rem", marginTop: "2px" }}>{file.description}</div>
                    )}
                    <div style={{ marginTop: "4px" }}>
                      <span style={{ fontSize: "0.68rem", fontWeight: 600, padding: "2px 8px", borderRadius: "100px", background: col.bg, color: col.color }}>
                        {file.category}
                      </span>
                      {file.publishDate && (
                        <span style={{ color: "var(--muted)", fontSize: "0.75rem", marginLeft: "0.6rem" }}>{file.publishDate}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                  {file.fileUrl && (
                    <a href={file.fileUrl} target="_blank" rel="noopener noreferrer"
                      style={{
                        display: "inline-flex", alignItems: "center", gap: "0.35rem",
                        background: "var(--accent-dim)", border: "1px solid rgba(212,175,55,0.3)",
                        color: "var(--accent)", borderRadius: "8px", padding: "0.45rem 0.85rem",
                        fontSize: "0.78rem", fontWeight: 600,
                      }}>
                      <FaDownload size={11} /> Preview
                    </a>
                  )}
                  <button onClick={() => setDeleteId(file._id)} style={{
                    display: "inline-flex", alignItems: "center", gap: "0.35rem",
                    background: "rgba(229,115,115,0.1)", border: "1px solid rgba(229,115,115,0.3)",
                    color: "#e57373", borderRadius: "8px", padding: "0.45rem 0.85rem",
                    fontSize: "0.78rem", fontWeight: 600, cursor: "pointer",
                  }}>
                    <FaTrash size={11} /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        message="Permanently delete this document? This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </AdminLayout>
  );
}
