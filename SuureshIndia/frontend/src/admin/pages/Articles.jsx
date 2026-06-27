import { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import { PageHeader, Button, Input, Textarea, Modal, StatusBadge, EmptyState } from "../components/AdminUI";
import ConfirmDialog from "../components/ConfirmDialog";
import { articlesAPI } from "../../services/api";

const emptyForm = { title: "", category: "", desc: "", content: "", author: "P. Suuresh & Associates", published: true };

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  function load() {
    setLoading(true);
    articlesAPI.getAll()
      .then(setArticles)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function openCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setModalOpen(true);
  }

  function openEdit(article) {
    setForm({
      title: article.title, category: article.category, desc: article.desc,
      content: article.content || "", author: article.author || "", published: article.published,
    });
    setEditingId(article._id);
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingId) await articlesAPI.update(editingId, form);
      else await articlesAPI.create(form);
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
      await articlesAPI.delete(deleteId);
      setDeleteId(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <AdminLayout>
      <PageHeader
        title="Articles & Journal"
        subtitle="Publish articles to the Journal page on your website"
        action={<Button onClick={openCreate}>+ New Article</Button>}
      />

      {error && <p style={{ color: "#e57373", marginBottom: "1rem" }}>{error}</p>}

      {loading ? (
        <p style={{ color: "var(--muted)" }}>Loading...</p>
      ) : articles.length === 0 ? (
        <EmptyState message="No articles yet. Click '+ New Article' to publish your first one." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {articles.map((a) => (
            <div key={a._id} style={{
              padding: "1.25rem 1.5rem", background: "var(--card-bg)", border: "1px solid var(--border)",
              borderRadius: "var(--radius)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem"
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.3rem" }}>
                  <span style={{ fontSize: "0.7rem", color: "var(--accent)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{a.category}</span>
                  <StatusBadge active={a.published} />
                </div>
                <h3 style={{ color: "var(--fg)", fontSize: "1rem", fontFamily: "var(--font-display)", marginBottom: "0.2rem" }}>{a.title}</h3>
                <p style={{ color: "var(--muted)", fontSize: "0.82rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.desc}</p>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                <Button variant="ghost" onClick={() => openEdit(a)}>Edit</Button>
                <Button variant="danger" onClick={() => setDeleteId(a._id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} title={editingId ? "Edit Article" : "New Article"} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit}>
          <Input label="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input label="Category (e.g. GST, Income Tax, Corporate Law)" required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <Textarea label="Short Description (shown on Journal page)" required value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} />
          <Textarea label="Full Content (optional, for article detail page)" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} style={{ minHeight: "150px" }} />
          <Input label="Author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem", color: "var(--fg)", fontSize: "0.875rem" }}>
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            Publish immediately (visible on website)
          </label>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : editingId ? "Update" : "Create"}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        message="Delete this article permanently? This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </AdminLayout>
  );
}
