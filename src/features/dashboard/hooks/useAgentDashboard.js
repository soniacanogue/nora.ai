// src/features/dashboard/hooks/useAgentDashboard.js
import { useState, useEffect } from "react";
import { getAgentDashboardData } from "../api/dashboardApi";

/**
 * A hook to fetch and manage data for an agent's dashboard.
 * @deprecated This hook has been replaced by using `useQuery` from @tanstack/react-query directly.
 * Use `useQuery({ queryKey: ['agentDashboard', agentId], queryFn: () => getAgentDashboardData(agentId) })` instead.
 * @param {string} agentId - The ID of the agent whose dashboard data is to be fetched.
 * @returns {{dashboardData: object|null, isLoading: boolean, error: string|null}}
 */
export const useAgentDashboard = (agentId) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!agentId) {
      setIsLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getAgentDashboardData(agentId);
        setDashboardData(data);
      } catch (err) {
        setError(err.message || "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [agentId]);

  return { dashboardData, isLoading, error };
};
