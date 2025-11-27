// src/features/tickets/hooks/useApproveTicket.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveTicket } from "../api/ticketsApi";
import toast from "react-hot-toast";

/**
 * A hook to approve a ticket with the suggested or edited response.
 * @param {object} options - Opciones como onSuccess para callbacks.
 * @returns {any}
 */
export const useApproveTicket = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ticketId, editedBody }) => {
      await approveTicket(ticketId, { editedBody });
      return { ticketId, editedBody };
    },
    onSuccess: (data, variables) => {
      toast.success(
        `Ticket ${variables.ticketId} aprobado y respuesta enviada.`,
      );
      // Invalidamos la lista de tickets para que se refresque la cola
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      // También invalidamos el detalle del ticket por si acaso
      queryClient.invalidateQueries({
        queryKey: ["ticket", variables.ticketId],
      });

      // Ejecutamos el callback onSuccess si existe (para la navegación)
      if (options.onSuccess) {
        options.onSuccess(data, variables);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Error al aprobar el ticket.");
    },
  });
};
