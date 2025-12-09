// src/shared/hooks/useAuth.js

import React, { createContext, useState, useContext, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { login as apiLogin } from "@/features/auth/api/authApi";
import { useProfile } from "@/features/auth/hooks/useProfile";
import supabase from '@/shared/lib/supabaseClient';

// 1. Crear el Contexto
const AuthContext = createContext(null);

// 2. Crear el Proveedor del Contexto (AuthProvider)
// Este componente envolverá tu aplicación y proveerá el estado de autenticación.
export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  // Initialize token from either our app storage or Supabase client's session store
  const [token, setToken] = useState(() => {
    try {
      // Try to read session from supabase client (if available)
      const session = supabase?.auth?.getSession ? supabase.auth.getSession()?.data?.session : null;
      return session?.access_token || localStorage.getItem("token") || null;
    } catch (e) {
      return localStorage.getItem("token");
    }
  });

  const { data: currentUser, isLoading } = useProfile({
    enabled: !!token,
  });

  // keep token in sync with Supabase auth state changes
  useEffect(() => {
    let sub;
    try {
      const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session?.access_token) {
          localStorage.setItem('token', session.access_token);
          setToken(session.access_token);
        }
        if (event === 'SIGNED_OUT') {
          localStorage.removeItem('token');
          setToken(null);
        }
      });
      sub = listener;
    } catch (e) {
      // ignore if supabase client doesn't support listener
    }
    return () => {
      try { sub?.subscription?.unsubscribe?.(); } catch (e) {}
    };
  }, []);

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
    // Clear Supabase auth token stored by the client (project-specific key)
    localStorage.removeItem("sb-nfnxegqqicswvsbpvcuw-auth-token");
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
