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

/**
 * Updates a user by ID.
 * @param {string} userId - The ID of the user to update.
 * @param {object} updates - The fields to update.
 * @returns {Promise<object>} - Updated user data.
 */
export const updateUser = async (userId, updates) => {
  const { data } = await apiClient.patch(`/users/${userId}`, updates);
  return data;
};

/**
 * Request a magic link to be sent to the given email.
 * The backend will call Supabase Admin API using the service_role key.
 * @param {string} email
 * @param {string} [redirectTo] - Optional: where Supabase should redirect after verification (frontend callback)
 */
export const sendMagicLink = async (email, redirectTo) => {
  const payload = { email };
  if (redirectTo) payload.redirectTo = redirectTo;
  const { data } = await apiClient.post('/auth/magic-link', payload);
  return data;
};

/**
 * Change or set password for a user (requires authentication)
 * @param {string} userId
 * @param {string} newPassword
 * @param {string} [currentPassword]
 */
export const changePassword = async (userId, newPassword, currentPassword) => {
  const payload = { userId, newPassword };
  if (currentPassword) payload.currentPassword = currentPassword;
  const { data } = await apiClient.post('/users/change-password', payload);
  return data;
};
