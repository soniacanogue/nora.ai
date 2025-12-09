// src/features/tickets/hooks/useApproveTicket.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveTicket } from "../api/ticketsApi";
import toast from "react-hot-toast";
import { useAuth } from "@/shared/hooks/useAuth";

/**
 * A hook to approve a ticket with the suggested or edited response.
 * @param {object} options - Opciones como onSuccess para callbacks.
 * @returns {any}
 */
export const useApproveTicket = (options = {}) => {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  return useMutation({
    mutationFn: async ({ ticketId, editedBody }) => {
      await approveTicket(ticketId, { editedBody });
      return { ticketId, editedBody };
    },
    onSuccess: (data, variables) => {
      const deliveryStatus =
        data?.data?.deliveryStatus ||
        data?.data?.emailStatus ||
        data?.data?.respuesta?.estadoEnvio;
      const isDeliveryError =
        deliveryStatus &&
        !["sent", "queued", "entregado", "enviado"].includes(
          String(deliveryStatus).toLowerCase(),
        );

      if (isDeliveryError) {
        toast.error(
          `Ticket ${variables.ticketId} actualizado, pero el correo reportó estado: ${deliveryStatus}.`,
        );
      } else {
        toast.success(
          `Ticket ${variables.ticketId} aprobado y respuesta enviada.`,
        );
      }
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
    onError: (error, variables) => {
      // E1: Email send failure - check for specific email-related errors
      if (
        error.message?.toLowerCase().includes("email") ||
        error.message?.toLowerCase().includes("correo") ||
        error.message?.toLowerCase().includes("mailgun") ||
        error.response?.data?.emailError
      ) {
        toast.error(
          `Error al enviar el correo para el ticket ${variables.ticketId}: ${error.message || "Servicio de email no disponible"}`,
          { duration: 5000 }
        );
      }
      // E2: Concurrent state change detection
      else if (
        error.message?.toLowerCase().includes("estado") ||
        error.message?.toLowerCase().includes("modificado") ||
        error.message?.toLowerCase().includes("concurrent") ||
        error.response?.status === 409
      ) {
        toast.error(
          `El ticket ${variables.ticketId} fue modificado por otro usuario. Por favor, recarga la página.`,
          { duration: 6000 }
        );
      }
      // Generic error
      else {
        toast.error(error.message || "Error al aprobar el ticket.");
      }
    },
  });
};
