// src/features/dashboard/hooks/useAgentDashboard.js
import { useQuery } from "@tanstack/react-query";
import { getAgentDashboardData } from "../api/dashboardApi";

/**
 * A hook to fetch and manage data for an agent's dashboard.
 * @param {string} agentId - The ID of the agent whose dashboard data is to be fetched.
 * @returns {{dashboardData: object|null, isLoading: boolean, error: string|null}}
 */
export const useAgentDashboard = (agentId, timeRange = "today") => {
  const computeRange = (range) => {
    const now = new Date();
    const fechaHasta = now.toISOString();
    if (range === "today") {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      return { fechaDesde: start.toISOString(), fechaHasta };
    }
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0);
    return { fechaDesde: start.toISOString(), fechaHasta };
  };

  const { fechaDesde, fechaHasta } = computeRange(timeRange);

  const {
    data: dashboardData = null,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["agentDashboard", agentId, fechaDesde, fechaHasta],
    queryFn: () => getAgentDashboardData({ agenteId: agentId, fechaDesde, fechaHasta }),
    enabled: !!agentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return { dashboardData, isLoading, error: error ? error.message : null };
};
