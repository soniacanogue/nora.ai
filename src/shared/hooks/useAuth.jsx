// src/shared/hooks/useAuth.js

import React, { createContext, useState, useContext } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { login as apiLogin } from "@/features/auth/api/authApi";
import { useProfile } from "@/features/auth/hooks/useProfile";

// 1. Crear el Contexto
const AuthContext = createContext(null);

// 2. Crear el Proveedor del Contexto (AuthProvider)
// Este componente envolverá tu aplicación y proveerá el estado de autenticación.
export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const { data: currentUser, isLoading } = useProfile({
    enabled: !!token,
  });

  const login = async (email, password) => {
    const response = await apiLogin(email, password);
    // Save token to localStorage
    if (response.accessToken) {
      localStorage.setItem("token", response.accessToken);
      setToken(response.accessToken);
      
      // Si la respuesta incluye el usuario, actualizamos la caché inmediatamente
      if (response.user) {
        queryClient.setQueryData(["profile"], response.user);
      }
      // Si no, useProfile se encargará de buscarlo gracias al cambio de token/enabled
    }
    return response;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    queryClient.setQueryData(["profile"], null);
    queryClient.removeQueries(["profile"]);
  };

  const updateUser = (userData) => {
    queryClient.setQueryData(["profile"], userData);
  };

  const value = { currentUser, isLoading, login, logout, updateUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
