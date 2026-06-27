import { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import { PageHeader, Button, Input, Modal, StatusBadge } from "../components/AdminUI";
import ConfirmDialog from "../components/ConfirmDialog";
import { legalPagesAPI } from "../../services/api";
import { FaGlobe, FaEdit, FaTrash, FaEye, FaSave, FaCheck, FaTimes } from "react-icons/fa";

export default function PolicyAdmin({ type, title }) {
  const [data, setData] = useState({ document: null, hasDraft: false, isPublished: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Form state
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    contactEmail: "",
    sections: [] // array of { _key, title, content }
  });

  function load() {
    setLoading(true);
    legalPagesAPI.admin.get(type)
      .then((res) => {
        setData(res);
        if (res.document) {
          setForm({
            title: res.document.title || "",
            subtitle: res.document.subtitle || "",
            contactEmail: res.document.contactEmail || "",
            sections: res.document.sections || []
          });
        } else {
          setForm({ title: "", subtitle: "", contactEmail: "", sections: [] });
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }
  
  useEffect(load, [type]);

  async function handleSaveDraft() {
    setSaving(true);
    try {
      await legalPagesAPI.admin.update(type, form);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    setSaving(true);
    try {
      await legalPagesAPI.admin.update(type, form); // Save first
      await legalPagesAPI.admin.publish(type); // Then publish
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleUnpublish() {
    setSaving(true);
    try {
      await legalPagesAPI.admin.unpublish(type);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await legalPagesAPI.admin.delete(type);
      setDeleteConfirm(false);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  // Very basic rich text blocks handling for Sanity Portable Text
  const addSection = () => {
    const newSection = {
      _key: Math.random().toString(36).substring(7),
      title: "",
      content: [{ _type: "block", children: [{ _type: "span", text: "" }] }]
    };
    setForm({ ...form, sections: [...form.sections, newSection] });
  };

  const updateSectionTitle = (index, value) => {
    const updated = [...form.sections];
    updated[index].title = value;
    setForm({ ...form, sections: updated });
  };

  const updateSectionContent = (index, value) => {
    const updated = [...form.sections];
    updated[index].content = [{ _type: "block", children: [{ _type: "span", text: value }] }];
    setForm({ ...form, sections: updated });
  };

  const removeSection = (index) => {
    const updated = form.sections.filter((_, i) => i !== index);
    setForm({ ...form, sections: updated });
  };

  const getBlockText = (blocks) => {
    if (!blocks || !Array.isArray(blocks)) return "";
    return blocks
      .map(block => {
        if (block._type !== 'block' || !block.children) return '';
        return block.children.map(child => child.text).join('');
      })
      .join('\n\n');
  };

  return (
    <AdminLayout>
      <PageHeader
        title={title}
        subtitle={`Manage ${title} content`}
      />

      {error && <p style={{ color: "#e57373", marginBottom: "1rem" }}>{error}</p>}

      {/* Status Bar */}
      <div style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "1rem 1.5rem",
        marginBottom: "2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontWeight: 600, color: "var(--fg)" }}>Status:</span>
          {loading ? <span>Loading...</span> : (
            <>
              {data.isPublished && !data.hasDraft && (
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#22c55e", background: "rgba(34,197,94,0.1)", padding: "0.25rem 0.75rem", borderRadius: "100px", fontSize: "0.85rem", fontWeight: 600 }}>
                  <FaCheck /> Published (Live)
                </span>
              )}
              {data.hasDraft && (
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#f59e0b", background: "rgba(245,158,11,0.1)", padding: "0.25rem 0.75rem", borderRadius: "100px", fontSize: "0.85rem", fontWeight: 600 }}>
                  <FaEdit /> Draft (Unsaved Changes)
                </span>
              )}
              {!data.isPublished && !data.hasDraft && (
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--muted)", background: "rgba(255,255,255,0.05)", padding: "0.25rem 0.75rem", borderRadius: "100px", fontSize: "0.85rem", fontWeight: 600 }}>
                  Not Created
                </span>
              )}
            </>
          )}
        </div>
        
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Button type="button" variant="ghost" onClick={() => setPreviewOpen(true)} disabled={loading || (!data.hasDraft && !data.isPublished)}>
            <FaEye /> Preview
          </Button>
          
          {data.isPublished && (
            <Button type="button" variant="ghost" onClick={handleUnpublish} disabled={saving}>
              <FaTimes /> Unpublish
            </Button>
          )}

          <Button type="button" variant="ghost" onClick={handleSaveDraft} disabled={saving}>
            <FaSave /> Save Draft
          </Button>

          <Button type="button" onClick={handlePublish} disabled={saving}>
            <FaGlobe /> Publish
          </Button>
          
          {(data.hasDraft || data.isPublished) && (
            <Button type="button" variant="danger" onClick={() => setDeleteConfirm(true)} disabled={saving}>
              <FaTrash /> Delete
            </Button>
          )}
        </div>
      </div>

      <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "2rem" }}>
        <div style={{ display: "grid", gap: "1.5rem" }}>
          <Input 
            label="Page Title" 
            value={form.title} 
            onChange={(e) => setForm({ ...form, title: e.target.value })} 
            required 
          />
          <Input 
            label="Page Subtitle" 
            value={form.subtitle} 
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })} 
          />
          <Input 
            label="Contact Email" 
            type="email"
            value={form.contactEmail} 
            onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} 
          />

          <div style={{ marginTop: "1rem", borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.1rem", color: "var(--fg)", margin: 0 }}>Content Sections</h3>
              <Button type="button" variant="ghost" onClick={addSection}>+ Add Section</Button>
            </div>

            {form.sections.length === 0 ? (
              <p style={{ color: "var(--muted)", textAlign: "center", padding: "2rem 0" }}>No sections added yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {form.sections.map((section, index) => (
                  <div key={section._key || index} style={{ border: "1px solid var(--border)", padding: "1.5rem", borderRadius: "8px", background: "rgba(0,0,0,0.2)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                      <h4 style={{ margin: 0, color: "var(--accent)" }}>Section {index + 1}</h4>
                      <button type="button" onClick={() => removeSection(index)} style={{ background: "none", border: "none", color: "#e57373", cursor: "pointer" }}><FaTrash /></button>
                    </div>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <Input 
                        label="Section Title" 
                        value={section.title} 
                        onChange={(e) => updateSectionTitle(index, e.target.value)} 
                      />
                      <div>
                        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--muted)", marginBottom: "0.5rem" }}>Content</label>
                        <textarea 
                          value={getBlockText(section.content)}
                          onChange={(e) => updateSectionContent(index, e.target.value)}
                          style={{
                            width: "100%",
                            minHeight: "150px",
                            padding: "0.75rem 1rem",
                            borderRadius: "var(--radius)",
                            border: "1px solid var(--border)",
                            background: "var(--bg)",
                            color: "var(--fg)",
                            fontSize: "0.95rem",
                            outline: "none",
                            resize: "vertical"
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={deleteConfirm}
        message={`Are you sure you want to delete the ${title}? This will remove both the published version and any drafts.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(false)}
      />

      <Modal open={previewOpen} onClose={() => setPreviewOpen(false)} title={`Preview: ${title}`}>
        <div style={{ padding: "1rem" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", fontFamily: "var(--font-display)" }}>{form.title || title}</h1>
          {form.subtitle && <p style={{ fontSize: "1.1rem", color: "var(--muted)", marginBottom: "2rem" }}>{form.subtitle}</p>}
          
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem", marginTop: "2rem" }}>
            {form.sections.map((sec, i) => (
              <div key={i}>
                <h3 style={{ fontSize: "1.2rem", marginBottom: "0.75rem", color: "var(--accent)" }}>{sec.title}</h3>
                <div style={{ whiteSpace: "pre-wrap", color: "var(--fg)", lineHeight: 1.6 }}>
                  {getBlockText(sec.content)}
                </div>
              </div>
            ))}
          </div>

          {form.contactEmail && (
            <div style={{ marginTop: "3rem", padding: "1rem", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}>
              <p>For inquiries, contact: <a href={`mailto:${form.contactEmail}`} style={{ color: "var(--accent)" }}>{form.contactEmail}</a></p>
            </div>
          )}
        </div>
      </Modal>

    </AdminLayout>
  );
}
