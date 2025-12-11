import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
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
import DynamicTable from "@/shared/components/ui/DynamicTable";
import Button from "@/shared/components/ui/Button";
import EmptyState from "@/shared/components/ui/EmptyState";
import ErrorState from "@/shared/components/ui/ErrorState";
import Badge from "@/shared/components/ui/Badge";
import PageHeader from "@/shared/components/layout/PageHeader";
import FilterPanel from "@/shared/components/ui/FilterPanel";
import { formatDistanceToNow } from "@/shared/utils/formatters";

/**
 * UC-17: Tags Management Page
 * Full CRUD implementation for managing master tags
 */
export const TagsListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [usageFilter, setUsageFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("");

  const pageParam = Number(searchParams.get("page") || 1);
  const limitParam = Number(searchParams.get("limit") || 25);
  const sortBy = searchParams.get("sortBy") || "nombre";
  const sortOrder = searchParams.get("sortOrder") || "asc";

  const sortConfig = { key: sortBy, order: sortOrder };

  const { data: tags = [], isLoading, error } = useTags();
  const createTagMutation = useCreateTag();
  const updateTagMutation = useUpdateTag();
  const deleteTagMutation = useDeleteTag();

  const handleSort = (key) => {
    const newOrder = sortBy === key && sortOrder === "asc" ? "desc" : "asc";
    const params = new URLSearchParams(searchParams);
    params.set("sortBy", key);
    params.set("sortOrder", newOrder);
    setSearchParams(params);
  };

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

  const filterConfig = useMemo(() => [
    {
      key: "usageFilter",
      type: "select",
      label: "Nivel de uso",
      options: [
        { value: "all", label: "Todos los niveles" },
        { value: "high", label: "Alto uso (50+)" },
        { value: "medium", label: "Medio (10-49)" },
        { value: "low", label: "Bajo (<10)" },
        { value: "unused", label: "Sin uso" },
      ],
    },
    {
      key: "categoryFilter",
      type: "select",
      label: "Categoría",
      options: [
        { value: "", label: "Todas las categorías" },
        ...availableCategories.map((category) => ({ value: category, label: category })),
      ],
    },
  ], [availableCategories]);

  const handleFilterChange = (key, value) => {
    if (key === "usageFilter") setUsageFilter(value);
    else if (key === "categoryFilter") setCategoryFilter(value);
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

  const columns = useMemo(() => [
    {
      key: "nombre",
      label: "Nombre",
      sortable: true,
      render: (tag) => (
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: tag.color }}
          ></div>
          <span className="font-medium text-dt-foreground">{tag.nombre || "—"}</span>
        </div>
      ),
    },
    {
      key: "descripcion",
      label: "Descripción",
      sortable: true,
      className: "text-dt-subtle text-sm",
      render: (tag) => (
        <div className="truncate max-w-md" title={tag.descripcion}>
          {tag.descripcion || "—"}
        </div>
      ),
    },
    {
      key: "categoria",
      label: "Categoría",
      render: (tag) => tag.categoria ? (
        <Badge variant="neutral">{tag.categoria}</Badge>
      ) : "—",
    },
    {
      key: "uso",
      label: "Uso",
      render: (tag) => {
        const usageCount = getUsageCount(tag);
        const usageVariant = getUsageVariant(usageCount);
        return (
          <Badge variant={usageVariant} icon={FiTrendingUp}>
            {usageCount} {usageCount === 1 ? "ticket" : "tickets"}
          </Badge>
        );
      },
    },
    {
      key: "ultimaActividad",
      label: "Último uso",
      className: "text-dt-subtle text-xs",
      render: (tag) => {
        const lastUsage = getLastUsageLabel(tag);
        return (
          <div className="flex items-center gap-1">
            <FiClock size={12} />
            {lastUsage}
          </div>
        );
      },
    },
    {
      key: "actions",
      label: "Acciones",
      headerClassName: "text-right",
      className: "text-right",
      render: (tag) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setEditingTag(tag)}
            className="p-2 text-dt-subtle hover:text-dt-accent transition-colors"
            title="Editar"
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={() => handleDelete(tag)}
            className="p-2 text-dt-subtle hover:text-red-500 transition-colors"
            title="Eliminar"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      ),
    },
  ], [getUsageCount, getUsageVariant, getLastUsageLabel, handleDelete]);

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
      >
        <div className="flex gap-2">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="secondary"
            icon={FiFilter}
          >
            Filtros
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)} variant="primary" icon={FiPlus}>
            Nueva Etiqueta
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
            placeholder="Buscar etiquetas por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Advanced Filters */}
        <FilterPanel
          open={showFilters}
          config={filterConfig}
          values={{ usageFilter, categoryFilter }}
          onChange={handleFilterChange}
        />
      </div>

      {/* Tags Table */}
      <DynamicTable
        columns={columns}
        data={filteredTags}
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
            icon={FiTag}
            title="No hay etiquetas"
            description={
              searchTerm || usageFilter !== "all" || categoryFilter
                ? "No se encontraron etiquetas con los filtros aplicados"
                : "Crea tu primera etiqueta para comenzar"
            }
            action={!searchTerm && usageFilter === "all" && !categoryFilter ? { label: "Nueva Etiqueta", onClick: () => setIsCreateModalOpen(true) } : undefined}
          />
        }
      />

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
