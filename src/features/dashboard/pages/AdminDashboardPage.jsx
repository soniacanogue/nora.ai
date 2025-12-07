import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import StatCard from "../components/StatCard";
import SimpleBarChart from "../components/SimpleBarChart";
import TeamPerformanceTable from "../components/TeamPerformanceTable";
import PieChart from "../components/PieChart";
import { AdminDashboardSkeleton } from "../components/DashboardSkeleton";
import { getAdminDashboardData } from "../api/dashboardApi";
import ErrorState from "@/shared/components/ui/ErrorState";
import EmptyState from "@/shared/components/ui/EmptyState";
import { formatTicketStatus, formatChannel } from "@/shared/utils/formatters";
import { RollingNumber } from "@/shared/components/ui/RollingNumber";

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
    staleTime: 5 * 60 * 1000, // 5 minutes
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
        icon={
          <span className="material-symbols-outlined text-xl relative z-10">
            inbox
          </span>
        }
      />
    );
  }

  const { kpis, workload, teamPerformance, distribution } = dashboardData;
  const currentKpis = timeRange === "today" ? kpis.today : kpis.last7Days;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-dt-foreground">
          Dashboard del Administrador
        </h1>

        {/* Time Range Selector */}
        <div className="flex gap-1 bg-neutral-900/60 p-1 rounded-lg border border-white/5 backdrop-blur-sm">
          <button
            onClick={() => setTimeRange("today")}
            className={`px-4 py-1.5 rounded-md transition-all duration-300 text-sm font-medium ${
              timeRange === "today"
                ? "bg-dt-accent text-white shadow-glow"
                : "text-dt-subtle hover:text-white hover:bg-white/5"
            }`}
          >
            Hoy
          </button>
          <button
            onClick={() => setTimeRange("last7Days")}
            className={`px-4 py-1.5 rounded-md transition-all duration-300 text-sm font-medium ${
              timeRange === "last7Days"
                ? "bg-dt-accent text-white shadow-glow"
                : "text-dt-subtle hover:text-white hover:bg-white/5"
            }`}
          >
            Últimos 7 Días
          </button>
        </div>
      </div>

      {/* Métricas Globales - Unified Bento Block */}
      <div className="bg-neutral-900/60 backdrop-blur-md border border-white/5 rounded-xl overflow-hidden mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/5 shadow-lg shadow-black/20">
        <StatCard
          variant="minimal"
          title="Tickets Creados"
          value={<RollingNumber value={currentKpis.created} />}
          icon={
            <span className="material-symbols-outlined text-xl relative z-10">
              trending_up
            </span>
          }
        />
        <StatCard
          variant="minimal"
          title="Tickets Resueltos"
          value={<RollingNumber value={currentKpis.resolved} />}
          icon={
            <span className="material-symbols-outlined text-xl relative z-10">
              check_circle
            </span>
          }
        />
        <StatCard
          variant="minimal"
          title="Tiempo 1ra Resp"
          value={
            <>
              <RollingNumber value={currentKpis.avgFirstResponseTime} />m
            </>
          }
          icon={
            <span className="material-symbols-outlined text-xl relative z-10">
              timer
            </span>
          }
        />
        <StatCard
          variant="minimal"
          title="Tiempo Resolución"
          value={
            <>
              <RollingNumber value={currentKpis.avgResolutionTime} />m
            </>
          }
          icon={
            <span className="material-symbols-outlined text-xl relative z-10">
              hourglass_bottom
            </span>
          }
        />
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Main Chart - Spans 2 columns */}
        <div className="lg:col-span-2">
          <SimpleBarChart
            data={workload}
            title="Carga de Trabajo Actual"
            nameFormatter={formatTicketStatus}
          />
        </div>
        {/* Team Performance - Spans 1 column */}
        <div className="lg:col-span-1">
          <TeamPerformanceTable teamPerformance={teamPerformance} />
        </div>
      </div>

      {/* Pie Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PieChart
          data={distribution.byChannel}
          title="Distribución por Canal"
          nameKey="channel"
          nameFormatter={formatChannel}
        />
        <PieChart
          data={distribution.byTag}
          title="Distribución por Etiqueta"
          nameKey="tag"
        />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
