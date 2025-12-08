// src/features/tickets/hooks/useTickets.js
import { useQuery } from "@tanstack/react-query";
import { getTickets } from "../api/ticketsApi";

/**
 * Hook para obtener una lista de tickets filtrada y ordenada, usando React Query.
 * @param {object} filters - Objeto con los filtros a aplicar (ej. { estado: '...', assigneeId: '...' }).
 * @param {object} sort - Objeto con las opciones de ordenamiento (ej. { key: 'prioridad', order: 'desc' }).
 * @returns {any} El resultado de la query de React Query.
 */
export const useTickets = (
  filters = {},
  sort = { key: "creadoEn", order: "asc" },
) => {
  // Mapear legacy `status` a `estado` para ser compatibles con versiones antiguas
  const mappedFilters = { ...filters };
  if (mappedFilters.status && !mappedFilters.estado) {
    mappedFilters.estado = mappedFilters.status;
    delete mappedFilters.status;
  }

  return useQuery({
    // La queryKey incluye filtros, paginación y ordenamiento para que sea única
    queryKey: ["tickets", { ...mappedFilters, page: mappedFilters.page, limit: mappedFilters.limit }, sort],
    queryFn: () => getTickets(mappedFilters), // Pasamos los filtros (incluye page/limit) a la API
    staleTime: 60 * 1000, // 1 minuto de cache
  });
};
