// src/features/auth/api/authApi.js

import { apiClient } from "@/shared/lib/apiClient";

/**
 * Authenticates a user with email and password.
 * @param {string} email - User email.
 * @param {string} password - User password.
 * @returns {Promise<{token: string, user: object}>}
 */
export const login = async (email, password) => {
  const { data } = await apiClient.post("/auth/login", { email, password });
  return data;
};

/**
 * Fetches the profile of the currently authenticated user.
 * @returns {Promise<object>} - User profile data.
 */
export const getProfile = async () => {
  const { data } = await apiClient.get("/users/profile");
  return data;
};

/**
 * Fetches a list of all users (agents/admins).
 * @returns {Promise<Array>} - List of users.
 */
export const getUsers = async () => {
  const { data } = await apiClient.get("/users");
  return Array.isArray(data) ? data : [];
};

/**
 * Fetches a single user by ID.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<object>} - User profile data.
 */
export const getUserById = async (userId) => {
  const { data } = await apiClient.get(`/users/${userId}`);
  return data;
};
