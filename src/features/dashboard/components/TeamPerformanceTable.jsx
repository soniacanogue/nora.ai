// src/features/dashboard/components/TeamPerformanceTable.jsx
import React from "react";

const TeamPerformanceTable = ({ teamPerformance = [] }) => {
  if (!teamPerformance || teamPerformance.length === 0) {
    return (
      <div className="bg-dt-primary p-6 rounded-lg border border-secondary">
        <h3 className="text-lg font-bold text-dt-foreground mb-4">
          Rendimiento del Equipo
        </h3>
        <p className="text-dt-subtle">No hay datos disponibles.</p>
      </div>
    );
  }

  return (
    <div className="bg-dt-primary p-6 rounded-lg border border-secondary">
      <h3 className="text-lg font-bold text-dt-foreground mb-4">
        Rendimiento del Equipo
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-secondary">
              <th className="text-left py-3 px-4 text-sm font-semibold text-dt-subtle">
                Agente
              </th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-dt-subtle">
                Tickets Asignados
              </th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-dt-subtle">
                Tickets Resueltos Hoy
              </th>
            </tr>
          </thead>
          <tbody>
            {teamPerformance.map((agent) => (
              <tr
                key={agent.assigneeId}
                className="border-b border-secondary hover:bg-dt-background transition-colors"
              >
                <td className="py-3 px-4 text-dt-foreground">
                  {agent.agentName}
                </td>
                <td className="py-3 px-4 text-center text-dt-foreground">
                  {agent.assigned}
                </td>
                <td className="py-3 px-4 text-center text-dt-foreground">
                  {agent.resolvedToday}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamPerformanceTable;
