import { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import { PageHeader, Button, Input, Textarea, Modal, EmptyState } from "../components/AdminUI";
import ConfirmDialog from "../components/ConfirmDialog";
import { teamAPI } from "../../services/api";

const emptyForm = { name: "", qualification: "", expertise: "", bio: "", photo: "", order: 0 };

export default function TeamAdmin() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  function load() {
    setLoading(true);
    teamAPI.getAll().then(setMembers).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }
  useEffect(load, []);

  function openCreate() { setForm(emptyForm); setEditingId(null); setModalOpen(true); }
  function openEdit(m) {
    setForm({ name: m.name, qualification: m.qualification, expertise: m.expertise, bio: m.bio || "", photo: m.photo || "", order: m.order || 0 });
    setEditingId(m._id); setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      if (editingId) await teamAPI.update(editingId, form);
      else await teamAPI.create(form);
      setModalOpen(false); load();
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  }

  async function handleDelete() {
    try { await teamAPI.delete(deleteId); setDeleteId(null); load(); }
    catch (err) { setError(err.message); }
  }

  return (
    <AdminLayout>
      <PageHeader
        title="Team"
        subtitle="Manage profiles shown on the Team page"
        action={<Button onClick={openCreate}>+ Add Member</Button>}
      />

      {error && <p style={{ color: "#e57373", marginBottom: "1rem" }}>{error}</p>}

      {loading ? (
        <p style={{ color: "var(--muted)" }}>Loading...</p>
      ) : members.length === 0 ? (
        <EmptyState message="No team members added yet." />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
          {members.map((m) => (
            <div key={m._id} style={{
              padding: "1.25rem", background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "var(--radius)"
            }}>
              {m.photo ? (
                <img src={m.photo} alt={m.name} style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "8px", marginBottom: "0.75rem" }} />
              ) : (
                <div style={{ width: "100%", height: "140px", borderRadius: "8px", marginBottom: "0.75rem", background: "var(--accent-dim)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", fontSize: "0.75rem" }}>No photo</div>
              )}
              <h3 style={{ color: "var(--fg)", fontSize: "1rem", fontFamily: "var(--font-display)" }}>{m.name}</h3>
              <p style={{ color: "var(--accent)", fontSize: "0.8rem", margin: "0.2rem 0" }}>{m.qualification}</p>
              <p style={{ color: "var(--muted)", fontSize: "0.82rem", marginBottom: "1rem" }}>{m.expertise}</p>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Button variant="ghost" onClick={() => openEdit(m)} style={{ flex: 1 }}>Edit</Button>
                <Button variant="danger" onClick={() => setDeleteId(m._id)} style={{ flex: 1 }}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} title={editingId ? "Edit Team Member" : "Add Team Member"} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit}>
          <Input label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Qualification (e.g. CA, FCA, LLB)" required value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} />
          <Input label="Expertise / Role" required value={form.expertise} onChange={(e) => setForm({ ...form, expertise: e.target.value })} />
          <Textarea label="Short Bio (optional)" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          <Input label="Photo URL (optional, link to a hosted image)" value={form.photo} onChange={(e) => setForm({ ...form, photo: e.target.value })} placeholder="https://..." />
          <Input label="Display Order (lower shows first)" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : editingId ? "Update" : "Create"}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteId} message="Remove this team member?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </AdminLayout>
  );
}
