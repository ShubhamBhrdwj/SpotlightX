import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);

function getStoredAuth() {
  const token = localStorage.getItem("spotlightx_token");
  const rawUser = localStorage.getItem("spotlightx_user");

  return {
    token,
    user: rawUser ? JSON.parse(rawUser) : null
  };
}

export function AuthProvider({ children }) {
  const [{ token, user }, setAuth] = useState(getStoredAuth);
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    let active = true;

    api
      .get("/api/auth/me")
      .then((nextUser) => {
        if (!active) {
          return;
        }

        localStorage.setItem("spotlightx_user", JSON.stringify(nextUser));
        setAuth((current) => ({ ...current, user: nextUser }));
      })
      .catch(() => {
        if (!active) {
          return;
        }

        localStorage.removeItem("spotlightx_token");
        localStorage.removeItem("spotlightx_user");
        setAuth({ token: null, user: null });
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [token]);

  async function login(credentials) {
    const payload = await api.post("/api/auth/login", credentials);

    localStorage.setItem("spotlightx_token", payload.token);
    localStorage.setItem("spotlightx_user", JSON.stringify(payload.user));

    setAuth({
      token: payload.token,
      user: payload.user
    });

    return payload.user;
  }

  async function register(details) {
    const payload = await api.post("/api/auth/register", details);

    localStorage.setItem("spotlightx_token", payload.token);
    localStorage.setItem("spotlightx_user", JSON.stringify(payload.user));

    setAuth({
      token: payload.token,
      user: payload.user
    });

    return payload.user;
  }

  function logout() {
    localStorage.removeItem("spotlightx_token");
    localStorage.removeItem("spotlightx_user");
    setAuth({ token: null, user: null });
  }

  function updateUser(nextUser) {
    localStorage.setItem("spotlightx_user", JSON.stringify(nextUser));
    setAuth((current) => ({ ...current, user: nextUser }));
  }

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
      updateUser
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
