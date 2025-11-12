// src/features/orders/hooks/useImport.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  uploadCsvForImport,
  startImportJob,
  getImportJobStatus,
  cancelImportJob,
} from "../api/importApi";
import toast from "react-hot-toast";

// Hook para subir el archivo y crear el job
/**
 * @returns {any} - Wrapped mutation with `isPending` alias
 */
export const useUploadCsv = (options = {}) => {
  const mutation = useMutation({
    mutationFn: uploadCsvForImport,
    ...options,
  });

  // Normalize api to include `isPending` used by the UI
  return {
    ...mutation,
    isPending: mutation.status === "pending",
  };
};

// Hook para iniciar el procesamiento del job
/**
 * @returns {any} - Wrapped mutation that accepts {jobId, mapping}
 */
export const useStartImport = (options = {}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (variables) => {
      const v = /** @type {any} */ (variables);
      return startImportJob(v?.jobId, v?.mapping);
    },
    onSuccess: (data, variables) => {
      // Cuando la importación empieza, invalidamos la query del status para que empiece a pollear
      const v = /** @type {any} */ (variables);
      const jobId = v?.jobId ?? v;
      queryClient.invalidateQueries({
        queryKey: ["importJob", jobId],
      });
      options.onSuccess?.(data, variables);
    },
    ...options,
  });

  return {
    ...mutation,
    isPending: mutation.status === "pending",
  };
};

// Hook para consultar el estado de un job (con polling)
/**
 * @returns {any} - Query result for the import job
 */
export const useImportJob = (jobId) => {
  return useQuery({
    queryKey: ["importJob", jobId],
    queryFn: () => getImportJobStatus(jobId),
    enabled: !!jobId,
    refetchInterval: (query) => {
      const job = query.state.data;

      // Keep polling if processing
      if (!job || job.status === "processing") {
        return 2000; // Poll every 2 seconds
      }

      // Stop polling when completed or cancelled
      if (job.status === "completed" || job.status === "cancelled") {
        return false;
      }

      return 2000; // Default polling interval
    },
    refetchOnWindowFocus: false, // Avoid extra refetches
    refetchOnMount: true,
    staleTime: 0, // Always consider data stale to allow updates
    gcTime: 30000, // Keep cache for 30 seconds
  });
};

// Hook para cancelar un job
/**
 * @returns {any} - Wrapped mutation that accepts jobId
 */
export const useCancelImportJob = (options = {}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: cancelImportJob,
    onSuccess: (data, variables) => {
      toast.success("La importación ha sido cancelada.");
      const v = /** @type {any} */ (variables);
      const jobId = typeof v === "string" ? v : v?.jobId;
      queryClient.setQueryData(["importJob", jobId], (oldData) => {
        if (!oldData || typeof oldData !== "object") return { status: "cancelled" };
        return {
          ...oldData,
          status: "cancelled",
        };
      });
      options.onSuccess?.(data, variables);
    },
    onError: (err) => toast.error(err.message || "No se pudo cancelar el job."),
    ...options,
  });

  return {
    ...mutation,
    isPending: mutation.status === "pending",
  };
};
