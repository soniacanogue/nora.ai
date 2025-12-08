// src/features/dashboard/hooks/useAdminDashboard.js
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getAdminDashboardData } from "../api/dashboardApi";

/**
 * A hook to fetch and manage data for the admin dashboard.
 * @returns {{dashboardData: object|null, isLoading: boolean, error: string|null}}
 */
export const useAdminDashboard = (timeRange = "today") => {
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

  const { fechaDesde, fechaHasta } = useMemo(() => computeRange(timeRange), [timeRange]);

  const {
    data: dashboardData = null,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["adminDashboard", fechaDesde, fechaHasta],
    queryFn: () => getAdminDashboardData({ fechaDesde, fechaHasta }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return { dashboardData, isLoading, error: error ? error.message : null };
};
