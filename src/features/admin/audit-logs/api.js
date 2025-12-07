// src/features/admin/audit-logs/api.js
import { apiClient } from "@/shared/lib/apiClient";

/**
 * UC-22: Audit Logs API
 * Backend endpoint:
 * GET /audit - List audit log events
 */

export const auditLogsApi = {
  /**
   * Fetch audit log events
   * @param {Object} params - Query parameters for filtering
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.startDate - Start date filter (ISO string)
   * @param {string} params.endDate - End date filter (ISO string)
   * @param {string} params.userId - Filter by user ID
   * @param {string} params.action - Filter by action type
   * @param {string} params.resource - Filter by resource type
   * @param {string} params.search - Search in log messages
   * @returns {Promise<Object>} Paginated audit logs
   */
  getAll: async (params = {}) => {
    const response = await apiClient.get("/audit", { params });
    return response.data;
  },

  /**
   * Export audit logs to CSV
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise<Blob>} CSV file blob
   */
  exportToCSV: async (params = {}) => {
    try {
      const response = await apiClient.get("/audit/export", {
        params,
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      // If endpoint doesn't exist, client-side export will be used
      if (error.response?.status === 404) {
        throw new Error("Endpoint de exportación no disponible");
      }
      throw error;
    }
  },
};
