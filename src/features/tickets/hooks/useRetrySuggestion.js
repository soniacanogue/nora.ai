import { useMutation, useQueryClient } from "@tanstack/react-query";
import { retryTicketSuggestion } from "../api/ticketsApi";
import toast from "react-hot-toast";

/**
 * A hook to retry the AI suggestion for a ticket.
 * @returns {any}
 */
export const useRetrySuggestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ticketId) => retryTicketSuggestion(ticketId),
    onSuccess: (data, ticketId) => {
      toast.success("Sugerencia regenerada correctamente.");
      // Invalidate the ticket query to refresh the data with the new suggestion
      queryClient.invalidateQueries({ queryKey: ["ticket", ticketId] });
    },
    onError: (error) => {
      toast.error(error.message || "Error al regenerar la sugerencia.");
    },
  });
};
