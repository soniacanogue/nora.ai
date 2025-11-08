import React from "react";
import StatCard from "../components/StatCard";
import SimpleBarChart from "../components/SimpleBarChart";
import AppLayout from "src/shared/components/layout/AppLayout";

// Datos falsos para el dashboard del admin
const globalMetrics = {
  ticketsCreatedToday: 27,
  ticketsResolvedToday: 21,
  avgResolutionTime: "2h 15m",
};

const AdminDashboardPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">
        Dashboard del Administrador
      </h1>

      {/* Métricas Globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Tickets Creados (Hoy)"
          value={globalMetrics.ticketsCreatedToday}
          icon="📈"
        />
        <StatCard
          title="Tickets Resueltos (Hoy)"
          value={globalMetrics.ticketsResolvedToday}
          icon="✔️"
        />
        <StatCard
          title="Tiempo Medio de Resolución"
          value={globalMetrics.avgResolutionTime}
          icon="⏳"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleBarChart />
        <div className="bg-primary p-6 rounded-lg border border-secondary">
          <h3 className="text-lg font-bold text-foreground mb-4">
            Distribución por Canal
          </h3>
          <p className="text-subtle">Próximamente: Gráfico de Pastel...</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
