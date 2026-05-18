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
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setIsLoggedIn(true);
        setRole(user.role);
        if (user.token) {
          localStorage.setItem("token", user.token);
        }
        if (user.userId) {
          localStorage.setItem("userId", user.userId);
        }
      } catch (error) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
      }
    }
  }, []);

  const login = (userData: { role: string; token: string; userId?: string }) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userData.token);
    if (userData.userId) {
      localStorage.setItem("userId", userData.userId);
    }
    setIsLoggedIn(true);
    setRole(userData.role);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
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