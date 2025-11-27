import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import StatCard from "../components/StatCard";
import SimpleBarChart from "../components/SimpleBarChart";
import TeamPerformanceTable from "../components/TeamPerformanceTable";
import PieChart from "../components/PieChart";
import { AdminDashboardSkeleton } from "../components/DashboardSkeleton";
import { getAdminDashboardData } from "../api/dashboardApi";
import ErrorState from "src/shared/components/ui/ErrorState";
import EmptyState from "src/shared/components/ui/EmptyState";
import { formatTicketStatus, formatChannel } from "src/shared/utils/formatters"; // <- IMPORTAR

const AdminDashboardPage = () => {
  const [timeRange, setTimeRange] = useState("today"); // 'today' or 'last7Days'

  const {
    data: dashboardData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["adminDashboard", timeRange],
    queryFn: () => getAdminDashboardData(timeRange),
  });

  if (isLoading) {
    return <AdminDashboardSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState
        message={
          error?.message || "Error al cargar el dashboard del administrador."
        }
        onRetry={refetch}
      />
    );
  }

  if (!dashboardData) {
    return (
      <EmptyState
        message="No se encontraron datos para el dashboard del administrador."
        icon="📭"
      />
    );
  }

  const { kpis, workload, teamPerformance, distribution } = dashboardData;
  const currentKpis = timeRange === "today" ? kpis.today : kpis.last7Days;

  return (
    <div>
      <h1 className="text-3xl font-bold text-dt-foreground mb-6">
        Dashboard del Administrador
      </h1>

      {/* Time Range Selector */}
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
          onClick={() => setTimeRange("last7Days")}
          className={`px-4 py-2 rounded-md transition-colors ${
            timeRange === "last7Days"
              ? "bg-dt-accent text-dt-foreground font-semibold"
              : "bg-dt-primary text-dt-subtle hover:bg-dt-secondary"
          }`}
        >
          Últimos 7 Días
        </button>
      </div>

      {/* Métricas Globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Tickets Creados"
          value={currentKpis.created}
          icon="📈"
        />
        <StatCard
          title="Tickets Resueltos"
          value={currentKpis.resolved}
          icon="✔️"
        />
        <StatCard
          title="Tiempo Promedio Primera Respuesta"
          value={`${currentKpis.avgFirstResponseTime}m`}
          icon="⏱️"
        />
        <StatCard
          title="Tiempo Promedio de Resolución"
          value={`${currentKpis.avgResolutionTime}m`}
          icon="⏳"
        />
      </div>

      {/* Gráficos - Primera Fila */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SimpleBarChart
          data={workload}
          title="Carga de Trabajo Actual"
          nameFormatter={formatTicketStatus} // <- PASAR EL FORMATEADOR
        />
        <TeamPerformanceTable teamPerformance={teamPerformance} />
      </div>

      {/* Gráficos - Segunda Fila: Distribuciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChart
          data={distribution.byChannel}
          title="Distribución por Canal"
          nameKey="channel"
          nameFormatter={formatChannel} // <- PASAR EL FORMATEADOR
        />
        <PieChart
          data={distribution.byTag}
          title="Distribución por Etiqueta"
          nameKey="tag"
          // No se necesita formateador aquí si las etiquetas ya son legibles
        />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
