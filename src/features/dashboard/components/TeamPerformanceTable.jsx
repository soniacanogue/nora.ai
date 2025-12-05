// src/features/dashboard/components/TeamPerformanceTable.jsx
import React, { useState, useMemo } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const TeamPerformanceTable = ({ teamPerformance = [] }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, order: "asc" });

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      order: prev.key === key && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.order === "asc" ? (
      <FaArrowUp className="inline ml-1" />
    ) : (
      <FaArrowDown className="inline ml-1" />
    );
  };

  const sortedData = useMemo(() => {
    if (!teamPerformance) return [];
    let result = [...teamPerformance];
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        if (typeof aValue === 'string' && typeof bValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        }
        if (aValue < bValue) return sortConfig.order === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.order === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [teamPerformance, sortConfig]);

  if (!teamPerformance || teamPerformance.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6 shadow-glow">
        <h3 className="text-lg font-bold text-dt-foreground mb-4">
          Rendimiento del Equipo
        </h3>
        <p className="text-dt-subtle">No hay datos disponibles.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6 shadow-glow">
      <h3 className="text-lg font-bold text-dt-foreground mb-4">
        Rendimiento del Equipo
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th 
                className="text-left py-3 px-4 text-xs uppercase tracking-wider font-semibold text-dt-subtle cursor-pointer hover:text-dt-foreground transition-colors"
                onClick={() => handleSort("agentName")}
              >
                Agente {getSortIcon("agentName")}
              </th>
              <th 
                className="text-center py-3 px-4 text-xs uppercase tracking-wider font-semibold text-dt-subtle cursor-pointer hover:text-dt-foreground transition-colors"
                onClick={() => handleSort("assigned")}
              >
                Tickets Asignados {getSortIcon("assigned")}
              </th>
              <th 
                className="text-center py-3 px-4 text-xs uppercase tracking-wider font-semibold text-dt-subtle cursor-pointer hover:text-dt-foreground transition-colors"
                onClick={() => handleSort("resolvedToday")}
              >
                Tickets Resueltos Hoy {getSortIcon("resolvedToday")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sortedData.map((agent) => (
              <tr
                key={agent.assigneeId}
                className="hover:bg-white/5 transition-colors"
              >
                <td className="py-3 px-4 text-dt-foreground font-medium">
                  {agent.agentName}
                </td>
                <td className="py-3 px-4 text-center text-dt-foreground font-mono">
                  {agent.assigned}
                </td>
                <td className="py-3 px-4 text-center text-dt-success font-mono font-bold">
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
