// src/features/admin/integrations/hooks.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { integrationsApi } from "./api";

/**
 * React Query hooks for Integrations Management (UC-18)
 */

const INTEGRATIONS_QUERY_KEY = "integrations";

/**
 * Hook to fetch all integrations
 */
export const useIntegrations = () => {
  return useQuery({
    queryKey: [INTEGRATIONS_QUERY_KEY],
    queryFn: integrationsApi.getAll,
  });
};

/**
 * Hook to fetch a single integration by ID
 */
export const useIntegration = (id) => {
  return useQuery({
    queryKey: [INTEGRATIONS_QUERY_KEY, id],
    queryFn: () => integrationsApi.getById(id),
    enabled: !!id,
  });
};

/**
 * Hook to create a new integration
 */
export const useCreateIntegration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: integrationsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INTEGRATIONS_QUERY_KEY] });
    },
  });
};

/**
 * Hook to update an existing integration
 */
export const useUpdateIntegration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => integrationsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [INTEGRATIONS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [INTEGRATIONS_QUERY_KEY, variables.id],
      });
    },
  });
};

/**
 * Hook to delete an integration
 */
export const useDeleteIntegration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: integrationsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INTEGRATIONS_QUERY_KEY] });
    },
  });
};

/**
 * Hook to test an integration connection
 */
export const useTestIntegration = () => {
  return useMutation({
    mutationFn: integrationsApi.test,
  });
};

/**
 * Hook to get integration logs
 */
export const useIntegrationLogs = (id) => {
  return useQuery({
    queryKey: [INTEGRATIONS_QUERY_KEY, id, "logs"],
    queryFn: () => integrationsApi.getLogs(id),
    enabled: !!id,
    retry: false, // Don't retry if endpoint doesn't exist
  });
};
