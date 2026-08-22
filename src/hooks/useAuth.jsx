import { createContext, useContext, useEffect, useState } from "react";
import { authStorage, setUnauthorizedHandler } from "../lib/api.js";

const AuthContext = createContext(null);

const deslogado = {
  isAuthed: false,
  isAdmin: false,
  user: null,
  accessToken: null,
  refreshToken: null,
};

const initial = () => {
  const persisted = authStorage.read();
  if (!persisted?.accessToken) return deslogado;
  return {
    isAuthed: true,
    isAdmin: !!persisted.user?.is_admin_ong,
    user: persisted.user || null,
    accessToken: persisted.accessToken,
    refreshToken: persisted.refreshToken || null,
  };
};

export function AuthProvider({ children }) {
  const [state, setState] = useState(initial);

  useEffect(() => {
    setUnauthorizedHandler(() => setState(deslogado));
  }, []);

  const login = ({ user = null, accessToken = null, refreshToken = null } = {}) => {
    const next = {
      isAuthed: true,
      isAdmin: !!user?.is_admin_ong,
      user,
      accessToken,
      refreshToken,
    };
    authStorage.write(next);
    setState(next);
    return next;
  };

  const updateUser = (user) => {
    setState((prev) => {
      const next = { ...prev, user, isAdmin: !!user?.is_admin_ong };
      authStorage.write(next);
      return next;
    });
  };

  const logout = () => {
    authStorage.clear();
    setState(deslogado);
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
