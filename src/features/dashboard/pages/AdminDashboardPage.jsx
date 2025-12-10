import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import StatCard from "../components/StatCard";
import SimpleBarChart from "../components/SimpleBarChart";
import PieChart from "../components/PieChart";
import RecentActivityFeed from "../components/RecentActivityFeed";
import { AdminDashboardSkeleton } from "../components/DashboardSkeleton";
import { getAdminDashboardData } from "../api/dashboardApi";
import ErrorState from "@/shared/components/ui/ErrorState";
import EmptyState from "@/shared/components/ui/EmptyState";
import { formatTicketStatus, formatChannel, formatPriority } from "@/shared/utils/formatters";
import { RollingNumber } from "@/shared/components/ui/RollingNumber";

const AdminDashboardPage = () => {
  const [timeRange, setTimeRange] = useState("today"); // 'today' or 'last7Days'

  const computeRange = (range) => {
    const now = new Date();
    const fechaHasta = now.toISOString();
    if (range === "today") {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      return { fechaDesde: start.toISOString(), fechaHasta };
    }
    // last7Days
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0);
    return { fechaDesde: start.toISOString(), fechaHasta };
  };

  // Memoize computed range so `fechaHasta` (now) doesn't change every render
  const { fechaDesde, fechaHasta } = React.useMemo(() => computeRange(timeRange), [timeRange]);

  const {
    data: dashboardData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["adminDashboard", fechaDesde, fechaHasta],
    queryFn: () => getAdminDashboardData({ fechaDesde, fechaHasta }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const derivedData = React.useMemo(() => {
    if (!dashboardData) return null;
    const { resumen, metricas, distribucion: rawDistribucion, tendencias: rawTendencias, actividadReciente, myMetrics, myQueues } = dashboardData;
    const currentKpis = timeRange === "today" ? {
      created: myMetrics.today.ticketsTotal,
      resolved: myMetrics.today.resolvedToday,
      avgFirstResponseTime: myMetrics.today.avgFirstResponseMin,
      avgResolutionTime: myMetrics.today.avgResolutionMin,
    } : {
      created: resumen.total,
      resolved: resumen.cerrados,
      avgFirstResponseTime: metricas.promedioTiempoPrimerRespuestaMin,
      avgResolutionTime: metricas.promedioTiempoResolucionMin,
    };

    const distribucion = {
      porEstado: rawDistribucion.porEstado.map(item => ({ estado: item.estado, count: item._count.id })),
      porPrioridad: rawDistribucion.porPrioridad.map(item => ({ prioridad: item.prioridad, count: item._count.id })),
    };

    // Generate all dates in the range
    const startDate = new Date(fechaDesde);
    const endDate = new Date(fechaHasta);
    const allDates = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      allDates.push(new Date(d));
    }

    // Map rawTendencias by date string
    const tendenciasMap = new Map();
    rawTendencias.forEach(item => {
      const dateStr = new Date(item.fecha).toISOString().split('T')[0];
      tendenciasMap.set(dateStr, item);
    });

    // Fill tendencias with all dates, using data or defaults
    const tendencias = allDates.map(date => {
      const dateStr = date.toISOString().split('T')[0];
      const item = tendenciasMap.get(dateStr);
      return {
        name: date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
        Asignados: item ? item.ticketsTotales : 0,
        Resueltos: item ? item.conteoResueltos : 0,
        Activos: item ? item.ticketsActivos : 0,
      };
    });

    const actividadRecienteFormatted = actividadReciente.map(ticket => ({
      eventId: ticket.id,
      ticketId: ticket.id,
      message: `Ticket: ${ticket.asunto} - ${formatTicketStatus(ticket.estado)}`,
      timestamp: ticket.creadoEn,
    }));

    return { resumen, metricas, distribucion, tendencias, actividadReciente: actividadRecienteFormatted, myMetrics, myQueues, currentKpis };
  }, [timeRange, dashboardData]);

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

  if (!derivedData) {
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

  const { resumen, metricas, distribucion, tendencias, actividadReciente, myMetrics, myQueues, currentKpis } = derivedData;

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Main Chart - Spans 2 columns */}
        <div className="lg:col-span-2">
          <SimpleBarChart
            data={tendencias}
            title="Tendencias de Trabajo"
            nameFormatter={formatTicketStatus}
          />
        </div>
      </div>

      {/* Pie Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PieChart
          data={distribucion.porEstado}
          title="Distribución por Estado"
          nameKey="estado"
          dataKey="count"
          nameFormatter={formatTicketStatus}
        />
        <PieChart
          data={distribucion.porPrioridad}
          title="Distribución por Prioridad"
          nameKey="prioridad"
          dataKey="count"
          nameFormatter={formatPriority}
        />
      </div>

      {/* Recent Activity */}
      <div className="mt-6">
        <h2 className="text-xl font-bold text-dt-foreground mb-4">Actividad Reciente</h2>
        <RecentActivityFeed activities={actividadReciente} />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
