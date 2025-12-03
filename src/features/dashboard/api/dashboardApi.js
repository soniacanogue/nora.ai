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
export const getAgentDashboardData = async (agentId, timeRange = "today") => {
  if (!agentId) {
    console.error("getAgentDashboardData called without an agentId.");
    return Promise.reject(new Error("Agent ID is required."));
  }
  console.log(
    `Fetching dashboard data for agent: ${agentId}, timeRange: ${timeRange}...`,
  );

  try {
    const { data } = await apiClient.get(
      `/dashboards/agent?agentId=${agentId}&timeRange=${timeRange}`,
    );

    // Merge with defaults to ensure all expected properties exist
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
    // Log detailed error information for debugging
    console.error("Failed to fetch agent dashboard data:", error);
    if (error.status === 401) {
      console.warn("Agent dashboard: Authentication failed - token may be expired");
    } else if (error.status === 403) {
      console.warn("Agent dashboard: Access forbidden for this user");
    } else if (error.status >= 500) {
      console.warn("Agent dashboard: Server error - backend may be unavailable");
    }
    // Return default data on error to prevent UI from breaking
    return { ...defaultAgentDashboardData, _error: true, _errorStatus: error.status };
  }
};

/**
 * Fetches dashboard data for an admin.
 * @param {string} timeRange - 'today' or 'last7Days'
 * @returns {Promise<object>} A promise that resolves with the dashboard data.
 */
export const getAdminDashboardData = async (timeRange = "today") => {
  console.log(`Fetching admin dashboard data, timeRange: ${timeRange}...`);

  try {
    const { data } = await apiClient.get(
      `/dashboards/admin?timeRange=${timeRange}`,
    );

    // Merge with defaults to ensure all expected properties exist
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
    // Log detailed error information for debugging
    console.error("Failed to fetch admin dashboard data:", error);
    if (error.status === 401) {
      console.warn("Admin dashboard: Authentication failed - token may be expired");
    } else if (error.status === 403) {
      console.warn("Admin dashboard: Access forbidden for this user");
    } else if (error.status >= 500) {
      console.warn("Admin dashboard: Server error - backend may be unavailable");
    }
    // Return default data on error to prevent UI from breaking
    return { ...defaultAdminDashboardData, _error: true, _errorStatus: error.status };
  }
};