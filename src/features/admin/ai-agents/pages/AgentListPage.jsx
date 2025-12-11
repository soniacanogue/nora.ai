import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAgents, useCreateAgent, useUpdateAgent, useDeleteAgent } from "../hooks/useAgents";
import DynamicFormModal from "@/shared/components/ui/DynamicFormModal";
import Button from "@/shared/components/ui/Button";
import DynamicTable from "@/shared/components/ui/DynamicTable";
import EmptyState from "@/shared/components/ui/EmptyState";
import ErrorState from "@/shared/components/ui/ErrorState";
import PageHeader from "@/shared/components/layout/PageHeader";
import FilterPanel from "@/shared/components/ui/FilterPanel";
import { FiActivity, FiPlus, FiFilter, FiSearch, FiEdit2, FiTrash2 } from "react-icons/fi";

export function AgentListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const pageParam = Number(searchParams.get("page") || 1);
  const limitParam = Number(searchParams.get("limit") || 25);
  const sortBy = searchParams.get("sortBy") || "nombre";
  const sortOrder = searchParams.get("sortOrder") || "asc";

  const sortConfig = { key: sortBy, order: sortOrder };

  const { data: agents, isLoading, error } = useAgents();
  const deleteAgentMutation = useDeleteAgent();
  const createAgentMutation = useCreateAgent();
  const updateAgentMutation = useUpdateAgent();

  const handleSort = (key) => {
    const newOrder = sortBy === key && sortOrder === "asc" ? "desc" : "asc";
    const params = new URLSearchParams(searchParams);
    params.set("sortBy", key);
    params.set("sortOrder", newOrder);
    setSearchParams(params);
  };

  const filterConfig = useMemo(() => [], []);

  const handleFilterChange = (key, value) => {
    // Ready for future filters
  };

  const filteredAgents = useMemo(() => {
    let result = agents || [];

    // Filter by search
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter((agent) => {
        const nombre = (agent.nombre || "").toString().toLowerCase();
        const descripcion = (agent.descripcion || "").toString().toLowerCase();
        return nombre.includes(search) || descripcion.includes(search);
      });
    }

    return result;
  }, [agents, searchTerm]);

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este agente?")) {
      deleteAgentMutation.mutate(id, {
        onSuccess: () => toast.success("Agente eliminado"),
        onError: (err) => toast.error(err.message || "Error al eliminar"),
      });
    }
  };

  const columns = useMemo(() => [
    { 
      key: "nombre", 
      label: "Nombre", 
      sortable: true, 
      className: "text-dt-foreground font-medium",
      render: (agent) => agent.nombre || "—",
    },
    { 
      key: "descripcion", 
      label: "Descripción", 
      sortable: true, 
      className: "text-dt-subtle text-sm",
      render: (agent) => (
        <div className="truncate max-w-md" title={agent.descripcion}>
          {agent.descripcion || "—"}
        </div>
      ),
    },
    { 
      key: "modelo", 
      label: "Modelo", 
      sortable: true, 
      className: "text-dt-subtle font-mono text-xs",
      render: (agent) => agent.modelo || "—",
    },
    { 
      key: "umbralConfianza", 
      label: "Umbral", 
      sortable: true, 
      className: "text-dt-subtle font-mono",
      render: (agent) => agent.umbralConfianza?.toFixed(2) || "—",
    },
    {
      key: "actions",
      label: "Acciones",
      headerClassName: "text-right",
      className: "text-right",
      render: (agent) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setEditingAgent(agent)}
            className="p-2 text-dt-subtle hover:text-dt-accent transition-colors"
            title="Editar"
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={() => handleDelete(agent.id)}
            className="p-2 text-dt-subtle hover:text-red-500 transition-colors"
            title="Eliminar"
            disabled={deleteAgentMutation.isLoading}
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      ),
    },
  ], [deleteAgentMutation.isLoading, handleDelete]);

  // --- NUEVO: La configuración para el formulario de creación/edición de agentes ---
  const getAgentFormConfig = (isEditing = false) => ({
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
      modelo: {
        label: "Modelo de IA",
        placeholder: "ej: x-ai/grok-4.1-fast:free",
        required: true,
      },
      temperatura: {
        label: "Temperatura (0.0 - 1.0)",
        type: "number",
        step: 0.1,
        min: 0,
        max: 1,
        defaultValue: 0.3,
        required: true,
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
        min: 0,
        max: 1,
        defaultValue: 0.75,
        required: true,
      },
      promptsPorCanal: {
        label: "Prompts Específicos por Canal (JSON)",
        type: "textarea",
        rows: 5,
        defaultValue: "{}",
        required: true,
      },
    },
    buttons: {
      cancel: {
        label: "Cancelar",
        variant: "secondary",
        onClick: () => {
          setIsModalOpen(false);
          setEditingAgent(null);
          setFormErrors({});
        },
      },
      submit: {
        label: (createAgentMutation.isLoading || updateAgentMutation.isLoading) 
          ? (isEditing ? "Guardando..." : "Creando...") 
          : (isEditing ? "Guardar Cambios" : "Crear Agente"),
        variant: "primary",
        disabled: createAgentMutation.isLoading || updateAgentMutation.isLoading,
        onClick: async (formData) => {
          try {
            setFormErrors({}); // Clear previous errors
            
            // Validate the data using the schema
            const agentSchema = (await import("../schemas")).agentSchema;
            const validationResult = await agentSchema.safeParseAsync(formData);
            
            if (!validationResult.success) {
              // Convert Zod errors to the format expected by DynamicFormModal
              const errors = validationResult.error.issues.reduce((acc, issue) => {
                acc[issue.path[0]] = issue.message;
                return acc;
              }, {});
              setFormErrors(errors);
              return;
            }

            const payload = validationResult.data;

            if (isEditing && editingAgent) {
              // Update existing agent
              updateAgentMutation.mutate({ id: editingAgent.id, data: payload }, {
                onSuccess: () => {
                  toast.success("Agente actualizado exitosamente.");
                  setEditingAgent(null);
                  setFormErrors({});
                },
                onError: (err) => {
                  toast.error(err.message || "Error al actualizar el agente.");
                },
              });
            } else {
              // Create new agent
              createAgentMutation.mutate(payload, {
                onSuccess: () => {
                  toast.success("Agente creado exitosamente.");
                  setIsModalOpen(false);
                  setFormErrors({});
                },
                onError: (err) => {
                  toast.error(err.message || "Error al crear el agente.");
                },
              });
            }
          } catch (error) {
            console.error("Validation error:", error);
            toast.error("Error en la validación del formulario");
          }
        },
      },
    },
  });

  if (error) {
    return (
      <div className="p-6">
        <ErrorState
          message="Error al cargar los agentes"
          details={error?.message}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <PageHeader
        icon={FiActivity}
        title="Gestión de Agentes de IA"
        description="Crea y administra agentes basados en IA"
      >
        <div className="flex gap-2">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="secondary"
            icon={FiFilter}
          >
            Filtros
          </Button>
          <Button onClick={() => setIsModalOpen(true)} variant="primary" icon={FiPlus}>
            Crear Agente
          </Button>
        </div>
      </PageHeader>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dt-subtle" />
          <input
            type="text"
            placeholder="Buscar agentes por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Advanced Filters */}
        <FilterPanel
          open={showFilters}
          config={filterConfig}
          values={{}}
          onChange={handleFilterChange}
        />
      </div>

      {/* Agents Table */}
      <DynamicTable
        columns={columns}
        data={filteredAgents}
        sortConfig={sortConfig}
        onSort={handleSort}
        isLoading={isLoading}
        page={pageParam}
        itemsPerPage={limitParam}
        onPageChange={(newPage) => {
          const params = new URLSearchParams(searchParams);
          params.set("page", String(newPage));
          setSearchParams(params);
        }}
        onItemsPerPageChange={(newLimit) => {
          const params = new URLSearchParams(searchParams);
          params.set("limit", String(newLimit));
          params.set("page", "1");
          setSearchParams(params);
        }}
        emptyState={
          <EmptyState
            icon={FiActivity}
            title="No hay agentes"
            description={
              searchTerm
                ? "No se encontraron agentes con los filtros aplicados"
                : "Crea tu primer agente para comenzar"
            }
            action={!searchTerm ? { label: "Crear Agente", onClick: () => setIsModalOpen(true) } : undefined}
          />
        }
      />

      {/* Create Modal */}
      {isModalOpen && (
        <DynamicFormModal
          title="Crear Nuevo Agente de IA"
          description="Configura un nuevo agente de IA"
          config={getAgentFormConfig(false)}
          onClose={() => {
            setIsModalOpen(false);
            setFormErrors({});
          }}
          errors={formErrors}
          isLoading={createAgentMutation.isPending}
        />
      )}

      {/* Edit Modal */}
      {editingAgent && (
        <DynamicFormModal
          title="Editar Agente de IA"
          description="Modifica la configuración del agente"
          config={getAgentFormConfig(true)}
          defaultValues={editingAgent}
          onClose={() => {
            setEditingAgent(null);
            setFormErrors({});
          }}
          errors={formErrors}
          isLoading={updateAgentMutation.isPending}
        />
      )}
    </div>
  );
}
