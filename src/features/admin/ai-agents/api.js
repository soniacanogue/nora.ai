// src/features/admin/ai-agents/api.js
import { apiClient } from "@/shared/lib/apiClient";

/**
 * Fetches a list of AI agents from the API.
 * @param {object} filters - Filtering parameters (actualmente no se usan, pero se deja por consistencia).
 * @param {object} sort - Sorting parameters (ej. { key: 'nombre', order: 'asc' }).
 * @returns {Promise<Array>}
 */
export const getAgents = async (
  filters = {},
  sort = { key: "nombre", order: "asc" }
) => {
  console.log("Fetching AI agents with sort:", sort);
  try {
    // Replicamos el patrón de construcción de URLSearchParams visto en ticketsApi.js
    const params = new URLSearchParams();
    if (sort.key) {
      params.append("sortBy", sort.key);
    }
    if (sort.order) {
      params.append("sortOrder", sort.order);
    }

    const queryString = params.toString();
    const endpoint = `/config/agents${queryString ? `?${queryString}` : ""}`;

    const { data } = await apiClient.get(endpoint);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch AI agents:", error);
    return []; // Devolver array vacío en caso de error, como en ticketsApi.
  }
};

/**
 * Fetches a single AI agent by ID.
 * @param {string} id - The ID of the agent.
 * @returns {Promise<object|null>}
 */
export const getAgentById = async (id) => {
  console.log(`Fetching agent data for ID: ${id}...`);
  try {
    const { data } = await apiClient.get(`/config/agents/${id}`);
    return data;
  } catch (error) {
    console.error(`Failed to fetch agent ${id}:`, error);
    return null;
  }
};

/**
 * Creates a new AI agent.
 * @param {object} agentData - The data for the new agent.
 * @returns {Promise<object>}
 */
export const createAgent = async (agentData) => {
  console.log("Creating new agent with data:", agentData);
  const { data } = await apiClient.post("/config/agents", agentData);
  return data;
};

/**
 * Updates an existing AI agent.
 * @param {object} params - Contains id and agentData.
 * @param {string} params.id - The ID of the agent to update.
 * @param {object} params.agentData - The updated data.
 * @returns {Promise<object>}
 */
export const updateAgent = async ({ id, ...agentData }) => {
  console.log(`Updating agent ${id} with data:`, agentData);
  // Usamos PATCH para consistencia con el resto de la API (ej. claimTicket)
  const { data } = await apiClient.patch(`/config/agents/${id}`, agentData);
  return data;
};

/**
 * Deletes an AI agent.
 * @param {string} id - The ID of the agent to delete.
 * @returns {Promise<void>}
 */
export const deleteAgent = async (id) => {
  console.log(`Deleting agent ${id}`);
  await apiClient.delete(`/config/agents/${id}`);
};
