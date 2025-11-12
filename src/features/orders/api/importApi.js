// src/features/orders/api/importApi.js
import Papa from "papaparse";

// --- Base de Datos en Memoria para Simular Jobs Asíncronos ---
const importJobs = new Map();

// --- Lógica de Procesamiento Simulado ---
async function processJob(jobId) {
  const job = importJobs.get(jobId);
  if (!job || job.status !== "processing") return;

  const { rows, mapping } = job;
  let imported = 0;
  let skipped = 0;
  const errorRows = [];

  for (let i = 0; i < rows.length; i++) {
    // Si el job se cancela, detenemos el bucle
    if (importJobs.get(jobId)?.status !== "processing") {
      console.log(`Job ${jobId} cancelado. Deteniendo proceso.`);
      return;
    }

    const row = rows[i];
    // Aquí iría la validación de la fila, igual que antes
    const isValid = row[mapping.orderId] && row[mapping.clientEmail];

    if (isValid) {
      imported++;
    } else {
      skipped++;
      errorRows.push({ ...row, error_reason: "Campos requeridos faltantes" });
    }

    // Actualizamos el progreso en la "BD"
    job.progress = Math.round(((i + 1) / rows.length) * 100);
    // Simula latencia por fila (2 segundos) para visualizar el avance de la barra
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  // Finalizamos el job
  job.status = "completed";
  job.progress = 100; // Ensure progress is 100% when completed
  job.summary = {
    total: rows.length,
    imported,
    failed: skipped, // Map 'skipped' to 'failed' for UI consistency
    errors: errorRows.map((row) => row.error_reason || "Error desconocido"),
  };
  console.log(`Job ${jobId} completado.`, job.summary);
}

// --- API Functions ---

/**
 * Simula la subida de un archivo CSV y crea un job de importación.
 * @param {File} file - El archivo CSV.
 * @returns {Promise<{jobId: string, headers: string[]}>}
 */
export const uploadCsvForImport = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const jobId = `job-${Date.now()}`;
        importJobs.set(jobId, {
          id: jobId,
          fileName: file.name,
          status: "pending_mapping", // Nuevo estado: esperando mapeo
          headers: results.meta.fields,
          rows: results.data,
          progress: 0,
          summary: null,
        });
        console.log(`CSV subido, job creado: ${jobId}`);
        resolve({ jobId, headers: results.meta.fields });
      },
      error: (error) => reject(error),
    });
  });
};

/**
 * Inicia el procesamiento de un job que ya ha sido mapeado.
 * @param {string} jobId
 * @param {object} mapping
 * @returns {Promise<{success: boolean}>}
 */
export const startImportJob = async (jobId, mapping) => {
  const job = importJobs.get(jobId);
  if (!job) throw new Error("Job no encontrado.");

  job.status = "processing";
  job.mapping = mapping;
  console.log(`Iniciando procesamiento para job ${jobId}`);

  // No esperamos a que termine, se ejecuta en "segundo plano"
  processJob(jobId);

  return Promise.resolve({ success: true });
};

/**
 * Obtiene el estado actual de un job de importación.
 * @param {string} jobId
 * @returns {Promise<object>}
 */
export const getImportJobStatus = async (jobId) => {
  if (!jobId) return null;
  await new Promise((r) => setTimeout(r, 100)); // Simula latencia de red
  const job = importJobs.get(jobId) || null;
  if (job) {
    // Importante: devolver una NUEVA referencia para que React Query detecte cambios
    // Evita problemas por mutación en sitio (el objeto en el Map se va actualizando en proceso)
    const cloned = {
      ...job,
      // Clonar estructuras anidadas susceptibles de cambiar
      summary: job.summary
        ? {
            ...job.summary,
            errors: Array.isArray(job.summary.errors)
              ? [...job.summary.errors]
              : job.summary.errors,
          }
        : null,
      headers: Array.isArray(job.headers) ? [...job.headers] : job.headers,
    };
    // Nota: no devolvemos las filas (rows) para reducir payload
    if ("rows" in cloned) delete cloned.rows;
    return Promise.resolve(cloned);
  }
  return Promise.resolve(job);
};

/**
 * Cancela un job de importación en progreso.
 * @param {string} jobId
 * @returns {Promise<object>}
 */
export const cancelImportJob = async (jobId) => {
  const job = importJobs.get(jobId);
  if (job) {
    job.status = "cancelled";
    console.log(`Job ${jobId} marcado para cancelación.`);
  }
  return Promise.resolve({ success: true });
};
