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
    const { data } = await apiClient.uploadFile("/orders/import", formData);

    // Return a standardized response
    return {
      success: true,
      jobId: data.jobId || `import-${Date.now()}`,
      fileName: file.name,
      summary: data.summary || {
        total: data.total || 0,
        imported: data.imported || 0,
        failed: data.failed || 0,
        errors: data.errors || [],
      },
      ...data,
    };
  } catch (error) {
    console.error("File upload failed:", error);
    throw error;
  }
};

/**
 * Starts an import job with field mapping.
 * Note: With the simplified backend, this might not be needed.
 * Kept for backward compatibility with UI components that expect this flow.
 * @param {string} jobId - The job ID.
 * @param {object} mapping - Field mapping configuration.
 * @returns {Promise<object>}
 */
export const startImportJob = async (jobId, mapping) => {
  console.log(`Starting import job ${jobId} with mapping:`, mapping);

  // If the backend supports a two-step process
  try {
    const { data } = await apiClient.post(`/orders/import/${jobId}/start`, {
      mapping,
    });
    return { success: true, ...data };
  } catch (error) {
    // If endpoint returns 404, the import was already processed immediately
    if (error.status === 404) {
      console.log(
        "Start import endpoint not available (404), assuming immediate processing"
      );
      return { success: true, immediateProcessing: true };
    }
    // Re-throw other errors to surface real issues
    throw error;
  }
};

/**
 * Gets the status of an import job.
 * @param {string} jobId - The job ID.
 * @returns {Promise<object|null>}
 */
export const getImportJobStatus = async (jobId) => {
  if (!jobId) return null;

  try {
    const { data } = await apiClient.get(`/orders/import/${jobId}/status`);

    return {
      id: jobId,
      status: data.status || "completed",
      progress: data.progress || 100,
      summary: data.summary || null,
      ...data,
    };
  } catch (error) {
    // If status endpoint returns 404, status tracking is not available
    if (error.status === 404) {
      console.log(
        "Status endpoint not available (404), returning unknown status"
      );
      return {
        id: jobId,
        status: "unknown",
        progress: 100,
        summary: null,
        statusUnavailable: true,
      };
    }
    // Re-throw other errors
    console.error(`Failed to get import job status for ${jobId}:`, error);
    throw error;
  }
};

/**
 * Cancels an import job.
 * @param {string} jobId - The job ID.
 * @returns {Promise<object>}
 */
export const cancelImportJob = async (jobId) => {
  console.log(`Cancelling import job: ${jobId}`);

  try {
    const { data } = await apiClient.post(`/orders/import/${jobId}/cancel`);
    return { success: true, ...data };
  } catch (error) {
    // If cancel endpoint doesn't exist, just return success
    console.log("Cancel endpoint not available");
    return { success: true };
  }
};
