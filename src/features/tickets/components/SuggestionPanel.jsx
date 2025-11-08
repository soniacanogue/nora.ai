// src/features/tickets/components/SuggestionPanel.jsx
import React, { useState, useEffect } from "react";
import Button from "src/shared/components/ui/Button";

const getConfidenceColor = (confidence) => {
  if (confidence === null || confidence === undefined) return "text-gray-500";
  if (confidence >= 0.9) return "text-green-400";
  if (confidence >= 0.75) return "text-yellow-400";
  return "text-orange-500";
};

const SuggestionPanel = ({ suggestion }) => {
  // Estado local para que el texto de la sugerencia sea editable
  const [editedReply, setEditedReply] = useState(suggestion.reply_text || "");

  // Sincronizar el estado si la sugerencia cambia (ej. al navegar entre tickets)
  useEffect(() => {
    setEditedReply(suggestion.reply_text || "");
  }, [suggestion.reply_text]);

  const handleAction = (action) => {
    console.log(`Acción ejecutada: ${action}`);
    if (action === "Approve & Send") {
      console.log("Contenido a enviar:", editedReply);
    }
  };

  return (
    <div className="bg-primary border border-secondary rounded-lg p-6 sticky top-24">
      <h2 className="text-xl font-bold text-foreground mb-4">
        Sugerencia de Nora AI
      </h2>

      <div className="mb-4">
        <label className="text-sm font-medium text-subtle">Confianza</label>
        <p
          className={`text-2xl font-bold ${getConfidenceColor(
            suggestion.confidence
          )}`}
        >
          {suggestion.confidence
            ? `${(suggestion.confidence * 100).toFixed(0)}%`
            : "N/A"}
        </p>
      </div>

      <div className="mb-4">
        <label
          htmlFor="suggested-reply"
          className="text-sm font-medium text-subtle"
        >
          Respuesta Sugerida
        </label>
        <textarea
          id="suggested-reply"
          value={editedReply}
          onChange={(e) => setEditedReply(e.target.value)}
          rows={8}
          className="w-full mt-1 p-3 bg-background border border-secondary rounded-md text-foreground text-sm"
        />
      </div>

      <div className="mb-6">
        <label className="text-sm font-medium text-subtle">
          Etiquetas Sugeridas
        </label>
        <div className="flex flex-wrap gap-2 mt-1">
          {suggestion.suggested_tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Button
          variant="primary"
          className="w-full"
          onClick={() => handleAction("Approve & Send")}
        >
          Aprobar y Enviar
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => handleAction("Escalate to Level 2")}
        >
          Escalar a Nivel 2
        </Button>
      </div>
    </div>
  );
};

export default SuggestionPanel;
