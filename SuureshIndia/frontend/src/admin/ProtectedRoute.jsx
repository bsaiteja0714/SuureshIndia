import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", background: "var(--bg)", color: "var(--muted)"
      }}>
        Loading...
      </div>
    );
  }

  if (!admin) return <Navigate to="/admin/login" replace />;
  return children;
}
