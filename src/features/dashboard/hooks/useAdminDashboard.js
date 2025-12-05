// src/features/dashboard/hooks/useAdminDashboard.js
import { useQuery } from "@tanstack/react-query";
import { getAdminDashboardData } from "../api/dashboardApi";

/**
 * A hook to fetch and manage data for the admin dashboard.
 * @returns {{dashboardData: object|null, isLoading: boolean, error: string|null}}
 */
export const useAdminDashboard = (timeRange = "today") => {
  const {
    data: dashboardData = null,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["adminDashboard", timeRange],
    queryFn: () => getAdminDashboardData(timeRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return { dashboardData, isLoading, error: error ? error.message : null };
};
