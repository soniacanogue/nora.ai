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
export const getTickets = async (
  filters = {},
  sort = { key: "creadoEn", order: "asc" },
  includeDetails = true,
) => {
  console.log(
    "Fetching ticket list with filters:",
    filters,
    "and sort:",
    sort,
    "includeDetails:",
    includeDetails,
  );

  try {
    // Build query params
    const params = new URLSearchParams();

    // Map 'status' filter to 'estado' query param
    if (filters.status) {
      params.append("estado", filters.status);
    }
    if (filters.assigneeId) {
      params.append("assigneeId", filters.assigneeId);
    }
    if (sort.key) {
      params.append("sortBy", sort.key);
    }
    if (sort.order) {
      params.append("sortOrder", sort.order);
    }
    if (includeDetails !== undefined) {
      params.append("includeDetails", includeDetails.toString());
    }

    const queryString = params.toString();
    const endpoint = `/tickets${queryString ? `?${queryString}` : ""}`;

    const { data } = await apiClient.get(endpoint);

    // Ensure we return an array
    return Array.isArray(data) ? data : [];
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
 * Enriches a list of tickets with client and order details.
 * Note: With real API, this might not be needed if the backend returns enriched data.
 * @param {Array} tickets - List of tickets to enrich.
 * @returns {Promise<Array>} - List of enriched tickets.
 */
export const enrichTicketsWithDetails = async (tickets) => {
  // With real API, tickets should already come enriched
  // This function is kept for backward compatibility
  return tickets.map((ticket) => ({
    ...ticket,
    cliente: ticket.cliente || { nombre: "Cliente Desconocido", correo: "" },
    orden: ticket.orden || null,
  }));
};

/**
 * Approves a ticket.
 * @param {string} ticketId - The ID of the ticket.
 * @param {object} payload - The payload for the action (e.g., { editedBody: "..." }).
 * @returns {Promise<object>}
 */
export const approveTicket = async (ticketId, payload) => {
  console.log(
    `Executing action 'approve' on ticket ${ticketId} with payload:`,
    payload,
  );

  try {
    const { data } = await apiClient.patch(`/tickets/${ticketId}`, {
      estado: "aprobado",
      ...payload,
    });
    return { success: true, ticketId, data };
  } catch (error) {
    console.error(`Failed to approve ticket ${ticketId}:`, error);
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
    const { data } = await apiClient.patch(`/tickets/${ticketId}`, {
      estado: "escalado_nivel_2",
      nota: note,
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
    const { data } = await apiClient.patch(`/tickets/${ticketId}`, {
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
