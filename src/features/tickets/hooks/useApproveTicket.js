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
    mutationFn: async ({ ticketId, ...payload }) => {
      const enrichedPayload = { ...payload };
      const userId =
        enrichedPayload.aprobadoPorUsuarioId ||
        currentUser?.id ||
        currentUser?._id ||
        currentUser?.userId ||
        currentUser?.uuid ||
        null;

      if (userId && !enrichedPayload.aprobadoPorUsuarioId) {
        enrichedPayload.aprobadoPorUsuarioId = userId;
      }

      await approveTicket(ticketId, enrichedPayload);
      return { ticketId, editedBody: enrichedPayload.editedBody };
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
    onError: (error) => {
      toast.error(error.message || "Error al aprobar el ticket.");
    },
  });
};
