// src/features/dashboard/pages/DashboardPage.jsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getAgentDashboardData } from "../api/dashboardApi";
import { mockUsuarios } from "@/data/mockUsuarios";

import StatCard from "../components/StatCard";
import QueueLinkCard from "../components/QueueLinkCard";
import RecentActivityFeed from "../components/RecentActivityFeed";
import SimpleBarChart from "../components/SimpleBarChart";
import DashboardSkeleton from "../components/DashboardSkeleton";
import ErrorState from "src/shared/components/ui/ErrorState";
import EmptyState from "src/shared/components/ui/EmptyState";
import { formatTicketStatus } from "@/shared/utils/formatters";

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
  const { agentId } = useParams();

  // Si se proporciona agentId en la URL, usar ese agente; si no, usar el usuario actual
  const targetAgentId = agentId || currentUser?.id;

  // Obtener datos del agente específico si se proporciona agentId
  const targetAgent = agentId
    ? mockUsuarios.find((u) => u.id === agentId) || {
        id: agentId,
        nombre: "Agente Desconocido",
        rol: "AGENTE",
      }
    : currentUser;

  const [timeRange, setTimeRange] = useState("today"); // 'today' or 'thisWeek'

  const {
    data: dashboardData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["agentDashboard", targetAgentId, timeRange],
    queryFn: () => getAgentDashboardData(targetAgentId, timeRange),
    enabled: !!targetAgentId,
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState
        message={error?.message || "Error al cargar el dashboard del agente."}
        onRetry={refetch}
      />
    );
  }

  if (!dashboardData) {
    return (
      <EmptyState
        message="No se encontraron datos para el dashboard del agente."
        icon="📭"
      />
    );
  }

  const { myMetrics, myQueues, myTicketsByStatus, recentActivity } =
    dashboardData;

  // Select metrics based on time range
  const currentMetrics =
    timeRange === "today" ? myMetrics.today : myMetrics.thisWeek;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dt-foreground">
          Hola, {targetAgent?.nombre} 👋
        </h1>
        <p className="text-dt-subtle mt-1">
          Este es el resumen de tu actividad.
        </p>
      </div>

      {/* Time Range Selector for Metrics */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setTimeRange("today")}
          className={`px-4 py-2 rounded-md transition-colors ${
            timeRange === "today"
              ? "bg-dt-accent text-dt-foreground font-semibold"
              : "bg-dt-primary text-dt-subtle hover:bg-dt-secondary"
          }`}
        >
          Hoy
        </button>
        <button
          onClick={() => setTimeRange("thisWeek")}
          className={`px-4 py-2 rounded-md transition-colors ${
            timeRange === "thisWeek"
              ? "bg-dt-accent text-dt-foreground font-semibold"
              : "bg-dt-primary text-dt-subtle hover:bg-dt-secondary"
          }`}
        >
          Esta Semana
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title={`Mis Tickets Resueltos${timeRange === "today" ? " (Hoy)" : " (Esta Semana)"}`}
          value={currentMetrics.resolved}
          icon="✅"
        />
        <StatCard
          title="Mis Tickets Asignados"
          value={currentMetrics.assigned}
          icon="📁"
        />
        <StatCard
          title="Mi Tiempo Promedio de Respuesta"
          value={currentMetrics.avgResponseTime}
          icon="⏱️"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <div className="mb-8">
            <SimpleBarChart
              data={myTicketsByStatus}
              title="Mis Tickets por Estado"
              nameFormatter={formatTicketStatus}
            />
          </div>

          <h2 className="text-2xl font-bold text-dt-foreground mb-4">
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
            {/* --- CORRECCIÓN AÑADIDA --- */}
            <QueueLinkCard
              title="Esperando Respuesta del Cliente"
              count={myQueues.waitingForCustomer}
              linkTo="/tickets?status=esperando_cliente"
              description="Tickets en los que has respondido y se espera acción del cliente."
            />
            {/* --- FIN DE LA CORRECCIÓN --- */}
          </div>
        </div>

        <div className="lg:col-span-1">
          <h2 className="text-2xl font-bold text-dt-foreground mb-4">
            Actividad Reciente
          </h2>
          <RecentActivityFeed activities={recentActivity} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
