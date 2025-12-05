// src/shared/components/ProtectedRoute.jsx

import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/shared/hooks/useAuth";

/**
 * Un componente que protege rutas anidadas.
 * 1. Verifica si el usuario está autenticado.
 * 2. Verifica si es la primera vez del usuario (Onboarding).
 * 3. Verifica si el usuario tiene uno de los roles permitidos.
 * 4. Muestra un estado de carga mientras se verifica la sesión.
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const { currentUser, isLoading } = useAuth();
  const location = useLocation();

  // Muestra un estado de carga mientras el hook de autenticación determina el usuario
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dt-background">
        Verificando sesión...
      </div>
    );
  }

  // Si no hay usuario, redirige a la página de login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Lógica de Primera Vez (Onboarding)
  if (currentUser.primeraVez) {
    // Si el usuario tiene primeraVez=true y NO está en /onboarding, redirigir a /onboarding
    if (location.pathname !== "/onboarding") {
      return <Navigate to="/onboarding" replace />;
    }
    // Si está en /onboarding, permitir renderizar (el Outlet mostrará la página de onboarding)
    return <Outlet />;
  } else {
    // Si el usuario YA NO es primera vez, pero intenta acceder a /onboarding, redirigir al home
    if (location.pathname === "/onboarding") {
      return <Navigate to="/" replace />;
    }
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
