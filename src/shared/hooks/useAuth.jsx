// src/shared/hooks/useAuth.js

import React, { createContext, useState, useContext, useEffect } from "react";
import { login as apiLogin, getProfile } from "@/features/auth/api/authApi";

// 1. Crear el Contexto
const AuthContext = createContext(null);

// 2. Crear el Proveedor del Contexto (AuthProvider)
// Este componente envolverá tu aplicación y proveerá el estado de autenticación.
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user profile on app start if token exists
    const loadUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const user = await getProfile();
        setCurrentUser(user);
      } catch (error) {
        console.error("Failed to load user profile:", error);
        // Token might be invalid, clear it
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const login = async (email, password) => {
    const response = await apiLogin(email, password);
    // Save token to localStorage
    if (response.accessToken) {
      localStorage.setItem("token", response.accessToken);
    }
    // Set user from response or fetch profile
    if (response.user) {
      setCurrentUser(response.user);
    } else {
      // If login response doesn't include user, fetch profile
      const user = await getProfile();
      setCurrentUser(user);
    }
    return response;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
  };

  const value = { currentUser, isLoading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
