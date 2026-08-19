import { createContext, useContext, useState, useEffect } from "react";
import { teachers, students } from "../data/mockData";

const AuthContext = createContext(null);

// Demo users for prototype
const DEMO_USERS = {
  admin: {
    id: "admin-1",
    name: "Dr. Priya Nair",
    email: "admin@smartclass.edu",
    password: "admin123",
    role: "admin",
    designation: "HOD & Administrator",
    department: "Computer Science & Engineering",
  },
  ...Object.fromEntries(
    teachers.map((t) => [
      t.id,
      { ...t, role: "teacher", designation: "Assistant Professor" },
    ])
  ),
  ...Object.fromEntries(
    students.map((s) => [
      s.id,
      { ...s, role: "student", designation: "B.Tech Student" },
    ])
  ),
};

// Lookup by email
const USERS_BY_EMAIL = Object.values(DEMO_USERS).reduce((acc, user) => {
  acc[user.email] = user;
  return acc;
}, {});

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
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 800));

    const found = USERS_BY_EMAIL[email];
    if (!found || found.password !== password) {
      throw new Error("Invalid email or password");
    }

    // Don't store password in state
    const { password: _pw, ...safeUser } = found;
    setUser(safeUser);
    localStorage.setItem("smartclass_user", JSON.stringify(safeUser));
    return safeUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("smartclass_user");
  };

  const value = { user, login, logout, loading, isAuthenticated: !!user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
