// src/features/orders/hooks/useImport.js
import { useMutation } from "@tanstack/react-query";
import { uploadCsvForImport, importOrdersBatch } from "../api/importApi";

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

// Hook para importar un lote de órdenes
/**
 * @returns {any} - Wrapped mutation that accepts {orders}
 */
export const useImportBatch = (options = {}) => {
  const mutation = useMutation({
    mutationFn: importOrdersBatch,
    ...options,
  });

  return {
    ...mutation,
    isPending: mutation.status === "pending",
  };
};
