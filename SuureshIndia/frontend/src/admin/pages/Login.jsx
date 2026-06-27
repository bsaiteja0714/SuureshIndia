import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Login() {
  const { admin, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (admin) return <Navigate to="/admin/dashboard" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--bg)", color: "var(--fg)", padding: "1rem"
    }}>
      <form onSubmit={handleSubmit} style={{
        width: "100%", maxWidth: "380px", background: "var(--card-bg)",
        border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "2.5rem"
      }}>
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.5rem" }}>
            SuureshIndia
          </div>
          <div style={{ color: "var(--accent)", fontSize: "0.75rem", letterSpacing: "0.1em", marginTop: "0.25rem" }}>
            ADMIN LOGIN
          </div>
        </div>

        {error && (
          <div style={{
            background: "rgba(229,115,115,0.1)", border: "1px solid rgba(229,115,115,0.3)",
            color: "#e57373", padding: "0.7rem 1rem", borderRadius: "8px",
            fontSize: "0.85rem", marginBottom: "1.25rem"
          }}>
            {error}
          </div>
        )}

        <label style={{ display: "block", fontSize: "0.8rem", color: "var(--muted)", marginBottom: "0.4rem" }}>
          Email
        </label>
        <input
          type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@suureshindia.com"
          style={{
            width: "100%", padding: "0.7rem 0.9rem", marginBottom: "1.25rem",
            background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px",
            color: "var(--fg)", fontSize: "0.9rem"
          }}
        />

        <label style={{ display: "block", fontSize: "0.8rem", color: "var(--muted)", marginBottom: "0.4rem" }}>
          Password
        </label>
        <input
          type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          style={{
            width: "100%", padding: "0.7rem 0.9rem", marginBottom: "1.75rem",
            background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px",
            color: "var(--fg)", fontSize: "0.9rem"
          }}
        />

        <button type="submit" disabled={loading} style={{
          width: "100%", padding: "0.75rem", background: "var(--accent)", color: "#0a0a0a",
          border: "none", borderRadius: "100px", fontWeight: 600, fontSize: "0.9rem",
          opacity: loading ? 0.7 : 1
        }}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
