// src/features/dashboard/api/dashboardApi.js
import { mockTickets } from "@/data/mockTickets";
import { mockUsuarios } from "@/data/mockUsuarios";

/**
 * Generates mock dashboard data for a specific agent.
 * @param {string} agentId - The UUID of the agent.
 * @returns {object} - The aggregated dashboard data for the agent.
 */
const generateAgentDashboardData = (agentId) => {
    // Logic from mockAgentDashboard.js
    const myResolvedToday = mockTickets.filter(
        (t) => t.assigneeId === agentId && t.estado === "cerrado"
    ).length;

    const myAssigned = mockTickets.filter(
        (t) =>
            t.assigneeId === agentId &&
            t.estado !== "cerrado" &&
            t.estado !== "fusionado"
    ).length;

    const forTriageCount = mockTickets.filter((t) => t.estado === "ia_sugerido").length;
    const myEscalatedCount = mockTickets.filter((t) => t.assigneeId === agentId && t.estado === "en_progreso_nivel_2").length;
    const reopenedCount = mockTickets.filter((t) => t.assigneeId === agentId && t.estado === "reabierto").length;
    const customerRepliedCount = mockTickets.filter((t) => t.assigneeId === agentId && t.estado === "respuesta_cliente").length;
    const waitingForCustomerCount = mockTickets.filter((t) => t.assigneeId === agentId && t.estado === "esperando_cliente").length;

    return {
        myMetricsToday: {
            resolved: myResolvedToday,
            assigned: myAssigned,
            avgResponseTime: "18m 25s",
        },
        myQueues: {
            forTriage: forTriageCount,
            myEscalated: myEscalatedCount,
            reopened: reopenedCount,
            customerReplied: customerRepliedCount,
            waitingForCustomer: waitingForCustomerCount,
        },
        recentActivity: [
            { eventId: "evt-1", message: "Cliente respondió en Ticket #TICKET-006", timestamp: "2023-10-28T09:00:00Z" },
            { eventId: "evt-2", message: "Sugerencia de Fusión lista en Ticket #TICKET-005", timestamp: "2023-10-27T14:01:00Z" },
            { eventId: "evt-3", message: "Ticket #TICKET-004 asignado a ti", timestamp: "2023-10-25T09:15:00Z" },
        ],
    };
};

/**
 * Simulates fetching dashboard data for a specific agent.
 * @param {string} agentId - The ID of the agent for whom to fetch data.
 * @returns {Promise<object>} A promise that resolves with the dashboard data.
 */
export const getAgentDashboardData = async (agentId) => {
    if (!agentId) {
        console.error("getAgentDashboardData MOCK called without an agentId.");
        return Promise.reject(new Error("Agent ID is required."));
    }
    console.log(`Fetching MOCKED dashboard data for agent: ${agentId}...`);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const agentData = generateAgentDashboardData(agentId);
    return Promise.resolve(agentData);
};

/**
 * Generates aggregated data for the admin dashboard.
 */
const generateAdminDashboardData = () => {
    // Logic from mockAdminDashboard.js
    const kpis = {
        today: {
            created: mockTickets.length,
            resolved: mockTickets.filter((t) => t.estado === "cerrado").length,
            avgFirstResponseTime: 15,
            avgResolutionTime: 120,
        },
        last7Days: {
            created: mockTickets.length,
            resolved: mockTickets.filter((t) => t.estado === "cerrado").length,
            avgFirstResponseTime: 25,
            avgResolutionTime: 180,
        },
    };

    const workload = mockTickets.reduce((acc, ticket) => {
        const status = ticket.estado;
        const existing = acc.find((item) => item.status === status);
        if (existing) {
            existing.count++;
        } else {
            acc.push({ status, count: 1 });
        }
        return acc;
    }, []);

    const teamPerformance = mockUsuarios
        .filter((u) => u.rol === "AGENTE")
        .map((agent) => ({
            assigneeId: agent.id,
            agentName: agent.nombre,
            assigned: mockTickets.filter((t) => t.assigneeId === agent.id && t.estado !== "cerrado").length,
            resolvedToday: mockTickets.filter((t) => t.assigneeId === agent.id && t.estado === "cerrado").length,
        }));

    const distributionByChannel = mockTickets.reduce((acc, ticket) => {
        const channel = ticket.canalOrigen;
        const existing = acc.find((item) => item.channel === channel);
        if (existing) {
            existing.count++;
        } else {
            acc.push({ channel, count: 1 });
        }
        return acc;
    }, []);

    const distributionByTag = mockTickets.reduce((acc, ticket) => {
        const tagName = ticket.etiquetas[0]?.nombre || "Sin Etiqueta";
        const existing = acc.find((item) => item.tag === tagName);
        if (existing) {
            existing.count++;
        } else {
            acc.push({ tag: tagName, count: 1 });
        }
        return acc;
    }, []);

    return {
        kpis,
        workload,
        teamPerformance,
        distribution: {
            byChannel: distributionByChannel,
            byTag: distributionByTag,
        },
    };
};

/**
 * Simulates fetching dashboard data for an admin.
 * @returns {Promise<object>} A promise that resolves with the dashboard data.
 */
export const getAdminDashboardData = async () => {
    console.log("Fetching MOCKED admin dashboard data...");
    await new Promise((resolve) => setTimeout(resolve, 500));
    const adminData = generateAdminDashboardData();
    return Promise.resolve(adminData);
};
