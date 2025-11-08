// src/features/dashboard/api/mockAdminDashboard.js

import { mockTickets } from "@/data/mockTickets";
import { mockUsuarios } from "@/data/mockUsuarios";

/**
 * Genera datos agregados para el dashboard de administrador.
 */
const generateAdminDashboardData = () => {
  // 1. KPIs Generales
  const kpis = {
    today: {
      created: mockTickets.length, // Simplificación: todos los tickets son de "hoy"
      resolved: mockTickets.filter((t) => t.estado === "cerrado").length,
      avgFirstResponseTime: 15, // Estático
      avgResolutionTime: 120, // Estático
    },
    last7Days: {
      // Se usan los mismos datos por simplicidad del mock
      created: mockTickets.length,
      resolved: mockTickets.filter((t) => t.estado === "cerrado").length,
      avgFirstResponseTime: 25,
      avgResolutionTime: 180,
    },
  };

  // 2. Carga de Trabajo Actual (Workload) por estado
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

  // 3. Rendimiento del Equipo
  const teamPerformance = mockUsuarios
    .filter((u) => u.rol === "AGENTE")
    .map((agent) => ({
      assigneeId: agent.id,
      agentName: agent.nombre,
      assigned: mockTickets.filter(
        (t) => t.assigneeId === agent.id && t.estado !== "cerrado"
      ).length,
      resolvedToday: mockTickets.filter(
        (t) => t.assigneeId === agent.id && t.estado === "cerrado"
      ).length,
    }));

  // 4. Distribución de Tickets (por Canal y Etiqueta)
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

export const mockAdminDashboardData = generateAdminDashboardData();
