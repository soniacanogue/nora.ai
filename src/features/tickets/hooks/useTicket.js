// src/features/tickets/hooks/useTicket.js

import { useState, useEffect } from "react";
// 1. Cambia la importación para apuntar al nuevo archivo de API consolidado
import { getTicketById } from "../api/ticketsApi";

/**
 * Un hook para obtener los detalles de un ticket específico por su ID.
 * @param {string} ticketId - El ID del ticket a obtener.
 * @returns {{ticket: object|null, isLoading: boolean, error: string|null}}
 */
export const useTicket = (ticketId) => {
  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ticketId) {
      setIsLoading(false);
      return;
    }

    const fetchTicket = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // 2. La llamada a la función es la misma. No hay más cambios aquí.
        const data = await getTicketById(ticketId);
        setTicket(data);
      } catch (err) {
        setError(err.message || "Ocurrió un error desconocido.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId]);

  return { ticket, isLoading, error };
};
