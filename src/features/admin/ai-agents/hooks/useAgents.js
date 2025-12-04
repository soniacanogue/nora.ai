// src/features/admin/ai-agents/hooks/useAgents.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAgents,
  getAgentById,
  createAgent,
  updateAgent,
  deleteAgent,
} from "../api";

const AGENTS_QUERY_KEY = "agents";

// Hook para obtener todos los agentes, con soporte para ordenamiento
export const useAgents = (sort = { key: "nombre", order: "asc" }) => {
  return useQuery({
    // La queryKey incluye el ordenamiento para que sea única, como en useTickets
    queryKey: [AGENTS_QUERY_KEY, sort],
    queryFn: () => getAgents({}, sort),
    staleTime: 60 * 1000, // 1 minuto de cache, igual que en useTickets
  });
};

// Hook para obtener un agente por su ID
export const useAgent = (id) => {
  return useQuery({
    queryKey: [AGENTS_QUERY_KEY, id],
    queryFn: () => getAgentById(id),
    enabled: !!id,
  });
};

// Hooks de mutación para CUD (Create, Update, Delete)
export const useCreateAgent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [AGENTS_QUERY_KEY] });
    },
  });
};

export const useUpdateAgent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAgent,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [AGENTS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [AGENTS_QUERY_KEY, variables.id],
      });
    },
  });
};

export const useDeleteAgent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [AGENTS_QUERY_KEY] });
    },
  });
};
