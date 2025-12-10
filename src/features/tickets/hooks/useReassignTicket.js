// src/features/tickets/hooks/useReassignTicket.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reassignTicket } from "../api/ticketsApi";
import toast from "react-hot-toast";

/**
 * A hook to reassign a ticket to another agent.
 * @param {object} options - Options like onSuccess for callbacks.
 * @returns {any} mutation object from react-query
 */
export const useReassignTicket = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables) =>
      reassignTicket(variables.ticketId, variables.newAssigneeId),
    onSuccess: (data, variables) => {
      toast.success(`Ticket reasignado correctamente.`);
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
      toast.error(error.message || "Error al reasignar el ticket.");
    },
  });
};
