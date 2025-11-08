// src/features/tickets/components/SuggestionPanel.jsx
import React, { useState, useEffect } from "react";
import Button from "src/shared/components/ui/Button";
import { useApproveTicket } from "../hooks/useApproveTicket";

const getConfidenceColor = (confidence) => {
  if (confidence === null || confidence === undefined) return "text-gray-500";
  if (confidence >= 0.9) return "text-green-400";
  if (confidence >= 0.75) return "text-yellow-400";
  return "text-orange-500";
};

const SuggestionPanel = ({ suggestion, ticketId }) => {
  // Estado local para que el texto de la sugerencia sea editable
  const [editedReply, setEditedReply] = useState(suggestion.reply_text || "");
  const { approve, isApproving } = useApproveTicket();

  // Sincronizar el estado si la sugerencia cambia (ej. al navegar entre tickets)
  useEffect(() => {
    setEditedReply(suggestion.reply_text || "");
  }, [suggestion.reply_text]);

  const handleApproveAndSend = async () => {
    if (!ticketId) {
      console.error("No ticket ID provided");
      return;
    }
    try {
      await approve(ticketId, editedReply);
      // Optionally redirect or refresh the page after approval
    } catch (err) {
      // Error is already handled by the hook with toast
      console.error("Error approving ticket:", err);
    }
  };

  const handleEditAndSend = () => {
    console.log("Editar y enviar:", editedReply);
    // This would open a more detailed editor or modal
  };

  const handleEscalate = () => {
    console.log("Escalando ticket a Nivel 2");
    // This would call an API to escalate the ticket
  };

  const handleReassign = () => {
    console.log("Reasignando ticket");
    // This would open a modal to select a new assignee
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
          onClick={handleApproveAndSend}
          disabled={isApproving}
        >
          {isApproving ? "Aprobando..." : "Aprobar y Enviar"}
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          onClick={handleEditAndSend}
          disabled={isApproving}
        >
          Editar y Enviar
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          onClick={handleEscalate}
          disabled={isApproving}
        >
          Escalar a Nivel 2
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          onClick={handleReassign}
          disabled={isApproving}
        >
          Reasignar
        </Button>
      </div>
    </div>
  );
};

export default SuggestionPanel;
