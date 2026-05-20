import { createContext, useContext, useEffect, useState } from "react";
import { authStorage, setUnauthorizedHandler } from "../lib/api.js";

const AuthContext = createContext(null);

const initial = () => {
  const persisted = authStorage.read();
  if (!persisted) return { isAuthed: false, isAdmin: false, user: null, accessToken: null };
  return {
    isAuthed: true,
    isAdmin: !!persisted.isAdmin,
    user: persisted.user || null,
    accessToken: persisted.accessToken || null,
  };
};

export function AuthProvider({ children }) {
  const [state, setState] = useState(initial);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setState({ isAuthed: false, isAdmin: false, user: null, accessToken: null });
    });
  }, []);

  const login = ({ asAdmin = false, user = null, accessToken = null } = {}) => {
    const next = { isAuthed: true, isAdmin: !!asAdmin, user, accessToken };
    authStorage.write(next);
    setState(next);
  };

  const logout = () => {
    authStorage.clear();
    setState({ isAuthed: false, isAdmin: false, user: null, accessToken: null });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
