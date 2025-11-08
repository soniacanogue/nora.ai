// src/features/dashboard/api/getAgentDashboardData.js

// 1. Importa la FUNCIÓN GENERADORA, no el objeto estático
import { generateAgentDashboardData } from "./mockAgentDashboard";

// NOTA: Esta es una implementación MOCKEADA para desarrollo.
// La firma de esta función (aceptar un agentId) debe ser idéntica
// a la de la función real para facilitar el cambio futuro.

/**
 * Simula la obtención de datos para el dashboard de un agente específico.
 * @param {string} agentId - El ID del agente para el cual se obtienen los datos.
 * @returns {Promise<object>} Una promesa que resuelve con los datos del dashboard.
 */
export const getAgentDashboardData = async (agentId) => {
  // Valida que se haya pasado un agentId
  if (!agentId) {
    console.error("getAgentDashboardData MOCK called without an agentId.");
    return Promise.reject(new Error("Agent ID is required."));
  }

  console.log(`Fetching MOCKED dashboard data for agent: ${agentId}...`);

  // 2. Simulamos una demora de red para que el estado de carga sea visible
  await new Promise((resolve) => setTimeout(resolve, 500));

  // 3. Llamamos a la función generadora con el ID del agente
  const agentData = generateAgentDashboardData(agentId);

  // 4. Devolvemos una promesa resuelta con los datos generados dinámicamente
  return Promise.resolve(agentData);
};

// --- Implementación futura cuando el backend esté listo ---
/*
import { apiClient } from '@/shared/lib/apiClient';

// La firma de la función no necesita cambiar. ¡Esa es la ventaja!
// El backend obtendrá el ID del agente desde el token JWT, por lo que no es necesario pasarlo.
export const getAgentDashboardData = async () => {
  try {
    const response = await apiClient.get('/dashboards/agent');
    return response.data;
  } catch (error) {
    console.error("Error fetching agent dashboard data:", error);
    throw new Error("No se pudo cargar el dashboard del agente.");
  }
};
*/
