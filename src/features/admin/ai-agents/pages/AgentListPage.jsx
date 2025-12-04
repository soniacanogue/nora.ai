// src/features/admin/ai-agents/AgentListPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAgents, useDeleteAgent } from "../hooks/useAgents";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import Button from "@/shared/components/ui/Button"; // Usando tu componente Button

export function AgentListPage() {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({ key: "nombre", order: "asc" });

  // Usamos el hook con el estado de ordenamiento
  const { data: agents, isLoading, error } = useAgents(sortConfig);
  const deleteAgentMutation = useDeleteAgent();

  // Replicamos la lógica de ordenamiento de TicketListPage
  const handleSort = (key) => {
    let order = "asc";
    if (sortConfig.key === key && sortConfig.order === "asc") {
      order = "desc";
    }
    setSortConfig({ key, order });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.order === "asc" ? (
      <FaArrowUp className="inline ml-1" />
    ) : (
      <FaArrowDown className="inline ml-1" />
    );
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este agente?")) {
      deleteAgentMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Cargando agentes...</div>; // TODO: Usar un Skeleton
  if (error)
    return (
      <div className="text-red-500">
        Error al cargar los agentes: {error.message}
      </div>
    );

  return (
    <div>
      {/* Layout del header idéntico a TicketListPage */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-dt-foreground">
          Configuración de Agentes de IA
        </h1>
        <Link to="/admin/agents/new">
          <Button variant="secondary" size="md" fullWidth={false}>
            Crear Agente
          </Button>
        </Link>
      </div>

      {/* Estilo del contenedor de la tabla idéntico a TicketListPage */}
      <div className="bg-dt-primary border border-secondary rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-secondary">
            <tr>
              <th
                className="p-4 text-left cursor-pointer"
                onClick={() => handleSort("nombre")}
              >
                Nombre {getSortIcon("nombre")}
              </th>
              <th className="p-4 text-left">Descripción</th>
              <th
                className="p-4 text-left cursor-pointer"
                onClick={() => handleSort("umbralConfianza")}
              >
                Umbral {getSortIcon("umbralConfianza")}
              </th>
              <th className="p-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {agents?.map((agent) => (
              <tr
                key={agent.id}
                className="border-b border-secondary hover:bg-white/5 transition-colors"
              >
                <td className="p-4 text-dt-foreground">{agent.nombre}</td>
                <td className="p-4 text-dt-subtle truncate max-w-md">
                  {agent.descripcion}
                </td>
                <td className="p-4 text-dt-subtle">{agent.umbralConfianza}</td>
                <td className="p-4 text-right space-x-4">
                  <Button
                    variant="link"
                    onClick={() => navigate(`/admin/agents/edit/${agent.id}`)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger-link"
                    onClick={() => handleDelete(agent.id)}
                    disabled={deleteAgentMutation.isLoading}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
