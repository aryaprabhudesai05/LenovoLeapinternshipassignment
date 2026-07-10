import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

function parseError(error) {
  if (!error) return "An unexpected error occurred.";
  return error.message || "Authentication failed.";
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const persist = (token, u) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", u.id);
    localStorage.setItem("userName", u.name || "");
    localStorage.setItem("userEmail", u.email || "");
    localStorage.setItem("userImage", u.avatar || u.profileImage || "");
    setUser({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      avatar: u.avatar || u.profileImage,
    });
  };

  const clear = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userImage");
    setUser(null);
  }, []);

  // Restore session from a stored token by validating it against the backend.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((u) => {
        if (u?.id?.startsWith?.("mock-")) {
          clear();
          return;
        }
        setUser({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          avatar: u.avatar || u.profileImage,
        });
      })
      .catch(() => clear())
      .finally(() => setLoading(false));
  }, [clear]);

  const register = async (name, email, password, role) => {
    setError(null);
    const data = await api.post("/auth/register", { name, email, password, role });
    persist(data.access_token, data.user);
    return data.user;
  };

  const login = async (email, password) => {
    setError(null);
    const data = await api.post("/auth/login", { email, password });
    persist(data.access_token, data.user);
    return data.user;
  };

  const logout = async () => {
    clear();
  };

  const forgotPassword = async (email) => {
    setError(null);
    return api.post("/auth/forgot", { email });
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        clearError,
        register,
        login,
        logout,
        forgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthCtx = () => useContext(AuthContext);
