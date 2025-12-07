// Template form page for creating/editing a single template
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useTemplate, useCreateTemplate, useUpdateTemplate } from "./hooks";
import Button from "@/shared/components/ui/Button";

export function TemplateFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const { data: templateData, isLoading } = useTemplate(id);
  const createTemplate = useCreateTemplate();
  const updateTemplate = useUpdateTemplate();

  const [form, setForm] = useState({
    nombre: "",
    plantillaAsunto: "",
    plantillaCuerpo: "",
  });

  useEffect(() => {
    if (templateData) {
      setForm({
        nombre: templateData.nombre || "",
        plantillaAsunto: templateData.plantillaAsunto || "",
        plantillaCuerpo: templateData.plantillaCuerpo || "",
      });
    }
  }, [templateData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      updateTemplate.mutate(
        { id, ...form },
        {
          onSuccess: () => {
            toast.success("Plantilla actualizada");
            navigate("/admin/templates");
          },
          onError: (err) => toast.error(err.message || "Error"),
        },
      );
    } else {
      createTemplate.mutate(form, {
        onSuccess: () => {
          toast.success("Plantilla creada");
          navigate("/admin/templates");
        },
        onError: (err) => toast.error(err.message || "Error"),
      });
    }
  };

  if (isEditMode && isLoading) return <div>Cargando plantilla...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-dt-foreground mb-6">
        {isEditMode
          ? `Editando: ${templateData?.nombre}`
          : "Crear Nueva Plantilla"}
      </h1>

      <div className="bg-dt-primary border border-secondary rounded-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-dt-subtle mb-2">
              Nombre
            </label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full p-3 bg-dt-background border border-secondary rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dt-subtle mb-2">
              Asunto
            </label>
            <input
              name="plantillaAsunto"
              value={form.plantillaAsunto}
              onChange={handleChange}
              className="w-full p-3 bg-dt-background border border-secondary rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dt-subtle mb-2">
              Cuerpo
            </label>
            <textarea
              name="plantillaCuerpo"
              value={form.plantillaCuerpo}
              onChange={handleChange}
              rows={12}
              className="w-full p-3 bg-dt-background border border-secondary rounded-md font-mono text-sm"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => navigate("/admin/templates")}
              fullWidth={false}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={createTemplate.isLoading || updateTemplate.isLoading}
              fullWidth={false}
            >
              {createTemplate.isLoading || updateTemplate.isLoading
                ? "Guardando..."
                : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
