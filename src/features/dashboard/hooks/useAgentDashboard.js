// src/features/dashboard/hooks/useAgentDashboard.js
import { useQuery } from "@tanstack/react-query";
import { getAgentDashboardData } from "../api/dashboardApi";

/**
 * A hook to fetch and manage data for an agent's dashboard.
 * @param {string} agentId - The ID of the agent whose dashboard data is to be fetched.
 * @returns {{dashboardData: object|null, isLoading: boolean, error: string|null}}
 */
export const useAgentDashboard = (agentId) => {
  const {
    data: dashboardData = null,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["agentDashboard", agentId],
    queryFn: () => getAgentDashboardData(agentId),
    enabled: !!agentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return { dashboardData, isLoading, error: error ? error.message : null };
};
