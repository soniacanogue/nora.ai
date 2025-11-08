import { useQuery } from "@tanstack/react-query";
import { getAgentDashboardData } from "../api/getAgentDashboardData";

import AppLayout from "@/shared/components/layout/AppLayout";
import StatCard from "../components/StatCard";
import QueueLinkCard from "../components/QueueLinkCard";
import RecentActivityFeed from "../components/RecentActivityFeed";
import SimpleBarChart from "../components/SimpleBarChart";
import DashboardSkeleton from "../components/DashboardSkeleton";
import React, { useState, useEffect } from "react";

const useAuth = () => ({
  // Devolvería el usuario logueado. Para el mock, devolvemos a Brenda.
  currentUser: {
    id: "c7b5a2e0-f2a8-4f7a-8b1e-9d2c5e6f8a3b",
    nombre: "Brenda Diaz",
    rol: "AGENTE",
  },
  isLoading: false,
});

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser?.id) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        // ¡Aquí está la clave! Pasamos el ID del usuario actual.
        const data = await getAgentDashboardData(currentUser.id);
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUser]); // El efecto se ejecuta cuando cambia el usuario

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!dashboardData) {
    return <div>No se encontraron datos.</div>;
  }
  return (
    <div>
      {/* ... (sección de saludo y métricas sin cambios) */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Hola, Brenda 👋</h1>
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
          value={myMetricsToday.avgResponseTime + "m"}
          icon="⏱️"
        />
      </div>

      {/* Grid principal que divide el dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Columna Izquierda (2/3 del ancho): Colas de Trabajo y Gráfica */}
        <div className="lg:col-span-2">
          {/* Gráfica de distribución de tickets */}
          <div className="mb-8">
            <SimpleBarChart />
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">
            Mis Colas de Trabajo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tarjetas de alta prioridad */}
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
            {/* Tarjetas de trabajo estándar */}
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

        {/* Columna Derecha (1/3 del ancho): Actividad Reciente */}
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
