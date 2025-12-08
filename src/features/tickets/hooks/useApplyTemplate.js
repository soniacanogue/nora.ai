import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { applyTemplateToTicket } from "../api/ticketsApi";

export const useApplyTemplate = (options = {}) => {
  const { onSuccess, onError, ...mutationOptions } = options;

  return useMutation({
    mutationFn: ({ ticketId, templateId, overwriteSuggestion = false }) =>
      applyTemplateToTicket({ ticketId, templateId, overwriteSuggestion }),
    onSuccess: (data, variables, context) => {
      toast.success("Plantilla aplicada correctamente");
      if (typeof onSuccess === "function") {
        onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      toast.error(error.message || "No se pudo aplicar la plantilla");
      if (typeof onError === "function") {
        onError(error, variables, context);
      }
    },
    ...mutationOptions,
  });
};
