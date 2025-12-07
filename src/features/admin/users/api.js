// src/features/admin/users/api.js
import { apiClient } from "@/shared/lib/apiClient";

/**
 * UC-16: User Management API
 * Backend endpoints:
 * GET /users - List all users
 * POST /users - Create new user
 * GET /users/:id - Get user by ID
 * PATCH /users/:id - Update user
 * DELETE /users/:id - Delete user
 * GET /users/profile - Get current user profile
 * PATCH /users/profile - Update current user profile
 *
 * Missing endpoints (noted in analysis):
 * POST /users/change-password - Change password
 * POST /auth/forgot-password - Request password reset
 * POST /auth/reset-password - Reset password with token
 */

export const usersApi = {
  /**
   * Fetch all users
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Array>} List of users
   */
  getAll: async (filters = {}) => {
    const response = await apiClient.get("/users", { params: filters });
    return response.data;
  },

  /**
   * Get a single user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object>} User object
   */
  getById: async (id) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  /**
   * Create a new user
   * @param {Object} data - User data
   * @param {string} data.nombre - User name
   * @param {string} data.correo - User email
   * @param {string} data.contrasena - User password
   * @param {string} data.rol - User role (ADMINISTRADOR, AGENTE, CLIENTE)
   * @param {boolean} data.activo - Active status (optional)
   * @returns {Promise<Object>} Created user
   */
  create: async (data) => {
    const response = await apiClient.post("/users", data);
    return response.data;
  },

  /**
   * Update an existing user
   * @param {string} id - User ID
   * @param {Object} data - Updated user data
   * @returns {Promise<Object>} Updated user
   */
  update: async (id, data) => {
    const response = await apiClient.patch(`/users/${id}`, data);
    return response.data;
  },

  /**
   * Delete a user
   * @param {string} id - User ID
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    await apiClient.delete(`/users/${id}`);
  },

  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile
   */
  getProfile: async () => {
    const response = await apiClient.get("/users/profile");
    return response.data;
  },

  /**
   * Update current user profile
   * @param {Object} data - Updated profile data
   * @returns {Promise<Object>} Updated profile
   */
  updateProfile: async (data) => {
    const response = await apiClient.patch("/users/profile", data);
    return response.data;
  },

  /**
   * Change password
   * TODO: Implement when backend endpoint is available
   * @param {Object} data - Password change data
   * @param {string} data.currentPassword - Current password
   * @param {string} data.newPassword - New password
   * @returns {Promise<void>}
   */
  changePassword: async (data) => {
    try {
      const response = await apiClient.post("/users/change-password", data);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error("Endpoint de cambio de contraseña no disponible");
      }
      throw error;
    }
  },
};
