// src/features/orders/api/importApi.js
import { apiClient } from "@/shared/lib/apiClient";

/**
 * Uploads a CSV file for order import.
 * The backend processes the file directly and returns the result.
 * @param {File} file - The CSV file to upload.
 * @returns {Promise<object>} - The import result from the server.
 */
export const uploadCsvForImport = async (file) => {
  console.log(`Uploading file for import: ${file.name}`);

  // Some servers perform strict validation on the incoming file's MIME type.
  // If the browser provides a MIME type that the backend rejects, coerce it
  // to a backend-friendly CSV MIME (Excel CSV) as a fallback.
  let fileToUpload = file;
  try {
    const originalType = file.type || "";
    // Prefer 'text/csv' but fall back to 'application/vnd.ms-excel' which some
    // servers accept when they expect CSV files.
    const preferredType = originalType || "application/vnd.ms-excel";
    // If the type is empty or not accepted by backend, create a new File with
    // a commonly accepted CSV MIME type. This preserves the file contents.
    if (
      !originalType ||
      !/csv|text\/csv|application\/vnd\.ms-excel/.test(originalType)
    ) {
      fileToUpload = new File([file], file.name, {
        type: "application/vnd.ms-excel",
      });
    }
    console.log(
      "File types -> original:",
      originalType,
      ", upload:",
      fileToUpload.type
    );
  } catch (e) {
    // If creating a new File fails (older browsers), fall back to original file
    console.warn(
      "Could not coerce file type for upload, using original file.",
      e
    );
    fileToUpload = file;
  }

  const formData = new FormData();
  formData.append("file", fileToUpload);

  try {
    const { data } = await apiClient.uploadFile("/orders/upload", formData);

    const summary = data?.summary || {
      total: data?.total || 0,
      imported: data?.imported || 0,
      failed: data?.failed || 0,
      errors: data?.errors || [],
    };

    return {
      success: true,
      fileName: file.name,
      summary,
      ...data,
    };
  } catch (error) {
    console.error("File upload failed:", error);
    throw error;
  }
};

/**
 * Sends a batch of orders to be imported.
 * @param {object} payload - Payload containing orders array.
 * @returns {Promise<object>} - The result of the batch import.
 */
export const importOrdersBatch = async (payload) => {
  try {
    const { data } = await apiClient.post("/orders", payload);
    return { success: true, ...data };
  } catch (error) {
    console.error("Batch import failed:", error);
    throw error;
  }
};
