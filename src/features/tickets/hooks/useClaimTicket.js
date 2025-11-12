// src/features/tickets/hooks/useClaimTicket.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { claimTicket } from "../api/ticketsApi";
import toast from "react-hot-toast";

/**
 * Hook para la acción de "tomar" (claim) un ticket.
 * @returns {object} Mutation result from React Query
 */
export const useClaimTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
  mutationFn: (variables) => {
    if (typeof variables === "object" && variables !== null) {
      return claimTicket(
        variables && variables.ticketId ? variables.ticketId : undefined,
        variables && variables.agentId ? variables.agentId : undefined
      );
    }
    return claimTicket(undefined, undefined);
  },
    onSuccess: (data) => {
      toast.success(data.message);
      // Invalidar las queries de listas de tickets para que la tabla se actualice
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
    onError: (error) => {
      // La API mock ahora puede rechazar con un mensaje de error específico
      toast.error(error.message || "No se pudo tomar el ticket.");
      // Opcional: Refrescar la data para mostrar quién lo tomó.
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
};
