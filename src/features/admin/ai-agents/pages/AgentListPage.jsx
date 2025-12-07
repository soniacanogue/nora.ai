// src/features/admin/ai-agents/AgentListPage.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import toast from "react-hot-toast";

// --- NUEVO: Importaciones necesarias para el modal dinámico ---
import { useAgents, useCreateAgent, useDeleteAgent } from "../hooks/useAgents";
import DynamicFormModal from "@/shared/components/ui/DynamicFormModal";
import Button from "@/shared/components/ui/Button";

export function AgentListPage() {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({ key: "nombre", order: "asc" });

  // --- NUEVO: Estado para controlar la visibilidad del modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: agents, isLoading, error } = useAgents();
  const deleteAgentMutation = useDeleteAgent();
  // --- NUEVO: Hook de mutación para crear el agente ---
  const createAgentMutation = useCreateAgent();

  const sortedAgents = useMemo(() => {
    if (!agents) return [];
    let result = [...agents];
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        if (typeof aValue === "string" && typeof bValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        if (aValue < bValue) return sortConfig.order === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.order === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [agents, sortConfig]);

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
      deleteAgentMutation.mutate(id, {
        onSuccess: () => toast.success("Agente eliminado"),
        onError: (err) => toast.error(err.message || "Error al eliminar"),
      });
    }
  };

  // --- NUEVO: La configuración para el formulario de creación de agentes ---
  const agentFormConfig = {
    fields: {
      nombre: {
        label: "Nombre del Agente",
        placeholder: "Ej: Agente WISMO",
        required: true,
      },
      descripcion: {
        label: "Descripción",
        type: "textarea",
        rows: 3,
        placeholder: "Describe brevemente la especialidad de este agente...",
      },
      promptBase: {
        label: "Prompt Base",
        type: "textarea",
        rows: 10,
        required: true,
        placeholder: "Eres un asistente de soporte de GearUp Gadgets...",
      },
      umbralConfianza: {
        label: "Umbral de Confianza (0.0 - 1.0)",
        type: "number",
        step: 0.01,
        defaultValue: 0.75,
        required: true,
      },
      promptsPorCanal: {
        label: "Prompts Específicos por Canal (JSON)",
        type: "textarea",
        rows: 5,
        defaultValue: "{}",
      },
    },
    buttons: {
      cancel: {
        label: "Cancelar",
        variant: "secondary",
        onClick: () => setIsModalOpen(false),
      },
      submit: {
        label: "Crear Agente",
        variant: "primary",
        // La lógica de envío es idéntica al patrón que usaste en TicketListPage
        onClick: (formData) => {
          let payload;
          try {
            // Validamos y parseamos el JSON antes de enviar
            payload = {
              ...formData,
              promptsPorCanal: JSON.parse(formData.promptsPorCanal),
            };
          } catch (e) {
            toast.error("El JSON de 'Prompts por Canal' no es válido.");
            return; // Detenemos la ejecución si el JSON es incorrecto
          }

          createAgentMutation.mutate(payload, {
            onSuccess: () => {
              toast.success("Agente creado exitosamente.");
              setIsModalOpen(false); // Cerramos el modal
            },
            onError: (err) => {
              toast.error(err.message || "Error al crear el agente.");
            },
          });
        },
      },
    },
  };

  if (isLoading) return <div>Cargando agentes...</div>;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-dt-foreground">
          Configuración de Agentes de IA
        </h1>
        {/* --- AJUSTE: El <Link> se reemplaza por un <Button> que abre el modal --- */}
        <Button
          variant="primary"
          size="md"
          fullWidth={false}
          onClick={() => setIsModalOpen(true)}
        >
          Crear Agente
        </Button>
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden shadow-sharp">
        <table className="w-full">
          {/* ... (el contenido de la tabla se mantiene exactamente igual) ... */}
          <thead className="bg-white/5 text-left text-dt-subtle text-xs uppercase tracking-wider font-mono border-b border-white/10">
            <tr>
              <th
                className="p-4 text-left cursor-pointer hover:text-dt-accent transition-colors"
                onClick={() => handleSort("nombre")}
              >
                Nombre {getSortIcon("nombre")}
              </th>
              <th
                className="p-4 text-left cursor-pointer hover:text-dt-accent transition-colors"
                onClick={() => handleSort("descripcion")}
              >
                Descripción {getSortIcon("descripcion")}
              </th>
              <th
                className="p-4 text-left cursor-pointer hover:text-dt-accent transition-colors"
                onClick={() => handleSort("umbralConfianza")}
              >
                Umbral {getSortIcon("umbralConfianza")}
              </th>
              <th className="p-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sortedAgents?.map((agent) => (
              <tr
                key={agent.id}
                className="hover:bg-white/5 transition-colors group"
              >
                <td className="p-4 text-dt-foreground font-medium">
                  {agent.nombre}
                </td>
                <td className="p-4 text-dt-subtle truncate max-w-md text-sm">
                  {agent.descripcion}
                </td>
                <td className="p-4 text-dt-subtle font-mono">
                  {agent.umbralConfianza}
                </td>
                <td className="p-4 text-right space-x-4">
                  <Button
                    variant="link"
                    onClick={() =>
                      navigate(`/admin/ai-agents/edit/${agent.id}`)
                    }
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

      {/* --- NUEVO: El componente DynamicFormModal renderizado en la página --- */}
      <DynamicFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crear Nuevo Agente de IA"
        config={agentFormConfig}
      />
    </div>
  );
}
