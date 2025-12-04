// src/features/admin/ai-agents/mocks.js

// Usaremos un Map para simular una base de datos en memoria.
// Esto nos permite "mutar" los datos (crear, actualizar, eliminar).
const agentsDB = new Map();

const initialAgents = [
  {
    id: "ac-wismo-01",
    nombre: "WISMO - ¿Dónde está mi pedido?",
    descripcion: "Responde preguntas sobre el estado y seguimiento de pedidos.",
    promptBase:
      'Eres un asistente de soporte de GearUp Gadgets. El cliente pregunta por el estado de su pedido. Si tienes número de orden o tracking, incluye carrier, número de tracking y fecha estimada de entrega. Si no hay tracking, pide información mínima (número de orden). Responde en español, tono amable y conciso, máximo 5 frases. Devuelve JSON: {"reply_text":"...","escalate":false,"confidence":0.0,"suggested_tags":["WISMO"]}. Si el pedido parece perdido o tracking failed, marca escalate=true y explica por qué.',
    umbralConfianza: 0.9,
    promptsPorCanal: {}, // Por ahora, un objeto vacío
    actualizadoEn: "2023-10-28T10:00:00Z",
  },
  {
    id: "ac-returns-01",
    nombre: "Devoluciones - Proceso y RMA",
    descripcion: "Guía a los clientes a través del proceso de devolución.",
    promptBase:
      'Eres un asistente de soporte de GearUp Gadgets. El cliente pregunta cómo devolver un artículo. Explica brevemente el paso a paso para iniciar la devolución (plazo, condiciones, enlace a política), cuándo se emitirá el RMA y tiempos estimados de reembolso o reenvío. Si falta información crítica (número de orden, motivo), pídela. Responde en español y en formato JSON: {"reply_text":"...","escalate":false,"confidence":0.0,"suggested_tags":["RETURN"]}. Si el cliente exige reembolso inmediato o hay señales de fraude, sugiere escalate=true.',
    umbralConfianza: 0.8,
    promptsPorCanal: {},
    actualizadoEn: "2023-10-27T15:30:00Z",
  },
  {
    id: "ac-damaged-01",
    nombre: "Producto dañado",
    descripcion: "Maneja reportes de productos que llegaron dañados.",
    promptBase:
      'Eres un asistente de soporte de GearUp Gadgets. El cliente reporta producto dañado. Pide fotos y detalles (número de orden, fecha de recepción). Ofrece opciones: reenvío o reembolso, y explica pasos para RMA. Si hay foto adjunta o lenguaje urgente ("no funciona", "dañado"), marca escalate=true y explica razón. Responde en español y devuelve JSON: {"reply_text":"...","escalate":true_or_false,"confidence":0.0,"suggested_tags":["DAMAGED"]}. Prioriza escalado si hay evidencia visual.',
    umbralConfianza: 0.85,
    promptsPorCanal: {},
    actualizadoEn: "2023-10-29T09:00:00Z",
  },
];

// Llenamos nuestra "base de datos"
initialAgents.forEach((agent) => agentsDB.set(agent.id, agent));

// --- Funciones Mock que simulan la API ---

// Simula una llamada a la API con un retardo
const fakeApiCall = (data, delay = 500) =>
  new Promise((resolve) => setTimeout(() => resolve(data), delay));

export const mockGetAgents = () => {
  const agents = Array.from(agentsDB.values());
  return fakeApiCall(agents);
};

export const mockGetAgentById = (agentId) => {
  if (!agentsDB.has(agentId)) {
    return Promise.reject(new Error("Agent not found"));
  }
  return fakeApiCall(agentsDB.get(agentId));
};

export const mockCreateAgent = (agentData) => {
  const newId = `ac-mock-${Date.now()}`;
  const newAgent = {
    ...agentData,
    id: newId,
    promptsPorCanal: JSON.parse(agentData.promptsPorCanal || "{}"), // Simulamos el parseo que haría el backend
    actualizadoEn: new Date().toISOString(),
  };
  agentsDB.set(newId, newAgent);
  return fakeApiCall(newAgent);
};

export const mockUpdateAgent = ({ agentId, agentData }) => {
  if (!agentsDB.has(agentId)) {
    return Promise.reject(new Error("Agent not found"));
  }
  const updatedAgent = {
    ...agentsDB.get(agentId),
    ...agentData,
    promptsPorCanal:
      typeof agentData.promptsPorCanal === "string"
        ? JSON.parse(agentData.promptsPorCanal)
        : agentData.promptsPorCanal,
    actualizadoEn: new Date().toISOString(),
  };
  agentsDB.set(agentId, updatedAgent);
  return fakeApiCall(updatedAgent);
};

export const mockDeleteAgent = (agentId) => {
  if (!agentsDB.has(agentId)) {
    return Promise.reject(new Error("Agent not found"));
  }
  agentsDB.delete(agentId);
  return fakeApiCall({ success: true });
};
