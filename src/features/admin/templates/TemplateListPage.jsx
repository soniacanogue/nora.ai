import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useTemplates, useCreateTemplate, useUpdateTemplate, useDeleteTemplate } from "./hooks";
import DynamicFormModal from "@/shared/components/ui/DynamicFormModal";
import Button from "@/shared/components/ui/Button";
import DynamicTable from "@/shared/components/ui/DynamicTable";
import EmptyState from "@/shared/components/ui/EmptyState";
import ErrorState from "@/shared/components/ui/ErrorState";
import PageHeader from "@/shared/components/layout/PageHeader";
import FilterPanel from "@/shared/components/ui/FilterPanel";
import { FiFileText, FiPlus, FiFilter, FiSearch, FiEdit2, FiTrash2 } from "react-icons/fi";

export function TemplateListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const pageParam = Number(searchParams.get("page") || 1);
  const limitParam = Number(searchParams.get("limit") || 25);
  const sortBy = searchParams.get("sortBy") || "nombre";
  const sortOrder = searchParams.get("sortOrder") || "asc";

  const sortConfig = { key: sortBy, order: sortOrder };

  const { data: templates, isLoading, error } = useTemplates();
  const createTemplateMutation = useCreateTemplate();
  const updateTemplateMutation = useUpdateTemplate();
  const deleteTemplateMutation = useDeleteTemplate();

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

  const filteredTemplates = useMemo(() => {
    let result = templates || [];

    // Filter by search
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter((template) => {
        const nombre = (template.nombre || "").toString().toLowerCase();
        const asunto = (template.plantillaAsunto || "").toString().toLowerCase();
        const cuerpo = (template.plantillaCuerpo || "").toString().toLowerCase();
        return nombre.includes(search) || asunto.includes(search) || cuerpo.includes(search);
      });
    }

    return result;
  }, [templates, searchTerm]);

  const handleDelete = (id) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar esta plantilla?")
    ) {
      deleteTemplateMutation.mutate(id, {
        onSuccess: () => toast.success("Plantilla eliminada"),
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
      render: (template) => template.nombre || "—",
    },
    { 
      key: "plantillaAsunto", 
      label: "Asunto", 
      sortable: true, 
      className: "text-dt-subtle",
      render: (template) => (
        <div className="truncate max-w-md" title={template.plantillaAsunto}>
          {template.plantillaAsunto || "—"}
        </div>
      ),
    },
    {
      key: "plantillaCuerpo",
      label: "Vista Previa",
      className: "text-dt-subtle text-sm",
      render: (template) => (
        <div className="truncate max-w-xs" title={template.plantillaCuerpo}>
          {template.plantillaCuerpo ? template.plantillaCuerpo.substring(0, 50) + "..." : "—"}
        </div>
      ),
    },
    {
      key: "creadoEn",
      label: "Creado",
      sortable: true,
      className: "text-dt-subtle font-mono text-xs",
      render: (template) => new Date(template?.creadoEn || template?.createdAt || 0).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Acciones",
      headerClassName: "text-right",
      className: "text-right",
      render: (template) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setEditingTemplate(template)}
            className="p-2 text-dt-subtle hover:text-dt-accent transition-colors"
            title="Editar"
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={() => handleDelete(template.id)}
            className="p-2 text-dt-subtle hover:text-red-500 transition-colors"
            title="Eliminar"
            disabled={deleteTemplateMutation.isLoading}
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      ),
    },
  ], [deleteTemplateMutation.isLoading, handleDelete]);

  const getTemplateFormConfig = (isEditing = false) => ({
    fields: {
      nombre: {
        label: "Nombre de la Plantilla",
        placeholder: "Ej: Respuesta a consulta de devolución",
        required: true,
      },
      plantillaAsunto: {
        label: "Asunto del Correo",
        placeholder:
          "Ej: Sobre tu solicitud de devolución - Ticket #{{ticket.id}}",
        required: true,
      },
      plantillaCuerpo: {
        label: "Cuerpo de la Plantilla",
        type: "textarea",
        rows: 12,
        required: true,
        placeholder: "Hola {{cliente.nombre}},\n\nGracias por contactarnos...",
      },
    },
    buttons: {
      cancel: {
        label: "Cancelar",
        variant: "secondary",
        onClick: () => {
          setIsModalOpen(false);
          setEditingTemplate(null);
        },
      },
      submit: {
        label: (createTemplateMutation.isLoading || updateTemplateMutation.isLoading) 
          ? (isEditing ? "Guardando..." : "Creando...") 
          : (isEditing ? "Guardar Cambios" : "Crear Plantilla"),
        variant: "primary",
        disabled: createTemplateMutation.isLoading || updateTemplateMutation.isLoading,
        onClick: (formData) => {
          if (isEditing && editingTemplate) {
            // Update existing template
            updateTemplateMutation.mutate({ id: editingTemplate.id, data: formData }, {
              onSuccess: () => {
                toast.success("Plantilla actualizada exitosamente.");
                setEditingTemplate(null);
              },
              onError: (err) => {
                toast.error(err.message || "Error al actualizar la plantilla.");
              },
            });
          } else {
            // Create new template
            createTemplateMutation.mutate(formData, {
              onSuccess: () => {
                toast.success("Plantilla creada exitosamente.");
                setIsModalOpen(false);
              },
              onError: (err) => {
                toast.error(err.message || "Error al crear la plantilla.");
              },
            });
          }
        },
      },
    },
  });

  if (error) {
    return (
      <div className="p-6">
        <ErrorState
          message="Error al cargar las plantillas"
          details={error?.message}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <PageHeader
        icon={FiFileText}
        title="Gestión de Plantillas"
        description="Administra plantillas de correo y respuestas"
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
            Crear Plantilla
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
            placeholder="Buscar plantillas por nombre, asunto o contenido..."
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

      {/* Templates Table */}
      <DynamicTable
        columns={columns}
        data={filteredTemplates}
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
            icon={FiFileText}
            title="No hay plantillas"
            description={
              searchTerm
                ? "No se encontraron plantillas con los filtros aplicados"
                : "Crea tu primera plantilla para comenzar"
            }
            action={!searchTerm ? { label: "Crear Plantilla", onClick: () => setIsModalOpen(true) } : undefined}
          />
        }
      />

      {/* Create Modal */}
      {isModalOpen && (
        <DynamicFormModal
          title="Crear Nueva Plantilla"
          description="Configura una nueva plantilla de correo"
          config={getTemplateFormConfig(false)}
          onClose={() => setIsModalOpen(false)}
          isLoading={createTemplateMutation.isPending}
        />
      )}

      {/* Edit Modal */}
      {editingTemplate && (
        <DynamicFormModal
          title="Editar Plantilla"
          description="Modifica el contenido de la plantilla"
          config={getTemplateFormConfig(true)}
          defaultValues={editingTemplate}
          onClose={() => setEditingTemplate(null)}
          isLoading={updateTemplateMutation.isPending}
        />
      )}
    </div>
  );
}
