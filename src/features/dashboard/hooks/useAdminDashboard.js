// src/features/dashboard/hooks/useAdminDashboard.js
import { useState, useEffect } from "react";
import { getAdminDashboardData } from "../api/dashboardApi";

/**
 * A hook to fetch and manage data for the admin dashboard.
 * @returns {{dashboardData: object|null, isLoading: boolean, error: string|null}}
 */
export const useAdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getAdminDashboardData();
        setDashboardData(data);
      } catch (err) {
        setError(err.message || "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return { dashboardData, isLoading, error };
};
