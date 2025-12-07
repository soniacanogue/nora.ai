import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiSave, FiX, FiBook } from "react-icons/fi";
import {
  useKnowledgeBaseDoc,
  useCreateKnowledgeBaseDoc,
  useUpdateKnowledgeBaseDoc,
} from "../hooks/useKnowledgeBase";

// TODO: UC-14 - Knowledge Base Form
// This component requires backend implementation of:
// POST /knowledge-base (create)
// PATCH /knowledge-base/:id (update)
// GET /knowledge-base/:id (get for editing)

const CATEGORIES = [
  { value: "FAQ", label: "FAQ - Preguntas Frecuentes" },
  { value: "POLITICA", label: "Política - Reglas y normativas" },
  { value: "PROCEDIMIENTO", label: "Procedimiento - Guías paso a paso" },
  { value: "GUIA", label: "Guía - Información general" },
  { value: "OTRO", label: "Otro" },
];

export const KnowledgeBaseFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    titulo: "",
    contenido: "",
    categoria: "FAQ",
    etiquetas: [],
  });
  const [tagInput, setTagInput] = useState("");

  const { data: document, isLoading: isLoadingDoc } = useKnowledgeBaseDoc(id);
  const createMutation = useCreateKnowledgeBaseDoc();
  const updateMutation = useUpdateKnowledgeBaseDoc();

  useEffect(() => {
    if (document) {
      setFormData({
        titulo: document.titulo || "",
        contenido: document.contenido || "",
        categoria: document.categoria || "FAQ",
        etiquetas: document.etiquetas || [],
      });
    }
  }, [document]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditing) {
      updateMutation.mutate(
        { id, data: formData },
        {
          onSuccess: () => navigate("/admin/knowledge-base"),
        },
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => navigate("/admin/knowledge-base"),
      });
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.etiquetas.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        etiquetas: [...formData.etiquetas, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      etiquetas: formData.etiquetas.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleCancel = () => {
    navigate("/admin/knowledge-base");
  };

  if (isEditing && isLoadingDoc) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-dt-subtle">Cargando documento...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <FiBook className="text-2xl text-dt-accent" />
        <div>
          <h1 className="text-2xl font-bold text-dt-foreground">
            {isEditing ? "Editar Documento" : "Nuevo Documento"}
          </h1>
          <p className="text-sm text-dt-subtle">
            {isEditing
              ? "Actualiza la información del documento"
              : "Agrega un nuevo documento a la base de conocimiento"}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-dt-foreground mb-2">
            Título <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.titulo}
            onChange={(e) =>
              setFormData({ ...formData, titulo: e.target.value })
            }
            required
            className="w-full px-4 py-2 bg-dt-card border border-dt-border rounded-lg text-dt-foreground placeholder-dt-subtle focus:outline-none focus:border-dt-accent"
            placeholder="Ej: ¿Cómo hacer una devolución?"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-dt-foreground mb-2">
            Categoría <span className="text-red-400">*</span>
          </label>
          <select
            value={formData.categoria}
            onChange={(e) =>
              setFormData({ ...formData, categoria: e.target.value })
            }
            required
            className="w-full px-4 py-2 bg-dt-card border border-dt-border rounded-lg text-dt-foreground focus:outline-none focus:border-dt-accent"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-dt-foreground mb-2">
            Contenido <span className="text-red-400">*</span>
          </label>
          <textarea
            value={formData.contenido}
            onChange={(e) =>
              setFormData({ ...formData, contenido: e.target.value })
            }
            required
            rows={12}
            className="w-full px-4 py-2 bg-dt-card border border-dt-border rounded-lg text-dt-foreground placeholder-dt-subtle focus:outline-none focus:border-dt-accent resize-none"
            placeholder="Escribe el contenido del documento aquí..."
          />
          <p className="text-xs text-dt-subtle mt-1">
            Este contenido será utilizado por la IA para generar respuestas a
            los clientes.
          </p>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-dt-foreground mb-2">
            Etiquetas
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              className="flex-1 px-4 py-2 bg-dt-card border border-dt-border rounded-lg text-dt-foreground placeholder-dt-subtle focus:outline-none focus:border-dt-accent"
              placeholder="Escribe una etiqueta y presiona Enter"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-dt-accent/10 text-dt-accent border border-dt-accent/20 rounded-lg hover:bg-dt-accent/20 transition-colors"
            >
              Agregar
            </button>
          </div>
          {formData.etiquetas.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.etiquetas.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-dt-background text-dt-foreground rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-dt-subtle hover:text-red-400"
                  >
                    <FiX size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-dt-border">
          <button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
            className="flex items-center gap-2 px-6 py-2 bg-dt-accent text-white rounded-lg hover:bg-dt-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSave />
            {isEditing ? "Guardar Cambios" : "Crear Documento"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 bg-dt-card border border-dt-border text-dt-foreground rounded-lg hover:bg-dt-background transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};
