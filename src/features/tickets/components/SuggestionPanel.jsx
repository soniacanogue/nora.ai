// tickets/components/SuggestionPanel.jsx
import React, { useState, useEffect } from "react";
import Button from "src/shared/components/ui/Button";
import toast from "react-hot-toast";

// --- CORRECCIONES AÑADIDAS ---
import { useApproveTicket } from "../hooks/useApproveTicket";
import { escalateTicket, reassignTicket } from "../api/ticketsApi"; // Importar nuevas acciones
import ReassignTicketModal from "./ReassignTicketModal"; // Importar el nuevo modal
// --- FIN DE LAS CORRECCIONES ---

const getConfidenceColor = (confidence) => {
  if (confidence === null || confidence === undefined) return "text-gray-500";
  if (confidence >= 0.9) return "text-green-400";
  if (confidence >= 0.75) return "text-yellow-400";
  return "text-orange-500";
};

const SuggestionPanel = ({ suggestion, ticketId }) => {
  const [editedReply, setEditedReply] = useState(suggestion.reply_text || "");
  const { approve, isApproving } = useApproveTicket();

  // --- CORRECCIONES AÑADIDAS ---
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false); // Estado de carga para otras acciones
  // --- FIN DE LAS CORRECCIONES ---

  useEffect(() => {
    setEditedReply(suggestion.reply_text || "");
  }, [suggestion.reply_text]);

  const handleApproveAndSend = async () => {
    if (!ticketId) return toast.error("No hay ID de ticket.");
    try {
      await approve(ticketId, editedReply);
      // Aquí podrías redirigir o mostrar un estado de éxito permanente
    } catch (err) {
      // El error ya es manejado por el hook `useApproveTicket`
    }
  };

  // --- LÓGICA DE LAS NUEVAS ACCIONES ---
  const handleEscalate = async () => {
    if (!ticketId) return toast.error("No hay ID de ticket.");
    setIsActionLoading(true);
    try {
      await escalateTicket(ticketId);
      toast.success("Ticket escalado a Nivel 2.");
      // Opcional: Redirigir o refrescar para que el ticket desaparezca de la cola actual
    } catch (err) {
      toast.error(err.message || "No se pudo escalar el ticket.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReassign = async (newAssigneeId) => {
    if (!ticketId) return toast.error("No hay ID de ticket.");
    setIsActionLoading(true);
    try {
      await reassignTicket(ticketId, newAssigneeId);
      toast.success("Ticket reasignado correctamente.");
      setIsReassignModalOpen(false);
    } catch (err) {
      toast.error(err.message || "No se pudo reasignar el ticket.");
    } finally {
      setIsActionLoading(false);
    }
  };
  // --- FIN DE LA LÓGICA ---

  const isLoading = isApproving || isActionLoading;

  return (
    <>
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
            disabled={isLoading}
          >
            {isApproving ? "Aprobando..." : "✅ Aprobar y Enviar"}
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => toast.info("Funcionalidad no implementada")}
            disabled={isLoading}
          >
            ✏️ Editar y Enviar
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleEscalate}
            disabled={isLoading}
          >
            {isLoading && !isApproving
              ? "Escalando..."
              : "➡️ Escalar a Nivel 2"}
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => setIsReassignModalOpen(true)}
            disabled={isLoading}
          >
            👤 Reasignar
          </Button>
        </div>
      </div>

      {/* --- INCLUSIÓN DEL MODAL --- */}
      <ReassignTicketModal
        isOpen={isReassignModalOpen}
        onClose={() => setIsReassignModalOpen(false)}
        onConfirm={handleReassign}
        isReassigning={isActionLoading}
      />
    </>
  );
};

export default SuggestionPanel;
