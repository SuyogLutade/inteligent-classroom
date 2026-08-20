import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage
    const savedUser = localStorage.getItem("smartclass_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("smartclass_user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await api.auth.login(email, password);
      setUser(data.user);
      localStorage.setItem("smartclass_user", JSON.stringify(data.user));
      localStorage.setItem("smartclass_token", data.token);
      return data.user;
    } catch (err) {
      throw new Error(err.response?.data?.detail || "Invalid email or password");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("smartclass_user");
    localStorage.removeItem("smartclass_token");
  };

  const value = { user, login, logout, loading, isAuthenticated: !!user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
