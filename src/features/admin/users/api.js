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
 * POST /users/change-password - Change password
 * POST /auth/forgot-password - Request password reset email
 * POST /auth/reset-password - Reset password with token
 */

export const usersApi = {
  /**
   * Fetch all users
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Array>} List of users
   */
  getAll: async (filters = {}) => {
    const { data } = await apiClient.get("/users", { params: filters });

    let arr = [];
    let pagination = null;

    if (Array.isArray(data)) {
      arr = data;
    } else if (data && Array.isArray(data.data)) {
      arr = data.data;
      pagination = data.pagination || null;
    }

    const mapped = arr.map((u) => ({
      ...u,
    }));

    try {
      Object.defineProperty(mapped, "pagination", {
        value: pagination,
        enumerable: false,
        writable: false,
      });
    } catch {
      mapped.pagination = pagination;
    }

    return mapped;
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
   * Change password for a user (admin only)
   * @param {Object} data - Password change data
   * @param {string} data.userId - Target user ID
   * @param {string} [data.currentPassword] - Optional current password (self service)
   * @param {string} data.newPassword - New password to apply
   * @param {boolean} [data.force] - Force reset even without current password
   * @returns {Promise<Object>}
   */
  changePassword: async (data = {}) => {
    if (!data.userId) {
      throw new Error("userId es requerido para cambiar la contraseña");
    }
    if (!data.newPassword) {
      throw new Error("newPassword es requerido para cambiar la contraseña");
    }

    const payload = {
      userId: data.userId,
      newPassword: data.newPassword,
      currentPassword: data.currentPassword,
      force: data.force,
    };

    const response = await apiClient.post("/users/change-password", payload);
    return response.data;
  },

  /**
   * Request password reset email/token (Supabase bridge)
   * @param {Object} data
   * @param {string} data.email - User email to recover (alias: correo)
   * @param {string} [data.redirectTo] - Optional redirect URL for Supabase email link
   * @returns {Promise<Object>}
   */
  requestPasswordReset: async (data = {}) => {
    const email = data.email || data.correo;
    if (!email) {
      throw new Error("email es requerido para enviar el correo de recuperación");
    }

    const payload = {
      email,
      redirectTo: data.redirectTo,
    };

    const response = await apiClient.post("/auth/forgot-password", payload);
    return response.data;
  },

  /**
   * Reset password with token (admin/manual flow)
   * @param {Object} data
   * @param {string} data.email - User email associated with the token (alias: correo)
   * @param {string} data.token - Reset token provided by backend/Supabase
   * @param {string} data.newPassword - New password to set
   * @returns {Promise<Object>}
   */
  resetPasswordWithToken: async (data = {}) => {
    const email = data.email || data.correo;
    if (!email) {
      throw new Error("email es requerido para aplicar el token de recuperación");
    }
    if (!data.token) {
      throw new Error("token es requerido para aplicar el restablecimiento");
    }
    if (!data.newPassword) {
      throw new Error("newPassword es requerido para aplicar el restablecimiento");
    }

    const payload = {
      email,
      token: data.token,
      newPassword: data.newPassword,
    };

    const response = await apiClient.post("/auth/reset-password", payload);
    return response.data;
  },
};
