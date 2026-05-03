"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  role: string | null; 
  login: (userData: { role: string; token: string }) => void;
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
      } catch (error) {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = (userData: { role: string; token: string }) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setIsLoggedIn(true);
    setRole(userData.role);
  };

  const logout = () => {
    localStorage.removeItem("user");
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