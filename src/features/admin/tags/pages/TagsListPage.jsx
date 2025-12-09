import React, { useState, useMemo } from "react";
import {
  FiTag,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiFilter,
  FiTrendingUp,
  FiAlertTriangle,
  FiClock,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { useTags, useCreateTag, useUpdateTag, useDeleteTag } from "../hooks";
import DynamicFormModal from "@/shared/components/ui/DynamicFormModal";
import Button from "@/shared/components/ui/Button";
import EmptyState from "@/shared/components/ui/EmptyState";
import ErrorState from "@/shared/components/ui/ErrorState";
import Badge from "@/shared/components/ui/Badge";
import SearchInput from "@/shared/components/ui/SearchInput";
import Select from "@/shared/components/ui/Select";
import PageHeader from "@/shared/components/layout/PageHeader";
import FilterBar from "@/shared/components/ui/FilterBar";
import SkeletonList from "@/shared/components/ui/SkeletonList";
import { formatDistanceToNow } from "@/shared/utils/formatters";

/**
 * UC-17: Tags Management Page
 * Full CRUD implementation for managing master tags
 */
export const TagsListPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [usageFilter, setUsageFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("");

  const { data: tags = [], isLoading, error } = useTags();
  const createTagMutation = useCreateTag();
  const updateTagMutation = useUpdateTag();
  const deleteTagMutation = useDeleteTag();

  const availableCategories = useMemo(() => {
    const categories = new Set();
    tags.forEach((tag) => {
      if (tag.categoria) {
        categories.add(tag.categoria);
      }
    });
    return Array.from(categories);
  }, [tags]);

  const getUsageCount = (tag) =>
    tag.usageCount ?? tag.ticketsAsociados ?? tag.totalUso ?? 0;

  const getUsageVariant = (count) => {
    if (count >= 50) return "accent";
    if (count >= 10) return "success";
    if (count > 0) return "info";
    return "neutral";
  };

  const getLastUsageLabel = (tag) => {
    if (!tag.ultimaActividad) return "Sin actividad";
    try {
      return formatDistanceToNow(new Date(tag.ultimaActividad));
    } catch (error) {
      return "Sin registro";
    }
  };

  const filteredTags = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return tags.filter((tag) => {
      const matchesSearch =
        !searchTerm ||
        tag.nombre.toLowerCase().includes(search) ||
        (tag.descripcion && tag.descripcion.toLowerCase().includes(search));

      const matchesCategory =
        !categoryFilter || tag.categoria === categoryFilter;

      const usageCount = getUsageCount(tag);
      const matchesUsage = (() => {
        switch (usageFilter) {
          case "high":
            return usageCount >= 50;
          case "medium":
            return usageCount >= 10 && usageCount < 50;
          case "low":
            return usageCount > 0 && usageCount < 10;
          case "unused":
            return usageCount === 0;
          default:
            return true;
        }
      })();

      return matchesSearch && matchesCategory && matchesUsage;
    });
  }, [tags, searchTerm, usageFilter, categoryFilter]);

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
    const usageCount = getUsageCount(tag);
    if (usageCount > 0) {
      toast.error(
        `No puedes eliminar etiquetas en uso. ${tag.nombre} está presente en ${usageCount} ${
          usageCount === 1 ? "ticket" : "tickets"
        }`
      );
      return;
    }

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
      <PageHeader
        icon={FiTag}
        title="Gestión de Etiquetas"
        description="Administra etiquetas maestras para categorizar tickets"
        action={{ label: "Nueva Etiqueta", onClick: () => setIsCreateModalOpen(true), icon: FiPlus }}
      />

      {/* Search Bar */}
      <SearchInput
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar etiquetas..."
      />

      {/* Advanced Filters */}
      <FilterBar>
        <Select
          value={usageFilter}
          onChange={(event) => setUsageFilter(event.target.value)}
          placeholder="Todos los niveles de uso"
          options={[
            { value: "all", label: "Todos los niveles de uso" },
            { value: "high", label: "Alto uso (50+)" },
            { value: "medium", label: "Medio (10-49)" },
            { value: "low", label: "Bajo (<10)" },
            { value: "unused", label: "Sin uso" },
          ]}
        />

        {availableCategories.length > 0 && (
          <Select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            placeholder="Todas las categorías"
            options={[{ value: "", label: "Todas las categorías" }, ...availableCategories.map((category) => ({ value: category, label: category }))]}
          />
        )}
      </FilterBar>

      {/* Tags Grid */}
      {isLoading ? (
        <SkeletonList count={6} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" />
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
          {filteredTags.map((tag) => {
            const usageCount = getUsageCount(tag);
            const usageVariant = getUsageVariant(usageCount);
            const lastUsage = getLastUsageLabel(tag);

            return (
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
                    <div>
                      <h3 className="font-semibold text-dt-foreground">
                        {tag.nombre}
                      </h3>
                      {tag.categoria && (
                        <Badge variant="neutral" className="mt-1">
                          {tag.categoria}
                        </Badge>
                      )}
                    </div>
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
                  <p className="text-sm text-dt-subtle mb-3">{tag.descripcion}</p>
                )}

                <div className="space-y-2 text-xs text-dt-subtle">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <FiTrendingUp /> Uso
                    </span>
                    <Badge variant={usageVariant}>
                      {usageCount} {usageCount === 1 ? "ticket" : "tickets"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <FiClock /> Último uso
                    </span>
                    <span className="text-dt-foreground">{lastUsage}</span>
                  </div>
                  {usageCount === 0 && (
                    <div className="flex items-center gap-1 text-amber-400">
                      <FiAlertTriangle />
                      <span>Esta etiqueta aún no se usa</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
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
