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
