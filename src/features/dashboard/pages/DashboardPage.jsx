// src/features/dashboard/pages/DashboardPage.jsx
import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getAgentDashboardData } from "../api/dashboardApi";
import { getUserById } from "@/features/auth/api/authApi";
import { useAuth } from "@/shared/hooks/useAuth";

import StatCard from "../components/StatCard";
import QueueLinkCard from "../components/QueueLinkCard";
import RecentActivityFeed from "../components/RecentActivityFeed";
import SimpleBarChart from "../components/SimpleBarChart";
import DashboardSkeleton from "../components/DashboardSkeleton";
import ErrorState from "src/shared/components/ui/ErrorState";
import EmptyState from "src/shared/components/ui/EmptyState";
import { formatTicketStatus } from "@/shared/utils/formatters";

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const { agentId } = useParams();

  // Si se proporciona agentId en la URL, usar ese agente; si no, usar el usuario actual
  const targetAgentId = agentId || currentUser?.id;

  // Fetch target agent details if it's not the current user
  const { data: fetchedAgent } = useQuery({
    queryKey: ["user", targetAgentId],
    queryFn: () => getUserById(targetAgentId),
    enabled: !!targetAgentId && targetAgentId !== currentUser?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const targetAgent =
    targetAgentId === currentUser?.id
      ? currentUser
      : fetchedAgent || { nombre: "Agente" };

  const [timeRange, setTimeRange] = useState("today"); // 'today' or 'thisWeek'

  // Compute ISO date range based on timeRange
  const computeRange = (range) => {
    const now = new Date();
    const fechaHasta = now.toISOString();
    if (range === "today") {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      return { fechaDesde: start.toISOString(), fechaHasta };
    }
    // thisWeek -> last 7 days (including today)
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0);
    return { fechaDesde: start.toISOString(), fechaHasta };
  };

  const { fechaDesde, fechaHasta } = useMemo(() => computeRange(timeRange), [timeRange]);

  const {
    data: dashboardData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["agentDashboard", targetAgentId, fechaDesde, fechaHasta],
    queryFn: () =>
      getAgentDashboardData({ agenteId: targetAgentId, fechaDesde, fechaHasta }),
    enabled: !!targetAgentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
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

  // Adaptar datos para el gráfico usando 'tendencias'
  const tendenciasData = Array.isArray(dashboardData.tendencias)
    ? dashboardData.tendencias.map((t) => ({
        fecha: new Date(t.fecha).toLocaleDateString(),
        "Asignados": t.ticketsAsignados,
        "Resueltos": t.ticketsResueltos,
        "Activos": t.ticketsActivos,
      }))
    : [];

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
          className={`px-4 py-2 rounded-md transition-all duration-200 text-sm font-medium ${
            timeRange === "today"
              ? "bg-dt-accent text-white shadow-glow"
              : "bg-white/5 text-dt-subtle hover:bg-white/10 hover:text-dt-foreground border border-transparent hover:border-white/10"
          }`}
        >
          Hoy
        </button>
        <button
          onClick={() => setTimeRange("thisWeek")}
          className={`px-4 py-2 rounded-md transition-all duration-200 text-sm font-medium ${
            timeRange === "thisWeek"
              ? "bg-dt-accent text-white shadow-glow"
              : "bg-white/5 text-dt-subtle hover:bg-white/10 hover:text-dt-foreground border border-transparent hover:border-white/10"
          }`}
        >
          Esta Semana
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title={`Mis Tickets Resueltos${timeRange === "today" ? " (Hoy)" : " (Esta Semana)"}`}
          value={timeRange === "today" ? currentMetrics.resolvedToday : currentMetrics.resolvedThisWeek}
          icon="✅"
        />
        <StatCard
          title="Mis Tickets Asignados"
          value={currentMetrics.assignedActive}
          icon="📁"
        />
        <StatCard
          title="Mi Tiempo Promedio de 1ª Respuesta (min)"
          value={
            timeRange === "today"
              ? (typeof currentMetrics.avgFirstResponseMin === "number"
                  ? currentMetrics.avgFirstResponseMin
                  : dashboardData.myMetrics?.today?.avgFirstResponseMin)
              : (typeof currentMetrics.avgFirstResponseMin === "number"
                  ? currentMetrics.avgFirstResponseMin
                  : dashboardData.myMetrics?.thisWeek?.avgFirstResponseMin)
          }
          icon="⏱️"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="h-96">
            <SimpleBarChart
              data={tendenciasData}
              title="Tendencia de Tickets (Asignados, Resueltos, Activos)"
              nameFormatter={(name) => name}
              multipleBars={true}
              barKeys={["Asignados", "Resueltos", "Activos"]}
            />
          </div>

          <div>
            <h2 className="text-lg font-bold text-dt-foreground mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-dt-accent">
                queue_music
              </span>
              Mis Colas de Trabajo
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <QueueLinkCard
                title="Tickets Reabiertos"
                count={myQueues.ticketsReabiertos}
                linkTo="/tickets?status=reabierto"
                description="Máxima prioridad. Clientes que respondieron a tickets cerrados."
              />
              <QueueLinkCard
                title="Respuestas de Clientes"
                count={myQueues.respuestasCliente}
                linkTo="/tickets?status=respuesta_cliente"
                description="Conversaciones activas que esperan tu respuesta."
              />
              <QueueLinkCard
                title="Tickets para Triaje"
                count={myQueues.ticketsTriaje}
                linkTo="/tickets?status=ia_sugerido,nuevo"
                description="Nuevos tickets y sugerencias de Nora AI por revisar."
              />
              <QueueLinkCard
                title="Mis Tickets Escalados"
                count={myQueues.ticketsEscalados}
                linkTo="/tickets?status=escalado_nivel_2&assignee=me"
                description="Casos complejos que requieren tu atención manual."
              />
              <QueueLinkCard
                title="Esperando Respuesta"
                count={myQueues.esperandoRespuesta}
                linkTo="/tickets?status=esperando_cliente"
                description="Tickets en los que has respondido y se espera acción del cliente."
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <h2 className="text-lg font-bold text-dt-foreground mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-dt-accent">
              history
            </span>
            Actividad Reciente
          </h2>
          <RecentActivityFeed activities={recentActivity} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
