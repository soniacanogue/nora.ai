// src/features/admin/integrations/api.js
import { apiClient } from "@/shared/lib/apiClient";

const normalizeLogResponse = (payload = {}) => {
  const dataArray = Array.isArray(payload)
    ? payload
    : Array.isArray(payload.data)
      ? payload.data
      : Array.isArray(payload.logs)
        ? payload.logs
        : [];

  const pagination = payload.pagination || {
    page: payload.page ?? 1,
    limit: payload.limit ?? dataArray.length,
    total: payload.total ?? dataArray.length,
  };

  return {
    data: dataArray,
    pagination,
  };
};

/**
 * UC-18: Integrations Management API
 * Backend endpoints:
 * GET /integrations - List all integrations
 * POST /integrations - Create new integration
 * GET /integrations/:id - Get integration by ID
 * PATCH /integrations/:id - Update integration
 * DELETE /integrations/:id - Delete integration
 *
 * POST /integrations/:id/test - Test integration connection
 * GET /integrations/:id/logs - Get integration logs
 */

export const integrationsApi = {
  /**
   * Fetch all integrations
   * @returns {Promise<Array>} List of integrations
   */
  getAll: async () => {
    const response = await apiClient.get("/integrations");
    return response.data;
  },

  /**
   * Get a single integration by ID
   * @param {string} id - Integration ID
   * @returns {Promise<Object>} Integration object
   */
  getById: async (id) => {
    const response = await apiClient.get(`/integrations/${id}`);
    return response.data;
  },

  /**
   * Create a new integration
   * @param {Object} data - Integration data
   * @param {string} data.nombre - Integration name
   * @param {string} data.claveApiEnc - Encrypted API key
   * @param {string} data.endpoint - API endpoint URL (optional)
   * @param {string} data.urlWebhook - Webhook URL (optional)
   * @param {Object} data.configJson - Additional configuration (optional)
   * @param {boolean} data.activo - Active status (optional, default true)
   * @returns {Promise<Object>} Created integration
   */
  create: async (data) => {
    const response = await apiClient.post("/integrations", data);
    return response.data;
  },

  /**
   * Update an existing integration
   * @param {string} id - Integration ID
   * @param {Object} data - Updated integration data
   * @returns {Promise<Object>} Updated integration
   */
  update: async (id, data) => {
    const response = await apiClient.patch(`/integrations/${id}`, data);
    return response.data;
  },

  /**
   * Delete an integration
   * @param {string} id - Integration ID
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    await apiClient.delete(`/integrations/${id}`);
  },

  /**
   * Test integration connection (if endpoint exists)
   * TODO: Implement when backend endpoint is available
   * @param {string} id - Integration ID
   * @returns {Promise<Object>} Test result
   */
  test: async (id) => {
    try {
      const response = await apiClient.post(`/integrations/${id}/test`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error("Endpoint de prueba no disponible en el backend");
      }
      throw error;
    }
  },

  /**
   * Get integration logs (if endpoint exists)
   * TODO: Implement when backend endpoint is available
   * @param {string} id - Integration ID
   * @returns {Promise<Array>} Integration logs
   */
  getLogs: async (id, params = {}) => {
    const response = await apiClient.get(`/integrations/${id}/logs`, {
      params,
    });
    return normalizeLogResponse(response.data);
  },
};
