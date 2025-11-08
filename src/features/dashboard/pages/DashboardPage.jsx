// src/features/dashboard/pages/DashboardPage.jsx
import { useAgentDashboard } from "../hooks/useAgentDashboard"; // 1. Importar el nuevo hook

import StatCard from "../components/StatCard";
import QueueLinkCard from "../components/QueueLinkCard";
import RecentActivityFeed from "../components/RecentActivityFeed";
import SimpleBarChart from "../components/SimpleBarChart";
import DashboardSkeleton from "../components/DashboardSkeleton";
import React from "react";

// Hook mock de autenticación (sin cambios)
const useAuth = () => ({
  currentUser: {
    id: "c7b5a2e0-f2a8-4f7a-8b1e-9d2c5e6f8a3b",
    nombre: "Brenda Diaz",
    rol: "AGENTE",
  },
  isLoading: false,
});

const DashboardPage = () => {
  const { currentUser } = useAuth();
  // 2. Usar el hook para obtener los datos, el estado de carga y el error
  const {
    dashboardData,
    isLoading,
    error,
  } = useAgentDashboard(currentUser?.id);

  // 3. La lógica de renderizado de estados (loading, error) permanece idéntica
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        <strong>Error al cargar el dashboard:</strong> {error}
      </div>
    );
  }

  if (!dashboardData) {
    return <div>No se encontraron datos para el dashboard.</div>;
  }

  // 4. Desestructuramos los datos para usarlos en el JSX
  const { myMetricsToday, myQueues, recentActivity } = dashboardData;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Hola, {currentUser?.nombre} 👋
        </h1>
        <p className="text-subtle mt-1">
          Este es el resumen de tu actividad de hoy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Mis Tickets Resueltos (Hoy)"
          value={myMetricsToday.resolved}
          icon="✅"
        />
        <StatCard
          title="Mis Tickets Asignados"
          value={myMetricsToday.assigned}
          icon="📁"
        />
        <StatCard
          title="Mi Tiempo Promedio de Respuesta"
          value={myMetricsToday.avgResponseTime} // Quitamos el "+ 'm'"
          icon="⏱️"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <div className="mb-8">
            <SimpleBarChart />
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">
            Mis Colas de Trabajo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QueueLinkCard
              title="Tickets Reabiertos"
              count={myQueues.reopened}
              linkTo="/tickets?status=reabierto"
              description="Máxima prioridad. Clientes que respondieron a tickets cerrados."
            />
            <QueueLinkCard
              title="Respuestas de Clientes"
              count={myQueues.customerReplied}
              linkTo="/tickets?status=respuesta_cliente"
              description="Conversaciones activas que esperan tu respuesta."
            />
            <QueueLinkCard
              title="Tickets para Triaje"
              count={myQueues.forTriage}
              linkTo="/tickets?status=ia_sugerido,nuevo"
              description="Nuevos tickets y sugerencias de Nora AI por revisar."
            />
            <QueueLinkCard
              title="Mis Tickets Escalados"
              count={myQueues.myEscalated}
              linkTo="/tickets?status=escalado_nivel_2&assignee=me"
              description="Casos complejos que requieren tu atención manual."
            />
          </div>
        </div>

        <div className="lg:col-span-1">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Actividad Reciente
          </h2>
          <RecentActivityFeed activities={recentActivity} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
