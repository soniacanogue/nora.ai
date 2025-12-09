// src/features/tickets/api/ticketsApi.js

import { apiClient } from "@/shared/lib/apiClient";

// Default empty ticket structure for fallback
const defaultTicket = {
  id: null,
  asunto: "",
  estado: "nuevo",
  prioridad: "media",
  canalOrigen: "web",
  creadoEn: new Date().toISOString(),
  cliente: { nombre: "Cliente Desconocido", correo: "" },
  orden: null,
  etiquetas: [],
  conversacion: [],
  respuestaSugerida: "",
};

/**
 * Fetches a list of tickets from the API.
 * @param {object} filters - Filtering parameters.
 * @param {object} sort - Sorting parameters.
 * @param {boolean} includeDetails - If details should be included.
 * @returns {Promise<Array>}
 */
/**
 * Filtros soportados: estado, assigneeId, clienteId, ordenId, prioridad, canal
 * @param {object} filters
 *   - estado: string
 *   - assigneeId: string (UUID)
 *   - clienteId: string (UUID)
 *   - ordenId: string (UUID)
 *   - prioridad: string
 *   - canal: string
 * @returns {Promise<Array>}
 */
export const getTickets = async (filters = {}) => {
  console.log("Fetching ticket list with filters:", filters);
  try {
    const params = new URLSearchParams();

    const add = (key, value) => {
      if (value === undefined || value === null) return;
      // Convert empty strings to undefined to avoid backend validation errors
      if (typeof value === "string" && value.trim() === "") return;
      params.append(key, String(value));
    };

    add("estado", filters.estado);
    add("assigneeId", filters.assigneeId || filters.assignee);
    add("clienteId", filters.clienteId);
    add("ordenId", filters.ordenId);
    add("prioridad", filters.prioridad);
    add("canal", filters.canal);
    add("page", filters.page);
    add("limit", filters.limit);

    const queryString = params.toString();
    const endpoint = `/tickets${queryString ? `?${queryString}` : ""}`;
    const { data } = await apiClient.get(endpoint);

    // Backend may return either an array (legacy) or an object { data: [], pagination: {} }
    if (Array.isArray(data)) {
      return data;
    }

    if (data && Array.isArray(data.data)) {
      const arr = data.data;
      try {
        Object.defineProperty(arr, "pagination", {
          value: data.pagination || null,
          enumerable: false,
          writable: false,
        });
      } catch {
        // ignore if defineProperty fails in some environments
        arr.pagination = data.pagination || null;
      }
      return arr;
    }

    return [];
  } catch (error) {
    console.error("Failed to fetch tickets:", error);
    return [];
  }
};

/**
 * Fetches a single ticket by ID.
 * @param {string} ticketId - The ID of the ticket.
 * @returns {Promise<object|null>}
 */
export const getTicketById = async (ticketId) => {
  console.log(`Fetching ticket data for ID: ${ticketId}...`);

  try {
    const { data } = await apiClient.get(`/tickets/${ticketId}`);

    // Merge with defaults to ensure all expected properties exist
    return {
      ...defaultTicket,
      ...data,
      cliente: data.cliente || defaultTicket.cliente,
      orden: data.orden || null,
      etiquetas: data.etiquetas || [],
      conversacion: data.conversacion || [],
    };
  } catch (error) {
    console.error(`Failed to fetch ticket ${ticketId}:`, error);
    return null;
  }
};

/**
 /**
 * Approves a ticket and dispatches the crafted reply.
 * @param {string} ticketId - The ID of the ticket.
 * @param {object} payload - Extra fields such as editedBody, attachments, nextState, etc.
 * @returns {Promise<object>}
 */
export const approveTicket = async (ticketId, payload = {}) => {
  console.log(
    `Executing action 'approve' on ticket ${ticketId} with payload:`,
    payload,
  );


  const {
    estado,
    replyChannel,
    attachments,
    manualEdit,
    conversationFingerprint,
    collisionAcknowledged,
    ...rest
  } = payload;

  const body = {
    estado: estado || "esperando_cliente",
    replyChannel,
    canalRespuesta: replyChannel,
    manualEdit,
    manual_edit: manualEdit,
    conversationFingerprint,
    collisionAcknowledged,
    ...rest,
  };

  if (Array.isArray(attachments) && attachments.length > 0) {
    body.attachments = attachments;
    body.adjuntosRespuesta = attachments;
  }

  const sanitizedBody = Object.fromEntries(
    Object.entries(body).filter(([, value]) => value !== undefined && value !== null),
  );

  try {
    // Backend exposes a specific endpoint to approve AI suggestions
    const { data } = await apiClient.post(
      `/tickets/${ticketId}/approve-ai`,
      sanitizedBody,
    );
    return { success: true, ticketId, data };
  } catch (error) {
    console.error(`Failed to approve ticket ${ticketId}:`, error);
    throw error;
  }
};

/**
 * Sends a reply to the customer (visible to client).
 * Distinct from `createMessage` which can create internal notes.
 * @param {string} ticketId
 * @param {{contenidoTexto: string, nuevoEstado?: string, archivos?: Array, canal?: string}} payload
 */
export const replyToTicket = async (ticketId, payload = {}) => {
  if (!ticketId) throw new Error("ticketId is required");

  const body = {
    contenidoTexto: payload.contenidoTexto || payload.reply_text || "",
    estado: payload.estado || undefined,
    archivos: payload.archivos || payload.attachments || undefined,
    canal: payload.canal || payload.replyChannel || undefined,
  };

  const sanitized = Object.fromEntries(
    Object.entries(body).filter(([, v]) => v !== undefined && v !== null),
  );

  try {
    const { data } = await apiClient.post(`/tickets/${ticketId}/reply`, sanitized);
    return data;
  } catch (error) {
    console.error(`Failed to reply to ticket ${ticketId}:`, error);
    throw error;
  }
};

/**
 * Creates a message attached to a ticket. Can be an internal note (`esNotaInterna: true`).
 * @param {string} ticketId
 * @param {{contenidoTexto: string, esNotaInterna?: boolean, archivos?: Array}} payload
 */
export const createMessage = async (ticketId, payload = {}) => {
  if (!ticketId) throw new Error("ticketId is required");

  const body = {
    contenidoTexto: payload.contenidoTexto || payload.text || "",
    esNotaInterna: Boolean(payload.esNotaInterna),
    archivos: payload.archivos || payload.attachments || undefined,
  };

  const sanitized = Object.fromEntries(
    Object.entries(body).filter(([, v]) => v !== undefined && v !== null),
  );

  try {
    const { data } = await apiClient.post(`/tickets/${ticketId}/messages`, sanitized);
    return data;
  } catch (error) {
    console.error(`Failed to create message for ticket ${ticketId}:`, error);
    throw error;
  }
};

/**
 * Add a tag to a ticket by name.
 */
export const addTagToTicket = async (ticketId, tagName) => {
  if (!ticketId || !tagName) throw new Error("ticketId and tagName are required");
  try {
    const { data } = await apiClient.post(`/tickets/${ticketId}/tags/${encodeURIComponent(tagName)}`);
    return data;
  } catch (error) {
    console.error(`Failed to add tag ${tagName} to ticket ${ticketId}:`, error);
    throw error;
  }
};

/**
 * Remove a tag from a ticket by name.
 */
export const removeTagFromTicket = async (ticketId, tagName) => {
  if (!ticketId || !tagName) throw new Error("ticketId and tagName are required");
  try {
    const { data } = await apiClient.delete(`/tickets/${ticketId}/tags/${encodeURIComponent(tagName)}`);
    return data;
  } catch (error) {
    console.error(`Failed to remove tag ${tagName} from ticket ${ticketId}:`, error);
    throw error;
  }
};

/**
 * Export tickets to CSV with optional filters.
 * @param {object} filters
 */
export const exportTicketsToCsv = async (filters = {}) => {
  try {
    const { data } = await apiClient.post(`/tickets/export`, filters || {});
    return data;
  } catch (error) {
    console.error("Failed to export tickets:", error);
    throw error;
  }
};

/**
 * Create a public ticket (no auth) from web form.
 */
export const createPublicTicket = async (ticketData) => {
  try {
    const { data } = await apiClient.post(`/public/tickets`, ticketData || {});
    return data;
  } catch (error) {
    console.error("Failed to create public ticket:", error);
    throw error;
  }
};

/**
 * Escalates a ticket to Level 2.
 * @param {string} ticketId - The ID of the ticket.
 * @param {string} note - Internal note for the Level 2 specialist.
 * @returns {Promise<object>}
 */
export const escalateTicket = async (ticketId, note) => {
  console.log(
    `Executing action 'escalate' on ticket ${ticketId} with note:`,
    note,
  );
  try {
    // Use semantic endpoint `/tickets/:id/escalate` (POST) per backend contract
    const { data } = await apiClient.post(`/tickets/${ticketId}/escalate`, {
      note: note,
    });
    return {
      success: true,
      message: `Ticket ${ticketId} escalado.`,
      data,
    };
  } catch (error) {
    console.error(`Failed to escalate ticket ${ticketId}:`, error);
    throw error;
  }
};

/**
 * Reassigns a ticket to another agent.
 * @param {string} ticketId - The ID of the ticket.
 * @param {string} newAssigneeId - The ID of the new agent.
 * @returns {Promise<object>}
 */
export const reassignTicket = async (ticketId, newAssigneeId) => {
  console.log(
    `Executing action 'reassign' on ticket ${ticketId} to agent ${newAssigneeId}`,
  );
  try {
    // Backend exposes `/tickets/:id/reassign` as POST with body { assigneeId, note? }
    const { data } = await apiClient.post(`/tickets/${ticketId}/reassign`, {
      assigneeId: newAssigneeId,
    });
    return {
      success: true,
      message: `Ticket ${ticketId} reasignado.`,
      data,
    };
  } catch (error) {
    console.error(`Failed to reassign ticket ${ticketId}:`, error);
    throw error;
  }
};

/**
 * Claims a ticket for an agent.
 * @param {string} ticketId - The ID of the ticket.
 * @param {string} agentId - The ID of the agent claiming the ticket.
 * @returns {Promise<object>}
 */
export const claimTicket = async (ticketId, agentId) => {
  console.log(
    `Executing action 'claim' on ticket ${ticketId} by agent ${agentId}`,
  );

  try {
    const { data } = await apiClient.patch(`/tickets/${ticketId}`, {
      assigneeId: agentId,
      estado: "en_progreso_nivel_2",
    });
    return {
      success: true,
      message: `Ticket ${ticketId} asignado a ti.`,
      data,
    };
  } catch (error) {
    console.error(`Failed to claim ticket ${ticketId}:`, error);
    throw error;
  }
};


/**
 * Find merge candidates for a ticket.
 */
export const findMergeCandidates = async (ticketId) => {
  if (!ticketId) throw new Error("ticketId is required");
  try {
    const { data } = await apiClient.get(`/tickets/${ticketId}/merge-candidates`);
    return data;
  } catch (error) {
    console.error(`Failed to fetch merge candidates for ${ticketId}:`, error);
    throw error;
  }
};

/**
 * Merge a ticket into another ticket. Body: { targetTicketId }
 */
export const mergeTicket = async (ticketId, targetTicketId) => {
  if (!ticketId || !targetTicketId) throw new Error("ticketId and targetTicketId are required");
  try {
    const { data } = await apiClient.post(`/tickets/${ticketId}/merge`, { targetTicketId });
    return data;
  } catch (error) {
    console.error(`Failed to merge ticket ${ticketId} into ${targetTicketId}:`, error);
    throw error;
  }
};

/**
 * Creates a new ticket.
 * @param {object} ticketData - The data for the new ticket.
 * @returns {Promise<object>}
 */
export const createTicket = async (ticketData) => {
  console.log("Creating new ticket with data:", ticketData);

  try {
    const { data } = await apiClient.post("/tickets", ticketData);
    return data;
  } catch (error) {
    console.error("Failed to create ticket:", error);
    throw error;
  }
};

/**
 * Update ticket partial fields.
 * @param {string} ticketId
 * @param {object} payload - Partial ticket fields to update (e.g., { nuevoEstado: 'resuelto' })
 */
export const updateTicket = async (ticketId, payload = {}) => {
  if (!ticketId) throw new Error("ticketId is required");
  try {
    const { data } = await apiClient.patch(`/tickets/${ticketId}`, payload);
    return data;
  } catch (error) {
    console.error(`Failed to update ticket ${ticketId}:`, error);
    throw error;
  }
};

/**
 * Retries the AI suggestion for a ticket.
 * @param {string} ticketId - The ID of the ticket.
 * @returns {Promise<object>}
 */
export const retryTicketSuggestion = async (ticketId) => {
  console.log(`Retrying AI suggestion for ticket ${ticketId}`);
  try {
    const { data } = await apiClient.post(`/ai/retry/${ticketId}`);
    return data;
  } catch (error) {
    console.error(`Failed to retry suggestion for ticket ${ticketId}:`, error);
    throw error;
  }
};

const parseFileNameFromDisposition = (headerValue = "") => {
  if (!headerValue) return null;

  const utf8Match = headerValue.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1]);
    } catch {
      return utf8Match[1];
    }
  }

  const asciiMatch = headerValue.match(/filename="?([^";]+)"?/i);
  if (asciiMatch?.[1]) {
    return asciiMatch[1];
  }

  return null;
};

export const applyTemplateToTicket = async ({
  ticketId,
  templateId,
  overwriteSuggestion = false,
} = {}) => {
  if (!ticketId || !templateId) {
    throw new Error("ticketId and templateId are required");
  }

  const endpoint = `/tickets/${ticketId}/apply-template/${templateId}`;
  const body = overwriteSuggestion ? { sobreescribirRespuesta: true } : {};

  try {
    const { data } = await apiClient.post(endpoint, body);
    return data;
  } catch (error) {
    console.error("Failed to apply template", error);
    throw error;
  }
};

export const getAttachmentMetadata = async (fileId) => {
  if (!fileId) {
    throw new Error("fileId is required to fetch metadata");
  }

  try {
    const { data } = await apiClient.get(`/uploads/${fileId}/metadata`);
    return data;
  } catch (error) {
    console.error(`Failed to load metadata for file ${fileId}`, error);
    throw error;
  }
};

/**
 * Upload a single attachment file to the backend upload endpoint.
 * The backend is expected to handle persistence (e.g., Supabase Storage)
 * and return metadata including a public `url` or an `id` that can be
 * later used to download the file via `/uploads/:id/download`.
 * @param {File} file
 * @returns {Promise<object>} metadata returned by server
 */
export const uploadAttachment = async (file) => {
  if (!file) throw new Error("file is required for upload");

  const formData = new FormData();
  // Use field name 'file' to match backend expectation
  formData.append("file", file, file.name);

  try {
    const { data } = await apiClient.uploadFile(`/uploads`, formData);
    // Return whatever the backend returns (flexible)
    return data;
  } catch (error) {
    console.error("Failed to upload attachment:", error);
    throw error;
  }
};

export const downloadAttachmentFile = async (fileId) => {
  if (!fileId) {
    throw new Error("fileId is required to download an attachment");
  }

  const { blob, headers } = await apiClient.download(
    `/uploads/${fileId}/download`,
  );

  const fileName =
    parseFileNameFromDisposition(headers?.["content-disposition"]) ||
    `archivo-${fileId}`;

  return {
    blob,
    fileName,
    mimeType: headers?.["content-type"] || "application/octet-stream",
    size: headers?.["content-length"]
      ? Number(headers["content-length"])
      : undefined,
  };
};
