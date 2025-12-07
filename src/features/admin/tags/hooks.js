// src/features/admin/tags/hooks.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tagsApi } from "./api";

/**
 * React Query hooks for Tags Management (UC-17)
 */

const TAGS_QUERY_KEY = "tags";

/**
 * Hook to fetch all tags
 */
export const useTags = () => {
  return useQuery({
    queryKey: [TAGS_QUERY_KEY],
    queryFn: tagsApi.getAll,
  });
};

/**
 * Hook to fetch a single tag by ID
 */
export const useTag = (id) => {
  return useQuery({
    queryKey: [TAGS_QUERY_KEY, id],
    queryFn: () => tagsApi.getById(id),
    enabled: !!id,
  });
};

/**
 * Hook to create a new tag
 */
export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tagsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TAGS_QUERY_KEY] });
    },
  });
};

/**
 * Hook to update an existing tag
 */
export const useUpdateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => tagsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [TAGS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [TAGS_QUERY_KEY, variables.id],
      });
    },
  });
};

/**
 * Hook to delete a tag
 */
export const useDeleteTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tagsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TAGS_QUERY_KEY] });
    },
  });
};
