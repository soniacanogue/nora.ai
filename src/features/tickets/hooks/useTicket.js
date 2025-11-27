// src/features/tickets/hooks/useTicket.js
import { useQuery } from "@tanstack/react-query";
import { getTicketById } from "../api/ticketsApi";

/**
 * Un hook para obtener los detalles de un ticket específico por su ID usando React Query.
 * @param {string} ticketId - El ID del ticket a obtener.
 * @returns {any} El resultado de la query de React Query.
 */
export const useTicket = (ticketId) => {
  return useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: () => getTicketById(ticketId),
    enabled: !!ticketId, // La query solo se ejecutará si ticketId tiene un valor
  });
};
