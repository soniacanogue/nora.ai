import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiBook,
  FiEdit2,
  FiTrash2,
  FiFileText,
} from "react-icons/fi";
import {
  useKnowledgeBaseDocs,
  useDeleteKnowledgeBaseDoc,
  useKnowledgeBaseCategories,
} from "../hooks/useKnowledgeBase";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  const filters = useMemo(
    () => ({
      search: searchTerm.trim() || undefined,
      category: categoryFilter || undefined,
      page,
      limit: PAGE_SIZE,
    }),
    [searchTerm, categoryFilter, page],
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
  const pagination = listData?.pagination || {
    pagina: page,
    limite: PAGE_SIZE,
    total: documents.length,
  };

  const currentPage = pagination.pagina || page;
  const totalDocuments = pagination.total ?? documents.length;
  const totalPages = Math.max(
    1,
    Math.ceil((pagination.total || documents.length || 1) / (pagination.limite || PAGE_SIZE)),
  );
  const showingStart = totalDocuments === 0 ? 0 : (currentPage - 1) * (pagination.limite || PAGE_SIZE) + 1;
  const showingEnd = totalDocuments === 0 ? 0 : showingStart + documents.length - 1;

  const deleteDocMutation = useDeleteKnowledgeBaseDoc();

  const normalizedCategories = useMemo(() => {
    if (Array.isArray(categoryOptions) && categoryOptions.length > 0) {
      return categoryOptions;
    }
    return Object.keys(CATEGORY_LABELS);
  }, [categoryOptions]);

  const handleDelete = async (id) => {
    if (
      window.confirm("¿Estás seguro de que deseas eliminar este documento?")
    ) {
      deleteDocMutation.mutate(id);
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/knowledge-base/edit/${id}`);
  };

  const handleCreate = () => {
    navigate("/admin/knowledge-base/new");
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    if (page !== 1) {
      setPage(1);
    }
  };

  const handleCategoryChange = (event) => {
    setCategoryFilter(event.target.value);
    if (page !== 1) {
      setPage(1);
    }
  };

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-dt-accent text-white rounded-lg hover:bg-dt-accent-hover transition-colors"
        >
          <FiPlus />
          Nuevo Documento
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dt-subtle" />
          <input
            type="text"
            placeholder="Buscar documentos..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 bg-dt-card border border-dt-border rounded-lg text-dt-foreground placeholder-dt-subtle focus:outline-none focus:border-dt-accent"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={handleCategoryChange}
          className="px-4 py-2 bg-dt-card border border-dt-border rounded-lg text-dt-foreground focus:outline-none focus:border-dt-accent disabled:opacity-60"
          disabled={isLoadingCategories}
        >
          <option value="">Todas las categorías</option>
          {normalizedCategories.map((category) => (
            <option key={category} value={category}>
              {CATEGORY_LABELS[category] || category}
            </option>
          ))}
        </select>
      </div>

      {isFetching && !isLoading && (
        <div className="text-xs text-dt-subtle font-mono">Actualizando resultados...</div>
      )}

      {/* Documents List */}
      {documents.length === 0 ? (
        <div className="text-center py-12 bg-dt-card rounded-lg border border-dt-border">
          <FiFileText className="text-5xl text-dt-subtle mx-auto mb-4" />
          <p className="text-dt-subtle mb-2">
            No hay documentos en la base de conocimiento
          </p>
          <button
            onClick={handleCreate}
            className="text-dt-accent hover:underline text-sm"
          >
            Crear el primer documento
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-dt-card border border-dt-border rounded-lg p-6 hover:border-dt-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-dt-foreground">
                      {doc.titulo}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs rounded border ${
                        CATEGORY_COLORS[doc.categoria] || CATEGORY_COLORS.OTRO
                      }`}
                    >
                      {CATEGORY_LABELS[doc.categoria] || doc.categoria}
                    </span>
                  </div>
                  <p className="text-dt-subtle text-sm mb-3 line-clamp-2">
                    {doc.contenido}
                  </p>
                  {doc.etiquetas && doc.etiquetas.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {doc.etiquetas.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs bg-dt-background text-dt-subtle rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(doc.id)}
                    className="p-2 text-dt-subtle hover:text-dt-accent hover:bg-dt-accent/10 rounded transition-colors"
                    title="Editar"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-2 text-dt-subtle hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                    title="Eliminar"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-dt-border flex items-center gap-4 text-xs text-dt-subtle">
                <span>
                  Creado: {new Date(doc.creadoEn).toLocaleDateString()}
                </span>
                {doc.actualizadoEn && (
                  <span>
                    Actualizado:{" "}
                    {new Date(doc.actualizadoEn).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-dt-border pt-4 mt-6">
            <p className="text-sm text-dt-subtle">
              {totalDocuments === 0
                ? "Sin resultados"
                : `Mostrando ${showingStart} - ${showingEnd} de ${totalDocuments} documentos`}
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
                className="px-3 py-1 border border-dt-border rounded-lg text-sm text-dt-foreground disabled:opacity-40"
              >
                Anterior
              </button>
              <span className="text-sm text-dt-subtle font-mono">
                Página {currentPage} de {totalPages}
              </span>
              <button
                type="button"
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage >= totalPages}
                className="px-3 py-1 border border-dt-border rounded-lg text-sm text-dt-foreground disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
