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
      // Enhanced feedback with confirmation of Level 2 assignment
      const newState = data?.data?.estado || data?.estado || data?.newState;
      const assignedQueue = data?.data?.cola || data?.queue;
      
      let successMessage = `✅ Ticket ${variables.ticketId} escalado a Nivel 2`;
      
      // Validate automatic L2 queue assignment
      if (newState === "escalado_nivel_2" || newState === "en_progreso_nivel_2") {
        successMessage += " correctamente";
      }
      
      if (assignedQueue) {
        successMessage += ` (Cola: ${assignedQueue})`;
      }
      
      toast.success(successMessage, { duration: 4000 });
      
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
