import { useQueryClient } from "@tanstack/react-query";

/**
 * Hook para gestionar la navegación dentro de una cola de tickets
 * obtenida desde la caché de React Query.
 */
export const useTicketQueue = () => {
  const queryClient = useQueryClient();

  // Obtenemos los datos de la query de la lista de tickets.
  // Asumimos que la página de lista usa la queryKey ['tickets', <filtros>].
  // Buscamos la primera query de tickets que esté activa.
  const allQueries = typeof queryClient.getQueryCache === "function"
    ? (queryClient.getQueryCache().getAll ? queryClient.getQueryCache().getAll() : [])
    : [];

  const ticketsQuery = Array.isArray(allQueries)
    ? allQueries.find((q) => Array.isArray(q.queryKey) && q.queryKey[0] === "tickets")
    : null;

  const queue = ticketsQuery?.state?.data || [];
  const safeQueue = Array.isArray(queue) ? queue : [];

  /**
   * Obtiene el ID del siguiente ticket en la cola.
   * @param {string} currentTicketId - El ID del ticket actual.
   * @returns {string|null} El ID del siguiente ticket o null si no hay más.
   */
  const getNextTicketId = (currentTicketId) => {
    const currentIndex = safeQueue.findIndex(
      (ticket) => ticket.id === currentTicketId,
    );
    if (currentIndex !== -1 && currentIndex < safeQueue.length - 1) {
      return safeQueue[currentIndex + 1].id;
    }
    return null;
  };

  /**
   * Obtiene el ID del ticket anterior en la cola.
   * @param {string} currentTicketId - El ID del ticket actual.
   * @returns {string|null} El ID del ticket anterior o null si es el primero.
   */
  const getPreviousTicketId = (currentTicketId) => {
    const currentIndex = safeQueue.findIndex(
      (ticket) => ticket.id === currentTicketId,
    );
    if (currentIndex > 0) {
      return safeQueue[currentIndex - 1].id;
    }
    return null;
  };

  return { queue, getNextTicketId, getPreviousTicketId };
};
