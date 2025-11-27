/**
 * Mapeo de identificadores internos a etiquetas legibles por humanos.
 */
const TICKET_STATUS_MAP = {
  nuevo: "Nuevo",
  ia_sugerido: "Sugerencia de IA",
  en_progreso_nivel_2: "En Progreso (Nivel 2)",
  escalado_nivel_2: "Escalado (Nivel 2)",
  respuesta_cliente: "Respuesta del Cliente",
  esperando_cliente: "Esperando Cliente",
  reabierto: "Reabierto",
  cerrado: "Cerrado",
  fusionado: "Fusionado",
};

const CHANNEL_MAP = {
  correo: "Email",
  formulario_web: "Formulario Web",
  chat: "Chat",
  telefono: "Teléfono",
};

/**
 * Traduce un estado de ticket a un formato legible.
 * @param {string} status - El estado interno del ticket.
 * @returns {string} - La etiqueta legible.
 */
export const formatTicketStatus = (status) =>
  TICKET_STATUS_MAP[status] || status;

/**
 * Traduce un canal de origen a un formato legible.
 * @param {string} channel - El canal interno.
 * @returns {string} - La etiqueta legible.
 */
export const formatChannel = (channel) => CHANNEL_MAP[channel] || channel;

// Podríamos añadir más formateadores aquí (prioridad, etiquetas, etc.)