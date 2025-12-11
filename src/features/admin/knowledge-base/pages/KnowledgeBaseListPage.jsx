import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiBook,
  FiEdit2,
  FiTrash2,
  FiFileText,
  FiFilter,
} from "react-icons/fi";
import {
  useKnowledgeBaseDocs,
  useDeleteKnowledgeBaseDoc,
  useUpdateKnowledgeBaseDoc,
  useCreateKnowledgeBaseDoc,
  useKnowledgeBaseCategories,
} from "../hooks/useKnowledgeBase";
import DynamicTable from "@/shared/components/ui/DynamicTable";
import Button from "@/shared/components/ui/Button";
import Badge from "@/shared/components/ui/Badge";
import PageHeader from "@/shared/components/layout/PageHeader";
import FilterPanel from "@/shared/components/ui/FilterPanel";
import EmptyState from "@/shared/components/ui/EmptyState";
import ErrorState from "@/shared/components/ui/ErrorState";
import DynamicFormModal from "@/shared/components/ui/DynamicFormModal";

// TODO: UC-14 - Knowledge Base Management UI
// This component requires backend implementation of:
// GET /knowledge-base endpoint

const CATEGORY_LABELS = {
  FAQ: "FAQ",
  POLITICA: "Política",
  PROCEDIMIENTO: "Procedimiento",
  GUIA: "Guía",
  OTRO: "Otro",
};

const CATEGORY_COLORS = {
  FAQ: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  POLITICA: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  PROCEDIMIENTO: "bg-green-500/10 text-green-400 border-green-500/20",
  GUIA: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  OTRO: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

export const KnowledgeBaseListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const pageParam = Number(searchParams.get("page") || 1);
  const limitParam = Number(searchParams.get("limit") || 25);
  const sortBy = searchParams.get("sortBy") || "creadoEn";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  const sortConfig = { key: sortBy, order: sortOrder };

  const filters = useMemo(
    () => ({
      search: searchTerm.trim() || undefined,
      category: categoryFilter || undefined,
      page: pageParam,
      limit: limitParam,
    }),
    [searchTerm, categoryFilter, pageParam, limitParam],
  );

  const {
    data: listData,
    isLoading,
    isFetching,
    error,
  } = useKnowledgeBaseDocs(filters);

  const { data: categoryOptions = [], isLoading: isLoadingCategories } =
    useKnowledgeBaseCategories();

  const documents = listData?.documents || [];
  const pagination = listData?.pagination || {};

  const deleteDocMutation = useDeleteKnowledgeBaseDoc();
  const updateDocMutation = useUpdateKnowledgeBaseDoc();
  const createDocMutation = useCreateKnowledgeBaseDoc();

  const handleSort = (key) => {
    const newOrder = sortBy === key && sortOrder === "asc" ? "desc" : "asc";
    const params = new URLSearchParams(searchParams);
    params.set("sortBy", key);
    params.set("sortOrder", newOrder);
    setSearchParams(params);
  };

  const normalizedCategories = useMemo(() => {
    if (Array.isArray(categoryOptions) && categoryOptions.length > 0) {
      return categoryOptions;
    }
    return Object.keys(CATEGORY_LABELS);
  }, [categoryOptions]);

  const filterConfig = useMemo(() => [
    {
      key: "categoryFilter",
      type: "select",
      label: "Categoría",
      options: [
        { value: "", label: "Todas las categorías" },
        ...normalizedCategories.map((category) => ({
          value: category,
          label: CATEGORY_LABELS[category] || category,
        })),
      ],
    },
  ], [normalizedCategories]);

  const handleFilterChange = (key, value) => {
    if (key === "categoryFilter") setCategoryFilter(value);
  };

  const filteredDocuments = useMemo(() => {
    let result = documents;

    // Filter by search
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter((doc) => {
        const titulo = (doc.titulo || "").toString().toLowerCase();
        const contenido = (doc.contenido || "").toString().toLowerCase();
        return titulo.includes(search) || contenido.includes(search);
      });
    }

    // Filter by category
    if (categoryFilter) {
      result = result.filter((doc) => doc.categoria === categoryFilter);
    }

    return result;
  }, [documents, searchTerm, categoryFilter]);

  const getCategoryBadgeVariant = (categoria) => {
    switch (categoria) {
      case "FAQ":
        return "info";
      case "POLITICA":
        return "accent";
      case "PROCEDIMIENTO":
        return "success";
      case "GUIA":
        return "warning";
      default:
        return "neutral";
    }
  };

  const columns = useMemo(() => [
    {
      key: "pregunta",
      label: "Pregunta/Título",
      sortable: true,
      className: "text-dt-foreground font-medium",
      render: (doc) => doc.pregunta || doc.titulo || "—",
    },
    {
      key: "categoria",
      label: "Categoría",
      sortable: true,
      render: (doc) => (
        <Badge variant={getCategoryBadgeVariant(doc.categoria)}>
          {CATEGORY_LABELS[doc.categoria] || doc.categoria || "—"}
        </Badge>
      ),
    },
    {
      key: "respuesta",
      label: "Respuesta/Contenido",
      className: "text-dt-subtle text-sm",
      render: (doc) => (
        <div className="truncate max-w-md" title={doc.respuesta || doc.contenido}>
          {doc.respuesta || doc.contenido || "—"}
        </div>
      ),
    },
    {
      key: "creadoEn",
      label: "Creado",
      sortable: true,
      className: "text-dt-subtle font-mono text-xs",
      render: (doc) => new Date(doc?.creadoEn || doc?.createdAt || 0).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Acciones",
      headerClassName: "text-right",
      className: "text-right",
      render: (doc) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => handleEdit(doc)}
            className="p-2 text-dt-subtle hover:text-dt-accent transition-colors"
            title="Editar"
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={() => handleDelete(doc.id)}
            className="p-2 text-dt-subtle hover:text-red-500 transition-colors"
            title="Eliminar"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      ),
    },
  ], [handleDelete, handleEdit, getCategoryBadgeVariant]);

  const handleDelete = async (id) => {
    if (
      window.confirm("¿Estás seguro de que deseas eliminar este documento?")
    ) {
      deleteDocMutation.mutate(id);
    }
  };

  const handleEdit = (document) => {
    setEditingDocument(document);
  };

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };



  // Form configuration for editing documents
  const formCategoryOptions = useMemo(() => {
    if (Array.isArray(categoryOptions) && categoryOptions.length > 0) {
      return categoryOptions.map((categoryValue) => {
        const fallback = CATEGORY_LABELS[categoryValue] || categoryValue;
        return {
          value: categoryValue,
          label: fallback,
        };
      });
    }
    return Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
      value,
      label,
    }));
  }, [categoryOptions]);

  const getDocumentFormConfig = (isEditing = false) => ({
    fields: {
      titulo: {
        label: "Título",
        type: "text",
        placeholder: "Ej: ¿Cómo hacer una devolución?",
        required: true,
      },
      categoria: {
        label: "Categoría",
        type: "select",
        options: formCategoryOptions,
        required: true,
        defaultValue: "FAQ",
      },
      contenido: {
        label: "Contenido",
        type: "textarea",
        placeholder: "Escribe el contenido del documento aquí...",
        rows: 12,
        required: true,
      },
      etiquetas: {
        label: "Etiquetas",
        type: "text",
        placeholder: "Etiquetas separadas por comas (ej: devoluciones, productos, ayuda)",
      },
    },
    buttons: {
      cancel: {
        label: "Cancelar",
        variant: "secondary",
        onClick: () => {
          if (isEditing) {
            setEditingDocument(null);
          } else {
            setIsCreateModalOpen(false);
          }
        },
      },
      submit: {
        label: (createDocMutation.isPending || updateDocMutation.isPending) 
          ? (isEditing ? "Guardando..." : "Creando...") 
          : (isEditing ? "Guardar Cambios" : "Crear Documento"),
        variant: "primary",
        disabled: createDocMutation.isPending || updateDocMutation.isPending,
        onClick: async (formData) => {
          try {
            // Convert tags string to array
            const processedData = {
              ...formData,
              etiquetas: formData.etiquetas
                ? formData.etiquetas.split(',').map(tag => tag.trim()).filter(tag => tag)
                : [],
            };

            if (isEditing && editingDocument) {
              updateDocMutation.mutate(
                { id: editingDocument.id, data: processedData },
                {
                  onSuccess: () => setEditingDocument(null),
                },
              );
            } else {
              createDocMutation.mutate(processedData, {
                onSuccess: () => setIsCreateModalOpen(false),
              });
            }
          } catch (error) {
            console.error("Submit error:", error);
          }
        },
      },
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-dt-subtle">Cargando base de conocimiento...</div>
      </div>
    );
  }

  if (error) {
    const errorMessage = error.message || "Backend endpoint no implementado aún";
    const backendUnavailable = errorMessage.toLowerCase().includes("backend");
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FiBook className="text-2xl text-dt-accent" />
            <div>
              <h1 className="text-2xl font-bold text-dt-foreground">
                Base de Conocimiento
              </h1>
              <p className="text-sm text-dt-subtle">
                Gestiona documentos, FAQs y políticas para la IA
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-2 px-4 py-2 bg-dt-card border border-dt-border rounded-lg text-dt-foreground hover:bg-dt-background transition-colors"
          >
            Volver al panel
          </button>
        </div>

        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-5 text-sm text-amber-100">
          <p className="font-semibold mb-1">Servicio no disponible</p>
          <p>
            {backendUnavailable
              ? "Aún no existe el endpoint /knowledge-base en el backend. Revisa Front-Endpoints-Guide.md para priorizar su implementación."
              : errorMessage}
          </p>
        </div>

        <div className="bg-dt-card border border-dt-border rounded-lg p-6 space-y-4 text-sm text-dt-subtle">
          <p>
            Mientras el backend no exponga la API, puedes avanzar documentando los requisitos en
            <span className="font-mono text-dt-foreground"> TODO_FRONTEND_IMPLEMENTATION.md </span>
            y preparando los esquemas de datos en el archivo Prisma.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Define categorías y metadatos obligatorios de cada documento.</li>
            <li>Sincroniza con el equipo de backend los parámetros esperados (paginación, filtros).</li>
            <li>Documenta ejemplos de payloads en <span className="font-mono">Front-Endpoints-Guide.md</span>.</li>
          </ul>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-dt-accent text-white rounded-lg hover:bg-dt-accent-hover transition-colors"
            >
              Reintentar carga
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/templates")}
              className="px-4 py-2 bg-dt-card border border-dt-border rounded-lg text-dt-foreground hover:bg-dt-background transition-colors"
            >
              Seguir con otra sección
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <PageHeader
        icon={FiBook}
        title="Gestión de Base de Conocimiento"
        description="Gestiona documentos, FAQs y políticas para la IA"
      >
        <div className="flex gap-2">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="secondary"
            icon={FiFilter}
          >
            Filtros
          </Button>
          <Button onClick={handleCreate} variant="primary" icon={FiPlus}>
            Nuevo Documento
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
            placeholder="Buscar documentos por título o contenido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Advanced Filters */}
        <FilterPanel
          open={showFilters}
          config={filterConfig}
          values={{ categoryFilter }}
          onChange={handleFilterChange}
        />
      </div>

      {/* Documents Table */}
      <DynamicTable
        columns={columns}
        data={filteredDocuments}
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
        totalPages={pagination?.totalPages}
        totalItems={pagination?.total}
        emptyState={
          <EmptyState
            icon={FiBook}
            title="No hay documentos"
            description={
              searchTerm || categoryFilter
                ? "No se encontraron documentos con los filtros aplicados"
                : "Crea tu primer documento para comenzar"
            }
            action={!searchTerm && !categoryFilter ? { label: "Nuevo Documento", onClick: handleCreate } : undefined}
          />
        }
      />

      {/* Create Modal */}
      {isCreateModalOpen && (
        <DynamicFormModal
          title="Crear Nuevo Documento"
          description="Agrega un nuevo documento a la base de conocimiento"
          config={getDocumentFormConfig(false)}
          onClose={() => setIsCreateModalOpen(false)}
          isLoading={createDocMutation.isPending}
        />
      )}

      {/* Edit Modal */}
      {editingDocument && (
        <DynamicFormModal
          title="Editar Documento"
          description="Modifica la información del documento"
          config={getDocumentFormConfig(true)}
          defaultValues={{
            titulo: editingDocument.titulo || "",
            categoria: editingDocument.categoria || "FAQ",
            contenido: editingDocument.contenido || "",
            etiquetas: editingDocument.etiquetas ? editingDocument.etiquetas.join(', ') : "",
          }}
          onClose={() => setEditingDocument(null)}
          isLoading={updateDocMutation.isPending}
        />
      )}
    </div>
  );
};
