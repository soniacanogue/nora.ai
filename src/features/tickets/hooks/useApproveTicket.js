// src/features/tickets/hooks/useApproveTicket.js
import { useState } from "react";
import { approveTicket } from "../api/ticketsApi";
import toast from "react-hot-toast";

/**
 * A hook to approve a ticket with the suggested or edited response.
 * @returns {{ approve: Function, isApproving: boolean, error: string|null }}
 */
export const useApproveTicket = () => {
  const [isApproving, setIsApproving] = useState(false);
  const [error, setError] = useState(null);

  const approve = async (ticketId, editedBody) => {
    try {
      setIsApproving(true);
      setError(null);
      
      const result = await approveTicket(ticketId, { editedBody });
      
      if (result.success) {
        toast.success("Ticket aprobado y respuesta enviada correctamente");
        return result;
      } else {
        throw new Error("No se pudo aprobar el ticket");
      }
    } catch (err) {
      const errorMessage = err.message || "Error al aprobar el ticket";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsApproving(false);
    }
  };

  return { approve, isApproving, error };
};
