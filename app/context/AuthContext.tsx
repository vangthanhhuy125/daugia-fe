"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  role: string | null; 
  login: (userData: { role: string; token: string; userId?: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const storedRole = localStorage.getItem("userRole");
    if (token && storedRole) {
      setIsLoggedIn(true);
      setRole(storedRole);
    }
  }, []);

  const login = (userData: { role: string; token: string; userId?: string }) => {
    localStorage.setItem("accessToken", userData.token);
    localStorage.setItem("userRole", userData.role);
    if (userData.userId) {
      localStorage.setItem("userId", userData.userId);
    }
    setIsLoggedIn(true);
    setRole(userData.role);
  };

  const logout = () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      import("../../services/authService").then(({ authService }) => {
        authService.logout({ token }).catch(() => {});
      });
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("cached_user_profile");
    setIsLoggedIn(false);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};