// src/features/tickets/hooks/useTicketTags.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTagToTicket, removeTagFromTicket } from "../api/ticketsApi";
import toast from "react-hot-toast";

/**
 * Hook to add a tag to a ticket
 * @param {object} options - Options like onSuccess for callbacks
 * @returns {any} mutation object from react-query
 */
export const useAddTicketTag = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, tagName }) => addTagToTicket(ticketId, tagName),
    onSuccess: (data, variables) => {
      toast.success(`Etiqueta "${variables.tagName}" añadida`);
      // Invalidate tickets list to refresh
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      // Invalidate the ticket detail
      queryClient.invalidateQueries({
        queryKey: ["ticket", variables.ticketId],
      });

      if (options.onSuccess) {
        options.onSuccess(data, variables);
      }
    },
    onError: (error, variables) => {
      toast.error(error.message || `Error al añadir etiqueta "${variables.tagName}"`);
      if (options.onError) {
        options.onError(error, variables);
      }
    },
  });
};

/**
 * Hook to remove a tag from a ticket
 * @param {object} options - Options like onSuccess for callbacks
 * @returns {any} mutation object from react-query
 */
export const useRemoveTicketTag = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, tagName }) => removeTagFromTicket(ticketId, tagName),
    onSuccess: (data, variables) => {
      toast.success(`Etiqueta "${variables.tagName}" eliminada`);
      // Invalidate tickets list to refresh
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      // Invalidate the ticket detail
      queryClient.invalidateQueries({
        queryKey: ["ticket", variables.ticketId],
      });

      if (options.onSuccess) {
        options.onSuccess(data, variables);
      }
    },
    onError: (error, variables) => {
      toast.error(error.message || `Error al eliminar etiqueta "${variables.tagName}"`);
      if (options.onError) {
        options.onError(error, variables);
      }
    },
  });
};
