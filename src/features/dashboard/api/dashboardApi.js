// src/features/dashboard/api/dashboardApi.js
import { apiClient } from "@/shared/lib/apiClient";

// Default values for fallback when API returns errors
const defaultAgentDashboardData = {
  myMetrics: {
    today: {
      resolved: 0,
      assigned: 0,
      avgResponseTime: "0m 0s",
    },
    thisWeek: {
      resolved: 0,
      assigned: 0,
      avgResponseTime: "0m 0s",
    },
  },
  myMetricsToday: {
    resolved: 0,
    assigned: 0,
    avgResponseTime: "0m 0s",
  },
  myQueues: {
    forTriage: 0,
    myEscalated: 0,
    reopened: 0,
    customerReplied: 0,
    waitingForCustomer: 0,
  },
  myTicketsByStatus: [],
  recentActivity: [
    {
      eventId: "evt-empty",
      ticketId: null,
      message: "No hay actividad reciente",
      timestamp: new Date().toISOString(),
    },
  ],
};

const defaultAdminDashboardData = {
  kpis: {
    today: {
      created: 0,
      resolved: 0,
      avgFirstResponseTime: 0,
      avgResolutionTime: 0,
    },
    last7Days: {
      created: 0,
      resolved: 0,
      avgFirstResponseTime: 0,
      avgResolutionTime: 0,
    },
  },
  workload: [],
  teamPerformance: [],
  distribution: {
    byChannel: [],
    byTag: [],
  },
};

/**
 * Fetches dashboard data for a specific agent.
 * @param {string} agentId - The ID of the agent for whom to fetch data.
 * @param {string} timeRange - 'today' or 'thisWeek'
 * @returns {Promise<object>} A promise that resolves with the dashboard data.
 */

/**
 * Nueva versión: usa agenteId, fechaDesde, fechaHasta (ISO 8601) como requiere el backend.
 * @param {string} agenteId - UUID del agente (opcional, para admins/supervisores)
 * @param {string} fechaDesde - Fecha inicio (ISO 8601)
 * @param {string} fechaHasta - Fecha fin (ISO 8601)
 * @returns {Promise<object>}
 */
export const getAgentDashboardData = async ({ agenteId, fechaDesde, fechaHasta }) => {
  if (!fechaDesde || !fechaHasta) {
    throw new Error("Debe especificar fechaDesde y fechaHasta en formato ISO 8601");
  }
  const params = new URLSearchParams();
  if (agenteId) params.append("agenteId", agenteId);
  params.append("fechaDesde", fechaDesde);
  params.append("fechaHasta", fechaHasta);
  try {
    const { data } = await apiClient.get(`/dashboards/agent?${params.toString()}`);
    return {
      ...defaultAgentDashboardData,
      ...data,
      myMetrics: {
        ...defaultAgentDashboardData.myMetrics,
        ...(data.myMetrics || {}),
        today: {
          ...defaultAgentDashboardData.myMetrics.today,
          ...(data.myMetrics?.today || {}),
        },
        thisWeek: {
          ...defaultAgentDashboardData.myMetrics.thisWeek,
          ...(data.myMetrics?.thisWeek || {}),
        },
      },
      myQueues: {
        ...defaultAgentDashboardData.myQueues,
        ...(data.myQueues || {}),
      },
      myTicketsByStatus: data.myTicketsByStatus || [],
      recentActivity:
        data.recentActivity && data.recentActivity.length > 0
          ? data.recentActivity
          : defaultAgentDashboardData.recentActivity,
    };
  } catch (error) {
    console.error("Failed to fetch agent dashboard data:", error);
    return { ...defaultAgentDashboardData, _error: true, _errorStatus: error.status };
  }
};

/**
 * Fetches dashboard data for an admin.
 * @param {string} timeRange - 'today' or 'last7Days'
 * @returns {Promise<object>} A promise that resolves with the dashboard data.
 */

/**
 * Nueva versión: usa fechaDesde, fechaHasta, agenteId (opcional) como requiere el backend.
 * @param {Object} params
 * @param {string} params.fechaDesde - Fecha inicio (ISO 8601)
 * @param {string} params.fechaHasta - Fecha fin (ISO 8601)
 * @param {string} [params.agenteId] - UUID del agente (opcional)
 * @returns {Promise<object>}
 */
export const getAdminDashboardData = async ({ fechaDesde, fechaHasta, agenteId }) => {
  if (!fechaDesde || !fechaHasta) {
    throw new Error("Debe especificar fechaDesde y fechaHasta en formato ISO 8601");
  }
  const params = new URLSearchParams();
  params.append("fechaDesde", fechaDesde);
  params.append("fechaHasta", fechaHasta);
  if (agenteId) params.append("agenteId", agenteId);
  try {
    const { data } = await apiClient.get(`/dashboards/admin?${params.toString()}`);
    return {
      ...defaultAdminDashboardData,
      ...data,
      kpis: {
        ...defaultAdminDashboardData.kpis,
        ...(data.kpis || {}),
        today: {
          ...defaultAdminDashboardData.kpis.today,
          ...(data.kpis?.today || {}),
        },
        last7Days: {
          ...defaultAdminDashboardData.kpis.last7Days,
          ...(data.kpis?.last7Days || {}),
        },
      },
      workload: data.workload || [],
      teamPerformance: data.teamPerformance || [],
      distribution: {
        byChannel: data.distribution?.byChannel || [],
        byTag: data.distribution?.byTag || [],
      },
    };
  } catch (error) {
    console.error("Failed to fetch admin dashboard data:", error);
    return { ...defaultAdminDashboardData, _error: true, _errorStatus: error.status };
  }
};