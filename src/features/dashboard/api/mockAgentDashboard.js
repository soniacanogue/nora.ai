// src/features/dashboard/api/mockAgentDashboard.js

import { mockTickets } from "@/data/mockTickets";

/**
 * Genera datos de dashboard simulados para un agente específico.
 * @param {string} agentId - El UUID del agente para el que se generan los datos.
 * @returns {object} - Los datos agregados para el dashboard del agente.
 */
export const generateAgentDashboardData = (agentId) => {
  // Lógica de cálculo de métricas personales
  const myResolvedToday = mockTickets.filter(
    (t) => t.assigneeId === agentId && t.estado === "cerrado"
    // En una implementación real, aquí se filtraría por `resueltoEn` de hoy
  ).length;

  const myAssigned = mockTickets.filter(
    (t) =>
      t.assigneeId === agentId &&
      t.estado !== "cerrado" &&
      t.estado !== "fusionado"
  ).length;

  // Lógica de cálculo para las colas de trabajo
  const forTriageCount = mockTickets.filter(
    (t) => t.estado === "ia_sugerido"
  ).length;

  const myEscalatedCount = mockTickets.filter(
    (t) => t.assigneeId === agentId && t.estado === "en_progreso_nivel_2"
  ).length;

  const reopenedCount = mockTickets.filter(
    (t) => t.assigneeId === agentId && t.estado === "reabierto"
  ).length;

  const customerRepliedCount = mockTickets.filter(
    (t) => t.assigneeId === agentId && t.estado === "respuesta_cliente"
  ).length;

  const waitingForCustomerCount = mockTickets.filter(
    (t) => t.assigneeId === agentId && t.estado === "esperando_cliente"
  ).length;

  return {
    myMetricsToday: {
      resolved: myResolvedToday,
      assigned: myAssigned,
      avgResponseTime: "18m 25s", // Mantenemos este valor estático por simplicidad
    },
    myQueues: {
      forTriage: forTriageCount,
      myEscalated: myEscalatedCount,
      reopened: reopenedCount,
      customerReplied: customerRepliedCount,
      waitingForCustomer: waitingForCustomerCount,
    },
    // Este feed de actividad ahora es más realista y contextual a tus datos mock
    recentActivity: [
      {
        eventId: "evt-1",
        message: "Cliente respondió en Ticket #TICKET-006", // Refleja el estado 'respuesta_cliente'
        timestamp: "2023-10-28T09:00:00Z",
      },
      {
        eventId: "evt-2",
        message: "Sugerencia de Fusión lista en Ticket #TICKET-005", // Refleja el campo sugerenciaFusionId
        timestamp: "2023-10-27T14:01:00Z",
      },
      {
        eventId: "evt-3",
        message: "Ticket #TICKET-004 asignado a ti", // Refleja que Carlos es el assignee
        timestamp: "2023-10-25T09:15:00Z",
      },
    ],
  };
};

// Exportamos una instancia para un agente específico para facilitar la importación
// Por ejemplo, para Brenda Diaz
export const mockAgentDashboardData = generateAgentDashboardData(
  "c7b5a2e0-f2a8-4f7a-8b1e-9d2c5e6f8a3b"
);
