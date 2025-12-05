// src/features/admin/templates/hooks.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from "./api";

const TEMPLATES_QUERY_KEY = "templates";

export const useTemplates = (sort = { key: "nombre", order: "asc" }) => {
  return useQuery({
    queryKey: [TEMPLATES_QUERY_KEY, sort],
    queryFn: () => getTemplates({}, sort),
    staleTime: 5 * 60 * 1000,
  });
};

export const useTemplate = (id) => {
  return useQuery({
    queryKey: [TEMPLATES_QUERY_KEY, id],
    queryFn: () => getTemplateById(id),
    enabled: !!id,
  });
};

export const useCreateTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TEMPLATES_QUERY_KEY] });
    },
  });
};

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTemplate,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [TEMPLATES_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [TEMPLATES_QUERY_KEY, variables.id],
      });
    },
  });
};

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TEMPLATES_QUERY_KEY] });
    },
  });
};
