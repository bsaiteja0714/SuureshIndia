import { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import {
  PageHeader,
  Button,
  Input,
  Textarea,
  Select,
  Modal,
  StatusBadge,
  EmptyState,
} from "../components/AdminUI";
import ConfirmDialog from "../components/ConfirmDialog";
import { updatesAPI } from "../../services/api";

const emptyForm = {
  title: "",
  category: "GST",
  summary: "",
  link: "",
  published: true,
  pinned: false,
};
const categories = ["GST", "Income Tax", "Corporate", "SEBI", "Other"];

export default function UpdatesAdmin() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [customCategory, setCustomCategory] = useState("");
  function load() {
    setLoading(true);
    updatesAPI
      .getAll()
      .then(setUpdates)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }
  useEffect(load, []);

  function openCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setModalOpen(true);
  }

  function openEdit(u) {
    setForm({
      title: u.title,
      category: u.category || "GST",
      summary: u.summary || "",
      link: u.link || "",
      published: u.published !== false,
      pinned: u.pinned || false,
    });
    setEditingId(u._id);
    setModalOpen(true);
  }

  const filteredUpdates = updates
    .filter((u) => {
      if (filterType === "All") return true;
      if (filterType === "Pinned") return !!u.pinned;
      if (filterType === "Archived") return !!u.archived;
      if (filterType === "Unpublished") return !u.published;
      return true;
    })
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    if (form.category === "Other" && !customCategory.trim()) {
      setError("Please enter a custom category.");
      return;
    }
    const payload = {
      ...form,
      category:
        form.category === "Other" ? customCategory.trim() : form.category,
    };

    try {
      if (editingId) {
        await updatesAPI.update(editingId, payload);
      } else {
        await updatesAPI.create(payload);
      }

      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await updatesAPI.delete(deleteId);
      setDeleteId(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleField(id, field, current) {
    try {
      await updatesAPI.update(id, { [field]: !current });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  const filterOptions = ["All", "Pinned", "Archived", "Unpublished"];

  // Stats
  const pinnedCount = updates.filter((u) => u.pinned).length;
  const publishedCount = updates.filter((u) => u.published !== false).length;
  const archivedCount = updates.filter((u) => u.archived).length;

  return (
    <AdminLayout>
      <PageHeader
        title="Government Updates"
        subtitle="Post, pin, archive, and manage regulatory updates"
        action={<Button onClick={openCreate}>+ New Update</Button>}
      />

      {/* Stats Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {[
          { label: "Total", count: updates.length, color: "var(--accent)" },
          { label: "Published", count: publishedCount, color: "#22c55e" },
          { label: "Pinned", count: pinnedCount, color: "#f59e0b" },
          { label: "Archived", count: archivedCount, color: "#94a3b8" },
        ].map(({ label, count, color }) => (
          <div
            key={label}
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              padding: "1rem 1.25rem",
            }}
          >
            <div
              style={{
                fontSize: "1.6rem",
                fontWeight: 700,
                color,
                fontFamily: "var(--font-display)",
              }}
            >
              {count}
            </div>
            <div
              style={{
                color: "var(--muted)",
                fontSize: "0.8rem",
                marginTop: "2px",
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p style={{ color: "#e57373", marginBottom: "1rem" }}>{error}</p>
      )}

      {/* Filter Tabs */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginBottom: "1.5rem",
        }}
      >
        {filterOptions.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setFilterType(type)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "999px",
              border: "1px solid var(--border)",
              background:
                filterType === type ? "var(--accent)" : "var(--card-bg)",
              color: filterType === type ? "#0a0a0a" : "var(--muted)",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.82rem",
              transition: "all 0.2s",
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: "var(--muted)" }}>Loading...</p>
      ) : filteredUpdates.length === 0 ? (
        <EmptyState message="No updates match this filter." />
      ) : (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          {filteredUpdates.map((u) => (
            <div
              key={u._id}
              style={{
                padding: "1.1rem 1.5rem",
                background: "var(--card-bg)",
                border: `1px solid ${u.pinned ? "rgba(245,158,11,0.4)" : "var(--border)"}`,
                borderRadius: "var(--radius)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "1rem",
                opacity: u.archived ? 0.6 : 1,
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    marginBottom: "0.3rem",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--accent)",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    {u.category}
                  </span>
                  <StatusBadge active={u.published !== false} />
                  {u.pinned && (
                    <span
                      style={{
                        background: "rgba(245,158,11,0.15)",
                        color: "#f59e0b",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "999px",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                      }}
                    >
                      📌 Pinned
                    </span>
                  )}
                  {u.archived && (
                    <span
                      style={{
                        background: "rgba(148,163,184,0.15)",
                        color: "#94a3b8",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "999px",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                      }}
                    >
                      🗄 Archived
                    </span>
                  )}
                  <span
                    style={{
                      background:
                        u.adminCreated === false
                          ? "rgba(34,197,94,0.16)"
                          : "rgba(59,130,246,0.16)",
                      color: u.adminCreated === false ? "#16a34a" : "#2563eb",
                      padding: "0.25rem 0.6rem",
                      borderRadius: "999px",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                    }}
                  >
                    {u.adminCreated === false ? "Live" : "Admin"}
                  </span>
                  <span style={{ color: "var(--muted)", fontSize: "0.75rem" }}>
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString()
                      : ""}
                  </span>
                </div>
                <h3
                  style={{
                    color: "var(--fg)",
                    fontSize: "0.95rem",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {u.title}
                </h3>
                {u.summary && (
                  <p
                    style={{
                      color: "var(--muted)",
                      fontSize: "0.8rem",
                      marginTop: "0.2rem",
                      lineHeight: 1.5,
                    }}
                  >
                    {u.summary.slice(0, 120)}
                    {u.summary.length > 120 ? "..." : ""}
                  </p>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "0.4rem",
                  flexShrink: 0,
                  flexWrap: "wrap",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  variant="ghost"
                  onClick={() => toggleField(u._id, "pinned", u.pinned)}
                  title={u.pinned ? "Unpin" : "Pin to top"}
                >
                  {u.pinned ? "📌 Unpin" : "📌 Pin"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() =>
                    toggleField(u._id, "published", u.published !== false)
                  }
                >
                  {u.published !== false ? "Unpublish" : "Publish"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => toggleField(u._id, "archived", u.archived)}
                >
                  {u.archived ? "Unarchive" : "Archive"}
                </Button>
                <Button variant="ghost" onClick={() => openEdit(u)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => setDeleteId(u._id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        title={editingId ? "Edit Update" : "New Update"}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <Select
            label="Category"
            required
            value={form.category}
            onChange={(e) => {
              const value = e.target.value;
              setForm({ ...form, category: value });

              if (value !== "Other") {
                setCustomCategory("");
              }
            }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          {form.category === "Other" && (
            <Input
              label="Custom Category"
              placeholder="Enter category name"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              required
            />
          )}
          <Textarea
            label="Summary / Description"
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
          />
          <Input
            label="Reference Link (optional)"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
          />
          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              marginBottom: "1.5rem",
              flexWrap: "wrap",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "var(--fg)",
                fontSize: "0.875rem",
              }}
            >
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) =>
                  setForm({ ...form, published: e.target.checked })
                }
              />
              Published
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "var(--fg)",
                fontSize: "0.875rem",
              }}
            >
              <input
                type="checkbox"
                checked={form.pinned}
                onChange={(e) => setForm({ ...form, pinned: e.target.checked })}
              />
              Pin to top
            </label>
          </div>
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              justifyContent: "flex-end",
            }}
          >
            <Button
              type="button"
              variant="ghost"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        message="Delete this update permanently?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </AdminLayout>
  );
}
