// src/features/admin/ai-agents/AgentListPage.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import toast from "react-hot-toast";

// --- NUEVO: Importaciones necesarias para el modal dinámico ---
import { useAgents, useCreateAgent, useDeleteAgent } from "../hooks/useAgents";
import DynamicFormModal from "@/shared/components/ui/DynamicFormModal";
import Button from "@/shared/components/ui/Button";
import DynamicTable from "@/shared/components/ui/DynamicTable";
import EmptyState from "@/shared/components/ui/EmptyState";
import PageHeader from "@/shared/components/layout/PageHeader";
import { FiActivity } from "react-icons/fi";

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

  const columns = useMemo(() => [
    { key: "nombre", label: "Nombre", sortable: true, className: "text-dt-foreground font-medium" },
    { key: "descripcion", label: "Descripción", sortable: true, className: "text-dt-subtle truncate max-w-md text-sm" },
    { key: "umbralConfianza", label: "Umbral", sortable: true, className: "text-dt-subtle font-mono" },
    {
      key: "actions",
      label: "Acciones",
      headerClassName: "text-right",
      className: "text-right",
      render: (agent) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/ai-agents/edit/${agent.id}`)}>
            Editar
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDelete(agent.id)} disabled={deleteAgentMutation.isLoading}>
            Eliminar
          </Button>
        </div>
      ),
    },
  ], [navigate, deleteAgentMutation.isLoading]);

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
      <PageHeader
        icon={FiActivity}
        title="Configuración de Agentes de IA"
        description="Crea y administra agentes basados en IA"
        action={{ label: "Crear Agente", onClick: () => setIsModalOpen(true), variant: "primary" }}
      />

      <div className="bg-dt-card border border-dt-border rounded-lg overflow-hidden">
        <DynamicTable
          columns={columns}
          data={sortedAgents}
          sortConfig={sortConfig}
          onSort={handleSort}
          isLoading={isLoading}
          emptyState={<EmptyState title="No hay agentes" description="Crea tu primer agente para comenzar" action={{ label: "Crear Agente", onClick: () => setIsModalOpen(true) }} />}
        />
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
