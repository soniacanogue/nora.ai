// src/features/admin/users/hooks.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "./api";

/**
 * React Query hooks for Users Management (UC-16)
 */

const USERS_QUERY_KEY = "users";

/**
 * Hook to fetch all users
 */
export const useUsers = (filters = {}) => {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, filters],
    queryFn: () => usersApi.getAll(filters),
  });
};

/**
 * Hook to fetch a single user by ID
 */
export const useUser = (id) => {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, id],
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
  });
};

/**
 * Hook to create a new user
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    },
  });
};

/**
 * Hook to update an existing user
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => usersApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [USERS_QUERY_KEY, variables.id],
      });
      // A user update might include changing the role of the currently
      // authenticated user. Ensure we also invalidate the profile cache
      // so UI reacts immediately when an admin edits their own role.
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });
};

/**
 * Hook to delete a user
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    },
  });
};

/**
 * Hook to get current user profile
 */
export const useUserProfile = () => {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: usersApi.getProfile,
  });
};

/**
 * Hook to update current user profile
 */
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });
};

/**
 * Hook to change password
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: usersApi.changePassword,
  });
};

/**
 * Hook to request password reset token/email
 */
export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: usersApi.requestPasswordReset,
  });
};

/**
 * Hook to reset password with admin/token flow
 */
export const useResetPasswordWithToken = () => {
  return useMutation({
    mutationFn: usersApi.resetPasswordWithToken,
  });
};
