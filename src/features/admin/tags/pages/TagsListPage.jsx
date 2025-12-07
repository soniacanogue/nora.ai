import React, { useState, useMemo } from "react";
import { FiTag, FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import toast from "react-hot-toast";
import { useTags, useCreateTag, useUpdateTag, useDeleteTag } from "../hooks";
import DynamicFormModal from "@/shared/components/ui/DynamicFormModal";
import Button from "@/shared/components/ui/Button";
import EmptyState from "@/shared/components/ui/EmptyState";
import ErrorState from "@/shared/components/ui/ErrorState";

/**
 * UC-17: Tags Management Page
 * Full CRUD implementation for managing master tags
 */
export const TagsListPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: tags = [], isLoading, error } = useTags();
  const createTagMutation = useCreateTag();
  const updateTagMutation = useUpdateTag();
  const deleteTagMutation = useDeleteTag();

  // Filter tags by search term
  const filteredTags = useMemo(() => {
    if (!searchTerm) return tags;
    const search = searchTerm.toLowerCase();
    return tags.filter(
      (tag) =>
        tag.nombre.toLowerCase().includes(search) ||
        (tag.descripcion && tag.descripcion.toLowerCase().includes(search))
    );
  }, [tags, searchTerm]);

  const handleCreate = (formData) => {
    createTagMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Etiqueta creada exitosamente");
        setIsCreateModalOpen(false);
      },
      onError: (err) => {
        toast.error(err.message || "Error al crear etiqueta");
      },
    });
  };

  const handleUpdate = (formData) => {
    updateTagMutation.mutate(
      { id: editingTag.id, data: formData },
      {
        onSuccess: () => {
          toast.success("Etiqueta actualizada exitosamente");
          setEditingTag(null);
        },
        onError: (err) => {
          toast.error(err.message || "Error al actualizar etiqueta");
        },
      }
    );
  };

  const handleDelete = (tag) => {
    if (
      window.confirm(
        `¿Estás seguro de que quieres eliminar la etiqueta "${tag.nombre}"?`
      )
    ) {
      deleteTagMutation.mutate(tag.id, {
        onSuccess: () => {
          toast.success("Etiqueta eliminada");
        },
        onError: (err) => {
          toast.error(err.message || "Error al eliminar etiqueta");
        },
      });
    }
  };

  const tagFormConfig = {
    fields: {
      nombre: {
        label: "Nombre de la Etiqueta",
        placeholder: "Ej: Urgente, Devolución, Consulta",
        required: true,
      },
      color: {
        label: "Color",
        type: "color",
        placeholder: "#FF5733",
        required: true,
      },
      descripcion: {
        label: "Descripción (opcional)",
        type: "textarea",
        rows: 3,
        placeholder: "Describe cuándo usar esta etiqueta...",
      },
    },
    buttons: {
      cancel: {
        label: "Cancelar",
        variant: "secondary",
        onClick: () => {
          setIsCreateModalOpen(false);
          setEditingTag(null);
        },
      },
      submit: {
        label: editingTag ? "Actualizar Etiqueta" : "Crear Etiqueta",
        variant: "primary",
        onClick: editingTag ? handleUpdate : handleCreate,
      },
    },
  };

  if (error) {
    return (
      <div className="p-6">
        <ErrorState
          message="Error al cargar las etiquetas"
          details={error.message}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FiTag className="text-2xl text-dt-accent" />
          <div>
            <h1 className="text-2xl font-bold text-dt-foreground">
              Gestión de Etiquetas
            </h1>
            <p className="text-sm text-dt-subtle">
              Administra etiquetas maestras para categorizar tickets
            </p>
          </div>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          variant="primary"
          icon={FiPlus}
        >
          Nueva Etiqueta
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dt-subtle" />
        <input
          type="text"
          placeholder="Buscar etiquetas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-dt-card border border-dt-border rounded-lg text-dt-foreground placeholder-dt-subtle focus:outline-none focus:ring-2 focus:ring-dt-accent"
        />
      </div>

      {/* Tags Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-dt-card border border-dt-border rounded-lg p-4 animate-pulse"
            >
              <div className="h-4 bg-dt-border rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-dt-border rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : filteredTags.length === 0 ? (
        <EmptyState
          icon={FiTag}
          title="No hay etiquetas"
          description={
            searchTerm
              ? "No se encontraron etiquetas con ese criterio de búsqueda"
              : "Crea tu primera etiqueta para comenzar"
          }
          action={
            !searchTerm && {
              label: "Crear Etiqueta",
              onClick: () => setIsCreateModalOpen(true),
            }
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTags.map((tag) => (
            <div
              key={tag.id}
              className="bg-dt-card border border-dt-border rounded-lg p-4 hover:border-dt-accent/50 transition-colors group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  ></div>
                  <h3 className="font-semibold text-dt-foreground">
                    {tag.nombre}
                  </h3>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingTag(tag)}
                    className="p-1 text-dt-subtle hover:text-dt-accent transition-colors"
                    title="Editar"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(tag)}
                    className="p-1 text-dt-subtle hover:text-red-500 transition-colors"
                    title="Eliminar"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
              {tag.descripcion && (
                <p className="text-sm text-dt-subtle">{tag.descripcion}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <DynamicFormModal
          title="Crear Nueva Etiqueta"
          description="Completa los campos para crear una nueva etiqueta"
          config={tagFormConfig}
          onClose={() => setIsCreateModalOpen(false)}
          isLoading={createTagMutation.isPending}
        />
      )}

      {/* Edit Modal */}
      {editingTag && (
        <DynamicFormModal
          title="Editar Etiqueta"
          description="Modifica los campos de la etiqueta"
          config={tagFormConfig}
          defaultValues={editingTag}
          onClose={() => setEditingTag(null)}
          isLoading={updateTagMutation.isPending}
        />
      )}
    </div>
  );
};
