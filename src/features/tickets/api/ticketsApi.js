// src/features/tickets/api/ticketsApi.js

import { mockTickets } from "@/data/mockTickets";
import { mockClientes } from "@/data/mockClients";
import { mockOrdenes } from "@/data/mockOrders";
// En el futuro: import { apiClient } from '@/shared/lib/apiClient';

/**
 * Simula una llamada a la API para obtener una lista de tickets.
 * @param {object} params - Parámetros de filtrado y paginación.
 * @returns {Promise<Array>}
 */
export const getTickets = async (params = {}) => {
  console.log("Fetching MOCKED ticket list with params:", params);
  await new Promise((resolve) => setTimeout(resolve, 300));
  // Aquí iría la lógica de filtrado basada en los params
  return Promise.resolve(mockTickets);
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

  const cliente = mockClientes.find((c) => c.id === ticket.clienteId);
  const orden = mockOrdenes.find((o) => o.id === ticket.ordenId);

  const enrichedTicket = {
    ...ticket,
    cliente: cliente || { nombre: "Cliente Desconocido", correo: "" },
    orden: orden || null,
  };

  return Promise.resolve(enrichedTicket);
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
    payload
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
 * @returns {Promise<object>}
 */
export const escalateTicket = async (ticketId) => {
  console.log(`Executing MOCKED action 'escalate' on ticket ${ticketId}`);
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
    `Executing MOCKED action 'reassign' on ticket ${ticketId} to agent ${newAssigneeId}`
  );
  await new Promise((resolve) => setTimeout(resolve, 400));
  // Aquí, la lógica del backend cambiaría el 'assigneeId' del ticket.
  return Promise.resolve({
    success: true,
    message: `Ticket ${ticketId} reasignado.`,
  });
};

// --- FIN DE LAS CORRECCIONES ---
