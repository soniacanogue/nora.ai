import React from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import AdminDashboardPage from "@/features/dashboard/pages/AdminDashboardPage";

const HomePage = () => {
  const { currentUser } = useAuth();

  // Basado en el rol del usuario, renderiza el dashboard correspondiente
  if (currentUser?.rol === "ADMINISTRADOR") {
    return <AdminDashboardPage />;
  }

  // Por defecto, muestra el dashboard de agente
  return <DashboardPage />;
};

export default HomePage;
