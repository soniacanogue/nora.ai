// src/pages/DashboardPage.jsx
import React from 'react';
import AppLayout from '../layouts/AppLayout';
import StatCard from '../components/dashboard/StatCard';
import QueueLinkCard from '../components/dashboard/QueueLinkCard';

// Datos falsos para el dashboard del agente
const agentMetrics = {
  resolvedToday: 12,
  assigned: 8,
  avgResponseTime: '15m 30s',
};

const agentQueues = {
  forTriage: 4, // Corresponde a los tickets 'sugerido' y 'nuevo'
  escalated: 2,
};

const DashboardPage = () => {
  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Hola, Brenda 👋</h1>
        <p className="text-subtle mt-1">Este es el resumen de tu actividad de hoy.</p>
      </div>

      {/* Sección de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Mis Tickets Resueltos (Hoy)" value={agentMetrics.resolvedToday} icon="✅" />
        <StatCard title="Mis Tickets Asignados" value={agentMetrics.assigned} icon="📁" />
        <StatCard title="Mi Tiempo Promedio de Respuesta" value={agentMetrics.avgResponseTime} icon="⏱️" />
      </div>

      {/* Sección de Colas de Trabajo */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Mis Colas de Trabajo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <QueueLinkCard 
            title="Tickets para Triaje"
            count={agentQueues.forTriage}
            linkTo="/tickets"
            description="Nuevos tickets y sugerencias de Nora AI por revisar."
          />
          <QueueLinkCard 
            title="Mis Tickets Escalados"
            count={agentQueues.escalated}
            linkTo="/tickets?status=escalated" // Futura funcionalidad de filtrado
            description="Casos complejos que requieren tu atención manual."
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;