// src/shared/components/ProtectedRoute.jsx

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/shared/hooks/useAuth";

/**
 * Un componente que protege rutas anidadas.
 * 1. Verifica si el usuario está autenticado.
 * 2. Verifica si el usuario tiene uno de los roles permitidos.
 * 3. Muestra un estado de carga mientras se verifica la sesión.
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const { currentUser, isLoading } = useAuth();

  // Muestra un estado de carga mientras el hook de autenticación determina el usuario
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        Verificando sesión...
      </div>
    );
  }

  // Si no hay usuario, redirige a la página de login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Si se especifican roles y el rol del usuario no está incluido,
  // redirige a la página de inicio (una página segura a la que siempre tiene acceso)
  if (allowedRoles && !allowedRoles.includes(currentUser.rol)) {
    return <Navigate to="/" replace />;
  }

  // Si todas las verificaciones pasan, renderiza la ruta anidada correspondiente
  return <Outlet />;
};

export default ProtectedRoute;
