// src/features/admin/templates/TemplateListPage.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import toast from "react-hot-toast";

import { useTemplates, useCreateTemplate, useUpdateTemplate, useDeleteTemplate } from "./hooks";
import DynamicFormModal from "@/shared/components/ui/DynamicFormModal";
import Button from "@/shared/components/ui/Button";
import DynamicTable from "@/shared/components/ui/DynamicTable";
import EmptyState from "@/shared/components/ui/EmptyState";
import PageHeader from "@/shared/components/layout/PageHeader";
import { FiFileText } from "react-icons/fi";

export function TemplateListPage() {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({ key: "nombre", order: "asc" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  const { data: templates, isLoading, error } = useTemplates();
  const createTemplateMutation = useCreateTemplate();
  const updateTemplateMutation = useUpdateTemplate();
  const deleteTemplateMutation = useDeleteTemplate();

  const sortedTemplates = useMemo(() => {
    if (!templates) return [];
    let result = [...templates];
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        // Handle case-insensitive string comparison
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
  }, [templates, sortConfig]);

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
    { key: "nombre", label: "Nombre", sortable: true, className: "text-dt-foreground" },
    { key: "plantillaAsunto", label: "Asunto", sortable: true, className: "text-dt-subtle truncate max-w-md" },
    {
      key: "actions",
      label: "Acciones",
      headerClassName: "text-right",
      className: "text-right",
      render: (template) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setEditingTemplate(template)}>
            Editar
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDelete(template.id)} disabled={deleteTemplateMutation.isLoading}>
            Eliminar
          </Button>
        </div>
      ),
    },
  ], [navigate, deleteTemplateMutation.isLoading]);

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

  if (isLoading) return <div>Cargando plantillas...</div>;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <div>
      <PageHeader
        icon={FiFileText}
        title="Gestión de Plantillas"
        description={"Administra plantillas de correo y respuestas"}
        action={{ label: "Crear Plantilla", onClick: () => setIsModalOpen(true), variant: "secondary" }}
      />

      <div className="bg-dt-card border border-dt-border rounded-lg overflow-hidden">
        <DynamicTable
          columns={columns}
          data={sortedTemplates}
          sortConfig={sortConfig}
          onSort={handleSort}
          isLoading={isLoading}
          emptyState={
            <EmptyState
              title="No hay plantillas"
              description="Crea tu primera plantilla para comenzar"
              action={{ label: "Crear Plantilla", onClick: () => setIsModalOpen(true) }}
            />
          }
        />
      </div>

      <DynamicFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crear Nueva Plantilla"
        config={getTemplateFormConfig(false)}
      />

      {/* Modal para editar plantilla */}
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
