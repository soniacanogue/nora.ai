// src/data/mockLogEventos.js

/**
 * Simula una tabla de Log de Eventos del sistema.
 * Cada evento representa una acción significativa sobre un ticket.
 *
 * Tipos de evento:
 * - 'TICKET_ASIGNADO': Cuando un ticket se asigna a un agente.
 * - 'CLIENTE_RESPONDIO': Cuando un cliente envía un nuevo mensaje en un ticket existente.
 * - 'TICKET_ESCALADO': Cuando un ticket es movido a Nivel 2.
 * - 'NOTA_INTERNA': Cuando se añade una nota interna a un ticket.
 */
export const mockLogEventos = [
  // --- Eventos para Brenda (Agente Nivel 1) ---
  {
    id: "evt-001",
    tipo: "CLIENTE_RESPONDIO",
    ticketId: "TICKET-006", // Ticket de devolución
    agenteId: "c7b5a2e0-f2a8-4f7a-8b1e-9d2c5e6f8a3b", // Brenda
    timestamp: "2023-10-28T09:00:00Z",
    metadata: {
      mensaje: "Cliente respondió en ticket de devolución.",
      cliente: "Sofia Reyes",
    },
  },
  {
    id: "evt-002",
    tipo: "TICKET_ESCALADO",
    ticketId: "TICKET-003",
    agenteId: "c7b5a2e0-f2a8-4f7a-8b1e-9d2c5e6f8a3b", // Brenda escaló este ticket
    timestamp: "2023-10-26T15:15:00Z",
    metadata: {
      mensaje: "Escalaste un ticket por problema de compatibilidad.",
      especialistaSugerido: "Carlos Vega",
    },
  },

  // --- Eventos para Carlos (Agente Nivel 2) ---
  {
    id: "evt-003",
    tipo: "TICKET_ASIGNADO",
    ticketId: "TICKET-004", // Ticket del mouse dañado
    agenteId: "f4e8d9c1-b3a5-4e7d-9f2a-1c8b6e5d7f4a", // Carlos
    timestamp: "2023-10-25T09:00:00Z",
    metadata: {
      mensaje: "Se te asignó un ticket por producto dañado.",
      asignadoPor: "Sistema (automático)",
    },
  },
  {
    id: "evt-004",
    tipo: "NOTA_INTERNA",
    ticketId: "TICKET-003",
    agenteId: "f4e8d9c1-b3a5-4e7d-9f2a-1c8b6e5d7f4a", // Carlos, aunque lo escaló Brenda
    timestamp: "2023-10-26T15:20:00Z",
    metadata: {
      mensaje: "Brenda dejó una nota en un ticket escalado.",
      autorNota: "Brenda Diaz",
    },
  },

  // --- Evento General sin agente específico (para que aparezca en la cola de triaje) ---
  {
    id: "evt-005",
    tipo: "NUEVO_TICKET_IA",
    ticketId: "TICKET-001",
    agenteId: null, // No asignado, es para todos los de Nivel 1
    timestamp: "2023-10-27T10:00:00Z",
    metadata: {
      mensaje: "Nueva sugerencia de IA lista para triaje.",
      confianza: 0.98,
    },
  },
];