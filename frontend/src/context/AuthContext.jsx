import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginUser, registerUser } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const response = await loginUser(credentials);
    const authUser = response.data.user;
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(authUser));
    setToken(response.data.token);
    setUser(authUser);
    return response;
  };

  const register = async (payload) => {
    const response = await registerUser(payload);
    const authUser = response.data.user;
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(authUser));
    setToken(response.data.token);
    setUser(authUser);
    return response;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout }),
    [user, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
