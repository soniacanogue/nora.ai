// src/features/dashboard/api/dashboardApi.js
import { mockTickets } from "@/data/mockTickets";
import { mockUsuarios } from "@/data/mockUsuarios";
import { mockLogEventos } from "@/data/mockLogEventos"; // 1. Importar los eventos

/**
 * Filters tickets by date range
 * @param {Array} tickets - Array of tickets to filter
 * @param {string} timeRange - 'today' or 'thisWeek'
 * @returns {Array} - Filtered tickets
 */
const filterTicketsByDateRange = (tickets, timeRange) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  return tickets.filter((ticket) => {
    const ticketDate = new Date(ticket.creadoEn);
    const ticketDateOnly = new Date(
      ticketDate.getFullYear(),
      ticketDate.getMonth(),
      ticketDate.getDate()
    );

    if (timeRange === "today") {
      return ticketDateOnly.getTime() === today.getTime();
    } else if (timeRange === "thisWeek") {
      // Get date 7 days ago
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      
      return (
        ticketDateOnly.getTime() >= sevenDaysAgo.getTime() &&
        ticketDateOnly.getTime() <= today.getTime()
      );
    }
    return true;
  });
};

/**
 * Generates mock dashboard data for a specific agent.
 * @param {string} agentId - The UUID of the agent.
 * @param {string} timeRange - 'today' or 'thisWeek'
 * @returns {object} - The aggregated dashboard data for the agent.
 */
const generateAgentDashboardData = (agentId, timeRange = "today") => {
  // Filter tickets by time range
  const filteredTickets = filterTicketsByDateRange(mockTickets, timeRange);
  console.log(filteredTickets)
  // Logic from mockAgentDashboard.js
  const myResolvedToday = filteredTickets.filter(
    (t) => t.assigneeId === agentId && t.estado === "cerrado",
  ).length;

  const myAssigned = filteredTickets.filter(
    (t) =>
      t.assigneeId === agentId &&
      t.estado !== "cerrado" &&
      t.estado !== "fusionado",
  ).length;

  // Calculate metrics based on filtered data
  const myResolvedThisWeek = filteredTickets.filter(
    (t) => t.assigneeId === agentId && t.estado === "cerrado",
  ).length;
  const myAssignedThisWeek = filteredTickets.filter(
    (t) =>
      t.assigneeId === agentId &&
      t.estado !== "cerrado" &&
      t.estado !== "fusionado",
  ).length;

  const forTriageCount = filteredTickets.filter(
    (t) => t.estado === "ia_sugerido",
  ).length;
  const myEscalatedCount = filteredTickets.filter(
    (t) => t.assigneeId === agentId && t.estado === "en_progreso_nivel_2",
  ).length;
  const reopenedCount = filteredTickets.filter(
    (t) => t.assigneeId === agentId && t.estado === "reabierto",
  ).length;
  const customerRepliedCount = filteredTickets.filter(
    (t) => t.assigneeId === agentId && t.estado === "respuesta_cliente",
  ).length;
  const waitingForCustomerCount = filteredTickets.filter(
    (t) => t.assigneeId === agentId && t.estado === "esperando_cliente",
  ).length;

  // Aggregate tickets by status for the agent
  const myTicketsByStatus = filteredTickets
    .filter(
      (t) =>
        t.assigneeId === agentId &&
        t.estado !== "cerrado" &&
        t.estado !== "fusionado",
    )
    .reduce((acc, ticket) => {
      const status = ticket.estado;
      const existing = acc.find((item) => item.status === status);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ status, count: 1 });
      }
      return acc;
    }, []);

  // --- 2. NUEVA LÓGICA PARA ACTIVIDAD RECIENTE ---
  // Ahora se basa en mockLogEventos para mayor precisión.
  const recentActivity = mockLogEventos
    .filter(
      (evento) =>
        evento.agenteId === agentId || // Eventos directamente para el agente
        (evento.tipo === "NUEVO_TICKET_IA" && // O nuevos tickets para triaje
          mockUsuarios.find((u) => u.id === agentId)?.rol === "AGENTE"), // Asumiendo que Brenda es AGENTE
    )
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Ordenar por más reciente
    .slice(0, 5) // Tomar los últimos 5
    .map((evento) => ({
      eventId: evento.id,
      ticketId: evento.ticketId,
      message: evento.metadata.mensaje,
      timestamp: evento.timestamp,
    }));
  // --- FIN DE LA NUEVA LÓGICA ---

  return {
    // Updated structure with nested today/thisWeek
    myMetrics: {
      today: {
        resolved: filteredTickets.filter(
          (t) => t.assigneeId === agentId && t.estado === "cerrado",
        ).length,
        assigned: filteredTickets.filter(
          (t) =>
            t.assigneeId === agentId &&
            t.estado !== "cerrado" &&
            t.estado !== "fusionado",
        ).length,
        avgResponseTime: "18m 25s",
      },
      thisWeek: {
        resolved: filteredTickets.filter(
          (t) => t.assigneeId === agentId && t.estado === "cerrado",
        ).length,
        assigned: filteredTickets.filter(
          (t) =>
            t.assigneeId === agentId &&
            t.estado !== "cerrado" &&
            t.estado !== "fusionado",
        ).length,
        avgResponseTime: "22m 10s",
      },
    },
    // Keep old structure for backward compatibility during transition
    myMetricsToday: {
      resolved: filteredTickets.filter(
        (t) => t.assigneeId === agentId && t.estado === "cerrado",
      ).length,
      assigned: filteredTickets.filter(
        (t) =>
          t.assigneeId === agentId &&
          t.estado !== "cerrado" &&
          t.estado !== "fusionado",
      ).length,
      avgResponseTime: "18m 25s",
    },
    myQueues: {
      forTriage: forTriageCount,
      myEscalated: myEscalatedCount,
      reopened: reopenedCount,
      customerReplied: customerRepliedCount,
      waitingForCustomer: waitingForCustomerCount,
    },
    myTicketsByStatus,
    recentActivity:
      recentActivity.length > 0
        ? recentActivity
        : [
            {
              eventId: "evt-1",
              ticketId: null,
              message: "No hay actividad reciente",
              timestamp: new Date().toISOString(),
            },
          ],
  };
};

/**
 * Simulates fetching dashboard data for a specific agent.
 * @param {string} agentId - The ID of the agent for whom to fetch data.
 * @param {string} timeRange - 'today' or 'thisWeek'
 * @returns {Promise<object>} A promise that resolves with the dashboard data.
 */
export const getAgentDashboardData = async (agentId, timeRange = "today") => {
  if (!agentId) {
    console.error("getAgentDashboardData MOCK called without an agentId.");
    return Promise.reject(new Error("Agent ID is required."));
  }
  console.log(`Fetching MOCKED dashboard data for agent: ${agentId}, timeRange: ${timeRange}...`);
  await new Promise((resolve) => setTimeout(resolve, 500));
  const agentData = generateAgentDashboardData(agentId, timeRange);
  return Promise.resolve(agentData);
};

/**
 * Generates aggregated data for the admin dashboard.
 */
const generateAdminDashboardData = (timeRange = "today") => {
  // Filter tickets by time range
  const filteredTickets = filterTicketsByDateRange(mockTickets, timeRange);
  
  // Logic from mockAdminDashboard.js
  const kpis = {
    today: {
      created: filteredTickets.length,
      resolved: filteredTickets.filter((t) => t.estado === "cerrado").length,
      avgFirstResponseTime: 15,
      avgResolutionTime: 120,
    },
    last7Days: {
      created: filteredTickets.length,
      resolved: filteredTickets.filter((t) => t.estado === "cerrado").length,
      avgFirstResponseTime: 25,
      avgResolutionTime: 180,
    },
  };

  const workload = filteredTickets.reduce((acc, ticket) => {
    const status = ticket.estado;
    const existing = acc.find((item) => item.status === status);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ status, count: 1 });
    }
    return acc;
  }, []);

  const teamPerformance = mockUsuarios
    .filter((u) => u.rol === "AGENTE")
    .map((agent) => ({
      assigneeId: agent.id,
      agentName: agent.nombre,
      assigned: filteredTickets.filter(
        (t) => t.assigneeId === agent.id && t.estado !== "cerrado",
      ).length,
      resolvedToday: filteredTickets.filter(
        (t) => t.assigneeId === agent.id && t.estado === "cerrado",
      ).length,
    }));

  const distributionByChannel = filteredTickets.reduce((acc, ticket) => {
    const channel = ticket.canalOrigen;
    const existing = acc.find((item) => item.channel === channel);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ channel, count: 1 });
    }
    return acc;
  }, []);

  const distributionByTag = filteredTickets.reduce((acc, ticket) => {
    const tagName = ticket.etiquetas?.[0]?.nombre || "Sin Etiqueta";
    const existing = acc.find((item) => item.tag === tagName);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ tag: tagName, count: 1 });
    }
    return acc;
  }, []);

  return {
    kpis,
    workload,
    teamPerformance,
    distribution: {
      byChannel: distributionByChannel,
      byTag: distributionByTag,
    },
  };
};

/**
 * Simulates fetching dashboard data for an admin.
 * @param {string} timeRange - 'today' or 'last7Days'
 * @returns {Promise<object>} A promise that resolves with the dashboard data.
 */
export const getAdminDashboardData = async (timeRange = "today") => {
  console.log(`Fetching MOCKED admin dashboard data, timeRange: ${timeRange}...`);
  await new Promise((resolve) => setTimeout(resolve, 500));
  const adminData = generateAdminDashboardData(timeRange);
  return Promise.resolve(adminData);
};