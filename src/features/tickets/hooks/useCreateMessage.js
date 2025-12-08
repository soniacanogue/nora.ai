import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMessage } from "../api/ticketsApi";
import toast from "react-hot-toast";
import { useAuth } from "@/shared/hooks/useAuth";

export const useCreateMessage = (options = {}) => {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  return useMutation({
    mutationFn: async ({ ticketId, ...payload }) => {
      const enriched = { ...payload };
      const userId =
        enriched.usuarioId ||
        currentUser?.id ||
        currentUser?._id ||
        currentUser?.userId ||
        currentUser?.uuid ||
        null;

      if (userId && !enriched.usuarioId) enriched.usuarioId = userId;

      const res = await createMessage(ticketId, enriched);
      return res;
    },
    onSuccess: (data, variables) => {
      toast.success(`Mensaje guardado en ticket ${variables.ticketId}.`);
      queryClient.invalidateQueries({ queryKey: ["ticket", variables.ticketId] });
      if (options.onSuccess) options.onSuccess(data, variables);
    },
    onError: (err) => {
      toast.error(err.message || "Error al crear el mensaje.");
    },
  });
};
