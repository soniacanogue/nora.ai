// src/features/admin/templates/TemplateListPage.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import toast from "react-hot-toast";

import { useTemplates, useCreateTemplate, useDeleteTemplate } from "./hooks";
import DynamicFormModal from "@/shared/components/ui/DynamicFormModal";
import Button from "@/shared/components/ui/Button";

export function TemplateListPage() {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({ key: "nombre", order: "asc" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: templates, isLoading, error } = useTemplates();
  const createTemplateMutation = useCreateTemplate();
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

  const templateFormConfig = {
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
        onClick: () => setIsModalOpen(false),
      },
      submit: {
        label: "Crear Plantilla",
        variant: "primary",
        onClick: (formData) => {
          createTemplateMutation.mutate(formData, {
            onSuccess: () => {
              toast.success("Plantilla creada exitosamente.");
              setIsModalOpen(false);
            },
            onError: (err) => {
              toast.error(err.message || "Error al crear la plantilla.");
            },
          });
        },
      },
    },
  };

  if (isLoading) return <div>Cargando plantillas...</div>;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-dt-foreground">
          Gestión de Plantillas
        </h1>
        <Button
          variant="secondary"
          size="md"
          onClick={() => setIsModalOpen(true)}
        >
          Crear Plantilla
        </Button>
      </div>

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
              <th
                className="p-4 text-left cursor-pointer"
                onClick={() => handleSort("plantillaAsunto")}
              >
                Asunto {getSortIcon("plantillaAsunto")}
              </th>
              <th className="p-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sortedTemplates?.map((template) => (
              <tr
                key={template.id}
                className="border-b border-secondary hover:bg-white/5 transition-colors"
              >
                <td className="p-4 text-dt-foreground">{template.nombre}</td>
                <td className="p-4 text-dt-subtle truncate max-w-md">
                  {template.plantillaAsunto}
                </td>
                <td className="p-4 text-right space-x-4">
                  <Button
                    variant="link"
                    onClick={() =>
                      navigate(`/admin/templates/edit/${template.id}`)
                    }
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger-link"
                    onClick={() => handleDelete(template.id)}
                    disabled={deleteTemplateMutation.isLoading}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DynamicFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crear Nueva Plantilla"
        config={templateFormConfig}
      />
    </div>
  );
}
