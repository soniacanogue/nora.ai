// src/features/admin/audit-logs/api.js
import { apiClient } from "@/shared/lib/apiClient";

const CSV_MEDIA_TYPE = "text/csv;charset=utf-8";
const FALLBACK_HEADERS = ["id", "usuario", "accion", "detalle", "creadoEn"];

const extractLogRows = (payload) => {
  if (Array.isArray(payload)) return payload;

  const candidateKeys = ["items", "data", "logs", "records", "results"];
  for (const key of candidateKeys) {
    if (Array.isArray(payload?.[key])) {
      return payload[key];
    }
  }

  if (Array.isArray(payload?.data?.items)) {
    return payload.data.items;
  }

  return [];
};

const buildCsvFromLogs = (rows = []) => {
  const headerSet = new Set();
  rows.forEach((row) => {
    if (row && typeof row === "object") {
      Object.keys(row).forEach((key) => headerSet.add(key));
    }
  });

  const headers = headerSet.size > 0 ? Array.from(headerSet) : FALLBACK_HEADERS;
  const lines = [headers.join(",")];

  rows.forEach((row = {}) => {
    const values = headers.map((header) => formatCsvValue(row[header]));
    lines.push(values.join(","));
  });

  return lines.join("\n");
};

const formatCsvValue = (value) => {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString();

  const normalizedValue = typeof value === "object" ? JSON.stringify(value) : String(value);

  if (/[",\n]/.test(normalizedValue)) {
    return `"${normalizedValue.replace(/"/g, '""')}"`;
  }

  return normalizedValue;
};

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
    const response = await apiClient.get("/audit/logs", { params });
    return response.data;
  },

  /**
   * Export audit logs to CSV
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise<Blob>} CSV file blob
   */
  exportToCSV: async (params = {}) => {
    const response = await apiClient.get("/audit/logs", { params });
    const rows = extractLogRows(response.data);
    const csvContent = buildCsvFromLogs(rows);
    return new Blob([csvContent], { type: CSV_MEDIA_TYPE });
  },
};
