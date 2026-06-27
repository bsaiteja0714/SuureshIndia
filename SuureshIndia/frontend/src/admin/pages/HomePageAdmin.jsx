import { useState, useEffect } from "react";
import AdminLayout from "../AdminLayout";
import { PageHeader, Button, Input, Textarea } from "../components/AdminUI";
import { homePageAPI } from "../../services/api";

export default function HomePageAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    aboutTitle: "",
    aboutDescription: "",
    aboutCardTitle: "",
    aboutCardDescription: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const data = await homePageAPI.get();

      if (data) {
        setFormData({
          aboutTitle: data.aboutTitle || "",
          aboutDescription: data.aboutDescription || "",
          aboutCardTitle: data.aboutCardTitle || "",
          aboutCardDescription: data.aboutCardDescription || "",
        });
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load Home Page content");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      await homePageAPI.update(formData);
      alert("Home Page Content updated successfully!");
    } catch (err) {
      alert("Error saving Home Page content: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout>
      <PageHeader
        title="Home Page Settings"
        subtitle="Manage the content displayed on the Home page"
      />

      {loading ? (
        <div style={{ color: "var(--muted)" }}>Loading...</div>
      ) : (
        <div
          style={{
            background: "var(--card-bg)",
            padding: "2rem",
            borderRadius: "var(--radius)",
            border: "1px solid var(--border)",
            maxWidth: "800px",
          }}
        >
          <form onSubmit={handleSubmit}>
            <h3
              style={{
                fontSize: "1.1rem",
                marginBottom: "1rem",
                color: "var(--accent)",
              }}
            >
              About Section
            </h3>

            <Input
              label="About Section Title"
              value={formData.aboutTitle}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  aboutTitle: e.target.value,
                })
              }
              placeholder="e.g. About SuureshIndia"
            />

            <Textarea
              label="About Section Description"
              value={formData.aboutDescription}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  aboutDescription: e.target.value,
                })
              }
              placeholder="Detailed description about the company..."
              style={{ minHeight: "200px" }}
            />
            <h3
              style={{
                fontSize: "1.1rem",
                marginTop: "2rem",
                marginBottom: "1rem",
                color: "var(--accent)",
              }}
            >
              About Info Card
            </h3>

            <Input
              label="Card Title"
              value={formData.aboutCardTitle}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  aboutCardTitle: e.target.value,
                })
              }
              placeholder="e.g. Currently Accepting New Clients"
            />

            <Textarea
              label="Card Description"
              value={formData.aboutCardDescription}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  aboutCardDescription: e.target.value,
                })
              }
              placeholder="e.g. Reach out for a free initial consultation and strategic planning."
              style={{ minHeight: "120px" }}
            />
            <div
              style={{
                marginTop: "2rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid var(--border)",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}
