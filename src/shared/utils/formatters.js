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

/**
 * Formats a date as a relative time string (e.g., "hace 2 horas")
 * @param {Date} date - The date to format
 * @returns {string} - The formatted relative time string
 */
export const formatDistanceToNow = (date) => {
  const now = new Date();
  const diff = now - date;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  if (seconds < 60) {
    return "hace unos segundos";
  } else if (minutes < 60) {
    return `hace ${minutes} ${minutes === 1 ? "minuto" : "minutos"}`;
  } else if (hours < 24) {
    return `hace ${hours} ${hours === 1 ? "hora" : "horas"}`;
  } else if (days < 7) {
    return `hace ${days} ${days === 1 ? "día" : "días"}`;
  } else if (weeks < 4) {
    return `hace ${weeks} ${weeks === 1 ? "semana" : "semanas"}`;
  } else if (months < 12) {
    return `hace ${months} ${months === 1 ? "mes" : "meses"}`;
  } else {
    return `hace ${years} ${years === 1 ? "año" : "años"}`;
  }
};

// Podríamos añadir más formateadores aquí (prioridad, etiquetas, etc.)