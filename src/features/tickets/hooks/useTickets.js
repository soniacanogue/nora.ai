// src/features/tickets/hooks/useTickets.js
import { useQuery } from "@tanstack/react-query";
import { getTickets } from "../api/ticketsApi";

/**
 * Hook para obtener una lista de tickets filtrada y ordenada, usando React Query.
 * @param {object} filters - Objeto con los filtros a aplicar (ej. { status: '...', assigneeId: '...' }).
 * @param {object} sort - Objeto con las opciones de ordenamiento (ej. { key: 'prioridad', order: 'desc' }).
 * @returns {any} El resultado de la query de React Query.
 */
export const useTickets = (
  filters = {},
  sort = { key: "creadoEn", order: "asc" },
) => {
  return useQuery({
    // La queryKey incluye filtros y ordenamiento para que sea única
    queryKey: ["tickets", filters, sort],
    queryFn: () => getTickets(filters, sort), // Pasamos los filtros a la API
    staleTime: 60 * 1000, // 1 minuto de cache
  });
};
