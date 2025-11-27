// tickets/components/SuggestionPanel.jsx
import React, { useState, useEffect } from "react";
import Button from "src/shared/components/ui/Button";
import Modal from "src/shared/components/ui/Modal";
import toast from "react-hot-toast";

// --- CORRECCIONES AÑADIDAS ---
import { useApproveTicket } from "../hooks/useApproveTicket";
import { useEscalateTicket } from "../hooks/useEscalateTicket";
import { useReassignTicket } from "../hooks/useReassignTicket";
import ReassignTicketModal from "./ReassignTicketModal"; // Importar el nuevo modal
// --- FIN DE LAS CORRECCIONES ---

const getConfidenceColor = (confidence) => {
  if (confidence === null || confidence === undefined)
    return "text-dt-gray-500";
  if (confidence >= 0.9) return "text-dt-green-400";
  if (confidence >= 0.75) return "text-dt-yellow-400";
  return "text-dt-orange-500";
};

const SuggestionPanel = ({ suggestion, ticketId, onApprovalSuccess }) => {
  const [editedReply, setEditedReply] = useState(suggestion.reply_text || "");

  // Usamos los hooks de mutación
  const { mutate: approve, isLoading: isApproving } = useApproveTicket({
    onSuccess: onApprovalSuccess, // El callback de éxito se pasa aquí
  });
  const { mutate: escalate, isLoading: isEscalating } = useEscalateTicket();
  const { mutate: reassign, isLoading: isReassigning } = useReassignTicket();

  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const [escalationNote, setEscalationNote] = useState("");
  const [isEscalateModalOpen, setIsEscalateModalOpen] = useState(false);

  useEffect(() => {
    setEditedReply(suggestion.reply_text || "");
  }, [suggestion.reply_text]);

  const handleApproveAndSend = () => {
    approve({ ticketId, editedBody: editedReply });
  };

  const handleEscalateConfirm = () => {
    escalate(
      { ticketId, note: escalationNote },
      {
        onSuccess: () => {
          setIsEscalateModalOpen(false);
          setEscalationNote("");
          // La navegación la manejaría el componente padre si el ticket desaparece de la cola
          onApprovalSuccess();
        },
      }
    );
  };

  const handleReassignConfirm = (newAssigneeId) => {
    reassign(
      { ticketId, newAssigneeId },
      {
        onSuccess: () => {
          setIsReassignModalOpen(false);
          onApprovalSuccess();
        },
      }
    );
  };

  // Estado de carga unificado
  const isLoading = isApproving || isEscalating || isReassigning;

  return (
    <>
      <div className="bg-dt-primary border border-secondary rounded-lg p-6">
        <h2 className="text-dt-xl font-bold text-dt-foreground mb-4">
          Sugerencia de Nora AI
        </h2>

        <div className="mb-4">
          <label className="text-dt-sm font-medium text-dt-subtle">
            Confianza
          </label>
          <p
            className={`text-dt-2xl font-bold ${getConfidenceColor(suggestion.confidence)}`}
          >
            {suggestion.confidence
              ? `${(suggestion.confidence * 100).toFixed(0)}%`
              : "N/A"}
          </p>
        </div>

        <div className="mb-4">
          <label
            htmlFor="suggested-reply"
            className="text-dt-sm font-medium text-dt-subtle"
          >
            Respuesta Sugerida
          </label>
          <textarea
            id="suggested-reply"
            value={editedReply}
            onChange={(e) => setEditedReply(e.target.value)}
            rows={8}
            className="w-full mt-1 p-3 bg-dt-background border border-secondary rounded-md text-dt-foreground text-dt-sm"
          />
        </div>

        <div className="mb-6">
          <label className="text-dt-sm font-medium text-dt-subtle">
            Etiquetas Sugeridas
          </label>
          <div className="flex flex-wrap gap-2 mt-1">
            {suggestion.suggested_tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-dt-gray-700 text-dt-gray-300 text-dt-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        {/* --- SECCIÓN DE ACCIONES --- */}
        <div className="space-y-3 border-t border-secondary pt-4 mt-4">
          <Button
            variant="primary"
            size="md"
            onClick={handleApproveAndSend}
            disabled={isLoading}
          >
            {isApproving ? "Aprobando..." : "✅ Aprobar y Enviar"}
          </Button>
          <Button
            variant="secondary"
            size="md"
            onClick={() => setIsEscalateModalOpen(true)}
            disabled={isLoading}
          >
            {isEscalating ? "Escalando..." : "➡️ Escalar a Nivel 2"}
          </Button>
          <Button
            variant="secondary"
            size="md"
            onClick={() => setIsReassignModalOpen(true)}
            disabled={isLoading}
          >
            {isReassigning ? "Reasignando..." : "👤 Reasignar"}
          </Button>
        </div>
      </div>

      {/* --- MODALES PARA LAS ACCIONES --- */}
      <ReassignTicketModal
        isOpen={isReassignModalOpen}
        onClose={() => setIsReassignModalOpen(false)}
        onConfirm={handleReassignConfirm}
        isReassigning={isReassigning}
      />

      {/* Modal para nota de escalación */}
      <Modal
        isOpen={isEscalateModalOpen}
        onClose={() => setIsEscalateModalOpen(false)}
        title="Escalar a Nivel 2"
      >
        <p className="text-dt-subtle mb-4">
          Añade una nota interna obligatoria para el especialista de Nivel 2.
        </p>
        <textarea
          value={escalationNote}
          onChange={(e) => setEscalationNote(e.target.value)}
          rows={4}
          className="w-full mt-1 p-3 bg-dt-background border border-secondary rounded-md text-dt-foreground text-dt-sm"
          placeholder="Ej: El cliente confirma que ha reiniciado el dispositivo. El problema parece ser de hardware."
        />
        <div className="flex justify-end gap-4 mt-4">
          <Button
            variant="secondary"
            size="md"
            fullWidth={false}
            onClick={() => setIsEscalateModalOpen(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="md"
            fullWidth={false}
            onClick={handleEscalateConfirm}
            disabled={!escalationNote.trim() || isLoading}
          >
            {isEscalating ? "Escalando..." : "Confirmar Escalación"}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default SuggestionPanel;
