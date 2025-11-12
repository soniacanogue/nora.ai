// src/features/tickets/api/ticketsApi.js

import { mockClientes } from "@/data/mockClients";
import { mockOrdenes } from "@/data/mockOrders";
import { mockTickets } from "@/data/mockTickets";

/**
 * Simula una llamada a la API para obtener una lista de tickets.
 * AHORA APLICA FILTROS Y ORDENAMIENTO.
 * @param {object} filters - Parámetros de filtrado.
 * @param {object} sort - Parámetros de ordenamiento.
 * @param {boolean} includeDetails - Si debe incluir detalles de cliente y orden.
 * @returns {Promise<Array>}
 */
export const getTickets = async (
  filters = {},
  sort = { key: "creadoEn", order: "asc" },
  includeDetails = true,
) => {
  console.log(
    "Fetching MOCKED ticket list with filters:",
    filters,
    "and sort:",
    sort,
    "includeDetails:",
    includeDetails,
  );
  await new Promise((resolve) => setTimeout(resolve, 300));

  let filteredTickets = [...mockTickets];
  // Aplicar filtros
  if (filters.status) {
    const statuses = filters.status.split(",");
    filteredTickets = filteredTickets.filter((ticket) =>
      statuses.includes(ticket.estado),
    );
  }
  if (filters.assigneeId) {
    if (filters.assigneeId === "unassigned") {
      filteredTickets = filteredTickets.filter((ticket) => !ticket.assigneeId);
    } else {
      // 'me' se resolvería en el backend, aquí lo simulamos con un ID fijo si es necesario
      filteredTickets = filteredTickets.filter(
        (ticket) => ticket.assigneeId === filters.assigneeId,
      );
    }
  }
  // Se podrían añadir más filtros aquí (por etiqueta, cliente, etc.)
  // Aplicar ordenamiento
  const priorityOrder = { urgente: 3, alta: 2, media: 1, baja: 0 };
  filteredTickets.sort((a, b) => {
    let valA, valB;

    if (sort.key === "prioridad") {
      valA = priorityOrder[a.prioridad] || 0;
      valB = priorityOrder[b.prioridad] || 0;
    } else if (sort.key === "creadoEn" || sort.key === "resueltoEn") {
      valA = new Date(a[sort.key] || 0);
      valB = new Date(b[sort.key] || 0);
    } else {
      valA = a[sort.key];
      valB = b[sort.key];
    }
    if (valA < valB) {
      return sort.order === "asc" ? -1 : 1;
    }
    if (valA > valB) {
      return sort.order === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Si se solicitan detalles, enriquecer los tickets
  if (includeDetails) {
    return await enrichTicketsWithDetails(filteredTickets);
  }

  return Promise.resolve(filteredTickets);
};

/**
 * Simula una llamada a la API para obtener un ticket por su ID.
 * Enriquece el ticket con los datos completos del cliente y la orden.
 * @param {string} ticketId - El ID del ticket a buscar.
 * @returns {Promise<object|null>}
 */
export const getTicketById = async (ticketId) => {
  console.log(`Fetching MOCKED ticket data for ID: ${ticketId}...`);
  await new Promise((resolve) => setTimeout(resolve, 500));

  const ticket = mockTickets.find((t) => t.id === ticketId);
  if (!ticket) {
    return Promise.resolve(null);
  }

  const enrichedTicket = await enrichTicketsWithDetails([ticket]);

  return Promise.resolve(enrichedTicket[0]);
};

/**
 * Enriquece una lista de tickets con los datos completos de clientes y órdenes.
 * @param {Array} tickets - Lista de tickets a enriquecer.
 * @returns {Promise<Array>} - Lista de tickets enriquecidos.
 */
export const enrichTicketsWithDetails = async (tickets) => {
  console.log(
    `Enriching ${tickets.length} tickets with client and order details...`,
  );
  await new Promise((resolve) => setTimeout(resolve, 100)); // Simula latencia

  const enrichedTickets = tickets.map((ticket) => {
    const cliente = mockClientes.find((c) => c.id === ticket.clienteId);
    const orden = mockOrdenes.find((o) => o.id === ticket.ordenId);

    return {
      ...ticket,
      cliente: cliente || { nombre: "Cliente Desconocido", correo: "" },
      orden: orden || null,
    };
  });

  return Promise.resolve(enrichedTickets);
};

/**
 * Simula una llamada a la API para ejecutar una acción sobre un ticket (ej. aprobar).
 * @param {string} ticketId - El ID del ticket.
 * @param {object} payload - Los datos para la acción (ej. { editedBody: "..." }).
 * @returns {Promise<object>}
 */
export const approveTicket = async (ticketId, payload) => {
  console.log(
    `Executing MOCKED action 'approve' on ticket ${ticketId} with payload:`,
    payload,
  );
  await new Promise((resolve) => setTimeout(resolve, 400));

  // En una API real, esto devolvería el ticket actualizado.
  // Aquí podemos devolver un simple éxito.
  return Promise.resolve({ success: true, ticketId });
};

// --- CORRECCIONES AÑADIDAS ---

/**
 * Simula la escalada de un ticket a Nivel 2.
 * @param {string} ticketId - El ID del ticket.
 * @param {string} note - Nota interna para el especialista de Nivel 2.
 * @returns {Promise<object>}
 */
export const escalateTicket = async (ticketId, note) => {
  console.log(
    `Executing MOCKED action 'escalate' on ticket ${ticketId} with note:`,
    note,
  );
  await new Promise((resolve) => setTimeout(resolve, 400));
  // Aquí, la lógica del backend cambiaría el estado del ticket a 'escalado_nivel_2'.
  return Promise.resolve({
    success: true,
    message: `Ticket ${ticketId} escalado.`,
  });
};

/**
 * Simula la reasignación de un ticket a otro agente.
 * @param {string} ticketId - El ID del ticket.
 * @param {string} newAssigneeId - El ID del nuevo agente.
 * @returns {Promise<object>}
 */
export const reassignTicket = async (ticketId, newAssigneeId) => {
  console.log(
    `Executing MOCKED action 'reassign' on ticket ${ticketId} to agent ${newAssigneeId}`,
  );
  await new Promise((resolve) => setTimeout(resolve, 400));
  // Aquí, la lógica del backend cambiaría el 'assigneeId' del ticket.
  return Promise.resolve({
    success: true,
    message: `Ticket ${ticketId} reasignado.`,
  });
};
/**
 * Simula la acción de "tomar" (claim) un ticket.
 * @param {string} ticketId - El ID del ticket.
 * @param {string} agentId - El ID del agente que toma el ticket.
 * @returns {Promise<object>}
 */
export const claimTicket = async (ticketId, agentId) => {
  console.log(
    `Executing MOCKED action 'claim' on ticket ${ticketId} by agent ${agentId}`,
  );
  await new Promise((resolve) => setTimeout(resolve, 400));

  // Simulación de race condition: 10% de probabilidad de que falle
  if (Math.random() < 0.1) {
    return Promise.reject(
      new Error("El ticket ya fue asignado a otro agente."),
    );
  }

  // Lógica para actualizar el mock (en un mundo real, esto lo hace el backend)
  const ticketIndex = mockTickets.findIndex((t) => t.id === ticketId);
  if (ticketIndex !== -1) {
    mockTickets[ticketIndex].assigneeId = agentId;
    mockTickets[ticketIndex].estado = "en_progreso_nivel_2";
  }

  return Promise.resolve({
    success: true,
    message: `Ticket ${ticketId} asignado a ti.`,
  });
};
