import { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import { PageHeader, Button, Input, Modal, EmptyState } from "../components/AdminUI";
import ConfirmDialog from "../components/ConfirmDialog";
import { calendarAPI } from "../../services/api";

const emptyForm = { compliance: "", dueDate: "", category: "General", notes: "" };

export default function CalendarAdmin() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  function load() {
    setLoading(true);
    calendarAPI.getAll().then(setEntries).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }
  useEffect(load, []);

  function openCreate() { setForm(emptyForm); setEditingId(null); setModalOpen(true); }
  function openEdit(entry) {
    setForm({ compliance: entry.compliance, dueDate: entry.dueDate, category: entry.category || "General", notes: entry.notes || "" });
    setEditingId(entry._id); setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      if (editingId) await calendarAPI.update(editingId, form);
      else await calendarAPI.create(form);
      setModalOpen(false); load();
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  }

  async function handleDelete() {
    try { await calendarAPI.delete(deleteId); setDeleteId(null); load(); }
    catch (err) { setError(err.message); }
  }

  return (
    <AdminLayout>
      <PageHeader
        title="Compliance Calendar"
        subtitle="Manage statutory due dates shown on the website"
        action={<Button onClick={openCreate}>+ New Entry</Button>}
      />

      {error && <p style={{ color: "#e57373", marginBottom: "1rem" }}>{error}</p>}

      {loading ? (
        <p style={{ color: "var(--muted)" }}>Loading...</p>
      ) : entries.length === 0 ? (
        <EmptyState message="No compliance entries yet." />
      ) : (
        <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--card-bg)", borderBottom: "1px solid var(--border)" }}>
                <th style={{ textAlign: "left", padding: "0.85rem 1.25rem", fontSize: "0.75rem", color: "var(--accent)", textTransform: "uppercase" }}>Compliance</th>
                <th style={{ textAlign: "left", padding: "0.85rem 1.25rem", fontSize: "0.75rem", color: "var(--accent)", textTransform: "uppercase" }}>Due Date</th>
                <th style={{ textAlign: "left", padding: "0.85rem 1.25rem", fontSize: "0.75rem", color: "var(--accent)", textTransform: "uppercase" }}>Category</th>
                <th style={{ padding: "0.85rem 1.25rem" }}></th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <tr key={entry._id} style={{ borderBottom: i < entries.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <td style={{ padding: "0.85rem 1.25rem", color: "var(--fg)", fontSize: "0.875rem" }}>{entry.compliance}</td>
                  <td style={{ padding: "0.85rem 1.25rem", color: "var(--accent)", fontSize: "0.85rem" }}>{entry.dueDate}</td>
                  <td style={{ padding: "0.85rem 1.25rem", color: "var(--muted)", fontSize: "0.85rem" }}>{entry.category}</td>
                  <td style={{ padding: "0.85rem 1.25rem", textAlign: "right", whiteSpace: "nowrap" }}>
                    <Button variant="ghost" onClick={() => openEdit(entry)} style={{ marginRight: "0.5rem", padding: "0.35rem 0.9rem" }}>Edit</Button>
                    <Button variant="danger" onClick={() => setDeleteId(entry._id)} style={{ padding: "0.35rem 0.9rem" }}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} title={editingId ? "Edit Entry" : "New Compliance Entry"} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit}>
          <Input label="Compliance Name (e.g. GST Return GSTR-3B)" required value={form.compliance} onChange={(e) => setForm({ ...form, compliance: e.target.value })} />
          <Input label="Due Date (e.g. 20th Every Month / 31 July 2026)" required value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          <Input label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <Input label="Notes (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : editingId ? "Update" : "Create"}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteId} message="Delete this calendar entry?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </AdminLayout>
  );
}
