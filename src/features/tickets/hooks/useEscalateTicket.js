// src/features/tickets/hooks/useEscalateTicket.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { escalateTicket } from "../api/ticketsApi";
import toast from "react-hot-toast";

/**
 * A hook to escalate a ticket to Level 2.
 * @param {object} options - Options like onSuccess for callbacks.
 * @returns {any} mutation object from react-query
 */
export const useEscalateTicket = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables) =>
      escalateTicket(variables.ticketId, variables.note),
    onSuccess: (data, variables) => {
      toast.success(`Ticket ${variables.ticketId} escalado a Nivel 2.`);
      // Invalidate tickets list to refresh the queue
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      // Also invalidate the ticket detail just in case
      queryClient.invalidateQueries({
        queryKey: ["ticket", variables.ticketId],
      });

      // Execute the onSuccess callback if it exists (for navigation)
      if (options.onSuccess) {
        options.onSuccess(data, variables);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Error al escalar el ticket.");
    },
  });
};
