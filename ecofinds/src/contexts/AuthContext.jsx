import React, { createContext, useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const loadUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const { data } = await api.get("/auth/me"); // backend: GET /auth/me
      setUser(data.user);
    } catch (err) {
      console.error("loadUser", err);
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  useEffect(() => { loadUser(); }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    loadUser();
    navigate("/");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
