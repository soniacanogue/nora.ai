import React, { Suspense } from "react";
import { useAuth } from "@/shared/hooks/useAuth";

// Carga perezosa de los dashboards para mejorar el rendimiento inicial
const AdminDashboardPage = React.lazy(() => import("./AdminDashboardPage"));
const AgentDashboardPage = React.lazy(() => import("./DashboardPage"));

const RoleBasedDashboard = () => {
  const { currentUser } = useAuth();

  // Fallback ligero mientras se cargan los chunks
  const fallback = (
    <div className="min-h-[300px] flex items-center justify-center">
      <div className="text-dt-subtle animate-pulse">Cargando dashboard...</div>
    </div>
  );

  if (currentUser?.rol === "ADMINISTRADOR") {
    return (
      <Suspense fallback={fallback}>
        <AdminDashboardPage />
      </Suspense>
    );
  }

  // Por defecto, renderiza el dashboard de agente
  return (
    <Suspense fallback={fallback}>
      <AgentDashboardPage />
    </Suspense>
  );
};

export default RoleBasedDashboard;
