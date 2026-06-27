import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { setLoading(false); return; }
    authAPI.me()
      .then((data) => setAdmin(data))
      .catch(() => { localStorage.removeItem("admin_token"); })
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const data = await authAPI.login(email, password);
    localStorage.setItem("admin_token", data.token);
    setAdmin({ email: data.email });
    return data;
  }

  function logout() {
    localStorage.removeItem("admin_token");
    setAdmin(null);
  }

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
