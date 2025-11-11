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

    // Calculate metrics for "this week" (mock - using same data with slight variation)
    const myResolvedThisWeek = Math.floor(myResolvedToday * 1.5);
    const myAssignedThisWeek = Math.floor(myAssigned * 1.2);

    const forTriageCount = mockTickets.filter((t) => t.estado === "ia_sugerido").length;
    const myEscalatedCount = mockTickets.filter((t) => t.assigneeId === agentId && t.estado === "en_progreso_nivel_2").length;
    const reopenedCount = mockTickets.filter((t) => t.assigneeId === agentId && t.estado === "reabierto").length;
    const customerRepliedCount = mockTickets.filter((t) => t.assigneeId === agentId && t.estado === "respuesta_cliente").length;
    const waitingForCustomerCount = mockTickets.filter((t) => t.assigneeId === agentId && t.estado === "esperando_cliente").length;

    // Aggregate tickets by status for the agent
    const myTicketsByStatus = mockTickets
        .filter((t) => t.assigneeId === agentId && t.estado !== "cerrado" && t.estado !== "fusionado")
        .reduce((acc, ticket) => {
            const status = ticket.estado;
            const existing = acc.find((item) => item.status === status);
            if (existing) {
                existing.count++;
            } else {
                acc.push({ status, count: 1 });
            }
            return acc;
        }, []);

    // Generate recent activity from agent's tickets
    const agentTickets = mockTickets.filter((t) => t.assigneeId === agentId);
    const recentActivity = agentTickets
        .slice(0, 5)
        .map((ticket, index) => {
            let message = "";
            if (ticket.estado === "respuesta_cliente") {
                message = `Cliente respondió en Ticket #${ticket.id}`;
            } else if (ticket.sugerenciaFusionId) {
                message = `Sugerencia de Fusión lista en Ticket #${ticket.id}`;
            } else if (ticket.estado === "ia_sugerido") {
                message = `Ticket #${ticket.id} listo para triaje`;
            } else {
                message = `Ticket #${ticket.id} asignado a ti`;
            }
            return {
                eventId: `evt-${index}`,
                ticketId: ticket.id, // Added ticketId for linking
                message,
                timestamp: ticket.creadoEn,
            };
        });

    return {
        // Updated structure with nested today/thisWeek
        myMetrics: {
            today: {
                resolved: myResolvedToday,
                assigned: myAssigned,
                avgResponseTime: "18m 25s",
            },
            thisWeek: {
                resolved: myResolvedThisWeek,
                assigned: myAssignedThisWeek,
                avgResponseTime: "22m 10s",
            },
        },
        // Keep old structure for backward compatibility during transition
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
        myTicketsByStatus,
        recentActivity: recentActivity.length > 0 ? recentActivity : [
            { eventId: "evt-1", ticketId: null, message: "No hay actividad reciente", timestamp: new Date().toISOString() },
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
