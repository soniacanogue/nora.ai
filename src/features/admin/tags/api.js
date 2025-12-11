// src/features/admin/tags/api.js
import { apiClient } from "@/shared/lib/apiClient";

/**
 * UC-17: Tags Management API
 * Backend endpoints:
 * GET /tags - List all tags
 * POST /tags - Create new tag
 * GET /tags/:id - Get tag by ID
 * PATCH /tags/:id - Update tag
 * DELETE /tags/:id - Delete tag
 */

export const tagsApi = {
  /**
   * Fetch all tags
   * @returns {Promise<Array>} List of tags
   */
  getAll: async (params = {}) => {
    const response = await apiClient.get("/tags", { params });
    // Support responses that are either array or { data: [], pagination: {} }
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.data)) return data.data;
    return [];
  },

  /**
   * Get a single tag by ID
   * @param {string} id - Tag ID
   * @returns {Promise<Object>} Tag object
   */
  getById: async (id) => {
    const response = await apiClient.get(`/tags/${id}`);
    return response.data.data;
  },

  /**
   * Create a new tag
   * @param {Object} data - Tag data
   * @param {string} data.nombre - Tag name
   * @param {string} data.descripcion - Tag description (optional)
   * @param {string} data.color - Tag color (hex code)
   * @returns {Promise<Object>} Created tag
   */
  create: async (data) => {
    const response = await apiClient.post("/tags", data);
    return response.data.data;
  },

  /**
   * Update an existing tag
   * @param {string} id - Tag ID
   * @param {Object} data - Updated tag data
   * @returns {Promise<Object>} Updated tag
   */
  update: async (id, data) => {
    const response = await apiClient.patch(`/tags/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete a tag
   * @param {string} id - Tag ID
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    await apiClient.delete(`/tags/${id}`);
  },
};
