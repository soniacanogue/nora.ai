import React from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import AdminDashboardPage from "@/features/dashboard/pages/AdminDashboardPage";

const HomePage = () => {
  const { currentUser } = useAuth();

  // Basado en el rol del usuario, renderiza el dashboard correspondiente
  // Un administrador también es un "agente" y puede tener su propio dashboard operativo.
  // La vista de "Admin" es una herramienta separada y estratégica.
  if (currentUser?.rol === "ADMINISTRADOR") {
    // Para el MVP, el home de un admin será su dashboard estratégico.
    return <AdminDashboardPage />;
  }

  // Por defecto, todos los demás (Agentes) ven su dashboard personal.
  return <DashboardPage />;
};

export default HomePage;
