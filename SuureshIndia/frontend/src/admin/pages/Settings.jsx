import { useState } from "react";
import AdminLayout from "../AdminLayout";
import { PageHeader, Button, Input } from "../components/AdminUI";
import { useAuth } from "../AuthContext";
import { authAPI } from "../../services/api";
import "./Settings.css";

export default function Settings() {
  const { admin } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message }

  async function handleSubmit(e) {
    e.preventDefault();
    setFeedback(null);

    if (newPassword.length < 8) {
      setFeedback({ type: "error", message: "New password must be at least 8 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setFeedback({ type: "error", message: "New password and confirmation do not match." });
      return;
    }

    setSaving(true);
    try {
      const res = await authAPI.changePassword(currentPassword, newPassword);
      setFeedback({ type: "success", message: res.message || "Password updated successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setFeedback({ type: "error", message: err.message || "Could not update password." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout>
      <PageHeader title="Settings" subtitle="Manage your admin account" />

      <div className="settings-card">
        <h2>Account</h2>
        <p className="hint">Signed in as <strong>{admin?.email}</strong></p>
      </div>

      <div className="settings-card">
        <h2>Change Password</h2>
        <p className="hint">
          Use this the first time you log in (to replace the default password your
          internal guide gave you), and any time you want to rotate your credentials.
        </p>

        {feedback && (
          <p className={`settings-feedback ${feedback.type}`}>{feedback.message}</p>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Current Password"
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <Input
            label="New Password (min. 8 characters)"
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            label="Confirm New Password"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Update Password"}
          </Button>
        </form>
      </div>
    </AdminLayout>
  );
}
