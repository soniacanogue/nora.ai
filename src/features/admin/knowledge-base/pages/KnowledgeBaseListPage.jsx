import React, { useState } from "react";
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

  const {
    data: documents = [],
    isLoading,
    error,
  } = useKnowledgeBaseDocs({
    search: searchTerm,
    category: categoryFilter,
  });

  const deleteDocMutation = useDeleteKnowledgeBaseDoc();

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

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-dt-subtle">Cargando base de conocimiento...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">
            Error al cargar la base de conocimiento
          </p>
          <p className="text-dt-subtle text-sm">
            {error.message || "Backend endpoint no implementado aún"}
          </p>
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
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-dt-card border border-dt-border rounded-lg text-dt-foreground placeholder-dt-subtle focus:outline-none focus:border-dt-accent"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 bg-dt-card border border-dt-border rounded-lg text-dt-foreground focus:outline-none focus:border-dt-accent"
        >
          <option value="">Todas las categorías</option>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

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
        <div className="grid gap-4">
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
        </div>
      )}
    </div>
  );
};
