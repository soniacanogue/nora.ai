// src/shared/hooks/useAuth.js

import React, { createContext, useState, useContext, useEffect } from "react";
import { mockUsuarios } from "@/data/mockUsuarios";

// 1. Crear el Contexto
const AuthContext = createContext(null);

// 2. Crear el Proveedor del Contexto (AuthProvider)
// Este componente envolverá tu aplicación y proveerá el estado de autenticación.
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula la obtención del usuario al cargar la aplicación
    const fetchUser = () => {
      setTimeout(() => {
        // --- ¡AQUÍ PUEDES CAMBIAR EL USUARIO PARA PROBAR! ---
        // Cambia el índice [0] (Brenda), [1] (Carlos), o [2] (Admin)
        const loggedInUser = mockUsuarios[0]; // <--- CAMBIA AQUÍ PARA PROBAR ROLES

        setCurrentUser(loggedInUser);
        setIsLoading(false);
      }, 500); // Simula un pequeño retraso de red
    };

    fetchUser();
  }, []);

  const value = { currentUser, isLoading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
