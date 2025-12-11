// src/features/admin/templates/TemplateFormPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { useTemplate, useCreateTemplate, useUpdateTemplate } from "./hooks";
import Input from "@/shared/components/ui/Input";
import Button from "@/shared/components/ui/Button";
import PageHeader from "@/shared/components/layout/PageHeader";
import { FiFileText } from "react-icons/fi";

export function TemplateFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const { data: template, isLoading: isLoadingTemplate } = useTemplate(id);
  const createTemplateMutation = useCreateTemplate();
  const updateTemplateMutation = useUpdateTemplate();

  const [formData, setFormData] = useState({
    nombre: "",
    plantillaAsunto: "",
    plantillaCuerpo: "",
  });

  useEffect(() => {
    if (isEditing && template) {
      setFormData({
        nombre: template.nombre || "",
        plantillaAsunto: template.plantillaAsunto || "",
        plantillaCuerpo: template.plantillaCuerpo || "",
      });
    }
  }, [template, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      updateTemplateMutation.mutate(
        { id, data: formData },
        {
          onSuccess: () => {
            toast.success("Plantilla actualizada exitosamente");
            navigate("/admin/templates");
          },
          onError: () => {
            toast.error("Error al actualizar la plantilla");
          },
        }
      );
    } else {
      createTemplateMutation.mutate(formData, {
        onSuccess: () => {
          toast.success("Plantilla creada exitosamente");
          navigate("/admin/templates");
        },
        onError: () => {
          toast.error("Error al crear la plantilla");
        },
      });
    }
  };

  if (isEditing && isLoadingTemplate) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditing ? "Editar Plantilla" : "Nueva Plantilla"}
        subtitle={isEditing ? "Modifica los detalles de la plantilla" : "Crea una nueva plantilla de respuesta"}
        icon={FiFileText}
      />

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-dt-foreground mb-2">
            Nombre de la Plantilla *
          </label>
          <Input
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ej: Respuesta a consulta de devolución"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dt-foreground mb-2">
            Asunto del Correo *
          </label>
          <Input
            name="plantillaAsunto"
            value={formData.plantillaAsunto}
            onChange={handleChange}
            placeholder="Ej: Sobre tu solicitud de devolución - Ticket #{{ticket.id}}"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dt-foreground mb-2">
            Cuerpo de la Plantilla *
          </label>
          <textarea
            name="plantillaCuerpo"
            value={formData.plantillaCuerpo}
            onChange={handleChange}
            rows={12}
            className="w-full px-3 py-2 border border-dt-border rounded-md focus:outline-none focus:ring-2 focus:ring-dt-accent focus:border-transparent resize-vertical"
            placeholder="Hola {{cliente.nombre}},&#10;&#10;Gracias por contactarnos..."
            required
          />
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            isLoading={createTemplateMutation.isPending || updateTemplateMutation.isPending}
          >
            {isEditing ? "Guardar Cambios" : "Crear Plantilla"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/admin/templates")}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}