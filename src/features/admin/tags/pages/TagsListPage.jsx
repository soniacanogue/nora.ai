import React from "react";
import { FiTag, FiPlus } from "react-icons/fi";

// TODO: UC-17 - Tags Management UI
// Backend endpoints are implemented:
// GET /tags - List all tags
// POST /tags - Create new tag
// GET /tags/:id - Get tag by ID
// PATCH /tags/:id - Update tag
// DELETE /tags/:id - Delete tag
//
// Required implementation:
// 1. Fetch and display list of tags with colors
// 2. Create/Edit tag form with color picker
// 3. Delete tag with confirmation
// 4. Show usage count (number of tickets using each tag)
// 5. Prevent deletion of tags in use (or show warning)

export const TagsListPage = () => {
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
        <button className="flex items-center gap-2 px-4 py-2 bg-dt-accent text-white rounded-lg hover:bg-dt-accent-hover transition-colors">
          <FiPlus />
          Nueva Etiqueta
        </button>
      </div>

      {/* Placeholder Content */}
      <div className="bg-dt-card border border-dt-border rounded-lg p-12 text-center">
        <FiTag className="text-6xl text-dt-subtle mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-dt-foreground mb-2">
          Página de Gestión de Etiquetas
        </h3>
        <p className="text-dt-subtle mb-4">
          Esta página permitirá gestionar etiquetas maestras del sistema.
        </p>
        <div className="bg-dt-background border border-dt-border rounded-lg p-4 text-left max-w-2xl mx-auto">
          <p className="text-sm text-dt-foreground font-semibold mb-2">
            TODO: Implementar
          </p>
          <ul className="text-xs text-dt-subtle space-y-1 list-disc list-inside">
            <li>Listar todas las etiquetas con sus colores</li>
            <li>Crear nueva etiqueta con selector de color</li>
            <li>Editar etiquetas existentes</li>
            <li>Eliminar etiquetas (con validación de uso)</li>
            <li>Mostrar contador de uso por etiqueta</li>
            <li>Filtrar y buscar etiquetas</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
