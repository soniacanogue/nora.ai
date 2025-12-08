import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getKnowledgeBaseDocs,
  getKnowledgeBaseDoc,
  createKnowledgeBaseDoc,
  updateKnowledgeBaseDoc,
  deleteKnowledgeBaseDoc,
  searchKnowledgeBase,
  getKnowledgeBaseCategories,
} from "../api";

/**
 * Hook to fetch all knowledge base documents
 */
export const useKnowledgeBaseDocs = (filters = {}) => {
  return useQuery({
    queryKey: ["knowledgeBase", filters],
    queryFn: () => getKnowledgeBaseDocs(filters),
    keepPreviousData: true,
  });
};

/**
 * Hook to fetch a single knowledge base document
 */
export const useKnowledgeBaseDoc = (id) => {
  return useQuery({
    queryKey: ["knowledgeBase", id],
    queryFn: () => getKnowledgeBaseDoc(id),
    enabled: !!id,
  });
};

/**
 * Hook to create a new knowledge base document
 */
export const useCreateKnowledgeBaseDoc = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createKnowledgeBaseDoc,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledgeBase"] });
      queryClient.invalidateQueries({ queryKey: ["knowledgeBase", "categories"] });
      toast.success("Documento creado exitosamente");
    },
    onError: (error) => {
      toast.error(`Error al crear documento: ${error.message}`);
    },
  });
};

/**
 * Hook to update a knowledge base document
 */
export const useUpdateKnowledgeBaseDoc = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => updateKnowledgeBaseDoc(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["knowledgeBase"] });
      queryClient.invalidateQueries({
        queryKey: ["knowledgeBase", variables.id],
      });
      toast.success("Documento actualizado exitosamente");
    },
    onError: (error) => {
      toast.error(`Error al actualizar documento: ${error.message}`);
    },
  });
};

/**
 * Hook to delete a knowledge base document
 */
export const useDeleteKnowledgeBaseDoc = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteKnowledgeBaseDoc,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledgeBase"] });
      toast.success("Documento eliminado exitosamente");
    },
    onError: (error) => {
      toast.error(`Error al eliminar documento: ${error.message}`);
    },
  });
};

/**
 * Hook to search knowledge base documents
 */
export const useSearchKnowledgeBase = () => {
  return useMutation({
    mutationFn: searchKnowledgeBase,
  });
};

export const useKnowledgeBaseCategories = () => {
  return useQuery({
    queryKey: ["knowledgeBase", "categories"],
    queryFn: getKnowledgeBaseCategories,
    staleTime: 10 * 60 * 1000,
  });
};
