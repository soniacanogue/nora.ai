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

const AdminDashboardPage = () => {
  const [timeRange, setTimeRange] = useState("today"); // 'today' or 'last7Days'
  
  const { data: dashboardData, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['adminDashboard'],
    queryFn: getAdminDashboardData,
  });

  if (isLoading) {
    return <AdminDashboardSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState 
        message={error?.message || "Error al cargar el dashboard del administrador."} 
        onRetry={refetch} 
      />
    );
  }

  if (!dashboardData) {
    return <EmptyState message="No se encontraron datos para el dashboard del administrador." />;
  }

  const { kpis, workload, teamPerformance, distribution } = dashboardData;
  const currentKpis = timeRange === "today" ? kpis.today : kpis.last7Days;

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">
        Dashboard del Administrador
      </h1>

      {/* Time Range Selector */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setTimeRange("today")}
          className={`px-4 py-2 rounded-md transition-colors ${
            timeRange === "today"
              ? "bg-accent text-foreground font-semibold"
              : "bg-primary text-subtle hover:bg-secondary"
          }`}
        >
          Hoy
        </button>
        <button
          onClick={() => setTimeRange("last7Days")}
          className={`px-4 py-2 rounded-md transition-colors ${
            timeRange === "last7Days"
              ? "bg-accent text-foreground font-semibold"
              : "bg-primary text-subtle hover:bg-secondary"
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
        <SimpleBarChart data={workload} />
        <TeamPerformanceTable teamPerformance={teamPerformance} />
      </div>

      {/* Gráficos - Segunda Fila: Distribuciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChart
          data={distribution.byChannel}
          title="Distribución por Canal"
          dataKey="count"
          nameKey="channel"
        />
        <PieChart
          data={distribution.byTag}
          title="Distribución por Etiqueta"
          dataKey="count"
          nameKey="tag"
        />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
