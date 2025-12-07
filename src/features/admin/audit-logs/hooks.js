// src/features/admin/audit-logs/hooks.js
import { useQuery } from "@tanstack/react-query";
import { auditLogsApi } from "./api";

/**
 * React Query hooks for Audit Logs (UC-22)
 */

const AUDIT_LOGS_QUERY_KEY = "audit-logs";

/**
 * Hook to fetch audit logs with filters
 * @param {Object} filters - Filter parameters
 * @returns {Object} Query result
 */
export const useAuditLogs = (filters = {}) => {
  return useQuery({
    queryKey: [AUDIT_LOGS_QUERY_KEY, filters],
    queryFn: () => auditLogsApi.getAll(filters),
    keepPreviousData: true, // Keep showing previous data while fetching new page
  });
};

/**
 * Hook to export audit logs to CSV
 * Note: This is a utility function, not a React Query hook
 * @param {Object} filters - Filter parameters
 * @returns {Promise<void>}
 */
export const exportAuditLogs = async (filters = {}) => {
  try {
    const blob = await auditLogsApi.exportToCSV(filters);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    throw error;
  }
};
