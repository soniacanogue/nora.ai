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
  if (confidence === null || confidence === undefined) return "text-gray-500";
  if (confidence >= 0.9) return "text-green-400";
  if (confidence >= 0.75) return "text-yellow-400";
  return "text-orange-500";
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

  const confidencePercent = suggestion.confidence ? Math.round(suggestion.confidence * 100) : 0;
  const confidenceColorClass = confidencePercent >= 90 ? "bg-dt-success shadow-glow-success" : confidencePercent >= 70 ? "bg-yellow-500" : "bg-dt-error shadow-glow-error";
  const confidenceTextClass = confidencePercent >= 90 ? "text-dt-success" : confidencePercent >= 70 ? "text-yellow-500" : "text-dt-error";

  return (
    <>
      <div className="bg-dt-accent/5 border border-dt-accent/20 rounded-lg p-6 shadow-glow relative overflow-hidden">
        {/* Decorative AI header line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-dt-accent to-transparent opacity-50"></div>
        
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-dt-foreground flex items-center gap-2">
            <span className="material-symbols-outlined text-dt-accent animate-pulse">smart_toy</span>
            Sugerencia de Nora AI
            </h2>
            <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-dt-subtle uppercase tracking-wider">Confianza</span>
                <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${confidenceColorClass}`} 
                            style={{ width: `${confidencePercent}%` }}
                        ></div>
                    </div>
                    <span className={`text-sm font-bold font-mono ${confidenceTextClass}`}>{confidencePercent}%</span>
                </div>
            </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="suggested-reply"
            className="text-xs font-bold text-dt-subtle uppercase tracking-wider mb-2 block"
          >
            Respuesta Generada
          </label>
          <textarea
            id="suggested-reply"
            value={editedReply}
            onChange={(e) => setEditedReply(e.target.value)}
            rows={8}
            className="w-full p-4 bg-black/20 border border-white/10 rounded-md text-dt-foreground text-sm font-mono leading-relaxed focus:outline-none focus:border-dt-accent focus:shadow-glow transition-all duration-200 resize-none"
          />
        </div>

        <div className="mb-6">
          <label className="text-xs font-bold text-dt-subtle uppercase tracking-wider mb-2 block">
            Etiquetas Detectadas
          </label>
          <div className="flex flex-wrap gap-2">
            {suggestion.suggested_tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-dt-accent/10 text-dt-accent border border-dt-accent/20 text-xs rounded-full font-mono"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
        {/* --- SECCIÓN DE ACCIONES --- */}
        <div className="grid grid-cols-1 gap-3 border-t border-white/10 pt-6 mt-4">
          <Button
            variant="primary"
            size="md"
            onClick={handleApproveAndSend}
            disabled={isLoading}
            className="w-full justify-center"
          >
            {isApproving ? "Procesando..." : "✅ Aprobar y Enviar"}
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsEscalateModalOpen(true)}
                disabled={isLoading}
                className="justify-center"
            >
                {isEscalating ? "..." : "➡️ Escalar (Nivel 2)"}
            </Button>
            <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsReassignModalOpen(true)}
                disabled={isLoading}
                className="justify-center"
            >
                {isReassigning ? "..." : "👤 Reasignar"}
            </Button>
          </div>
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
          className="w-full mt-1 p-3 bg-dt-background border border-secondary rounded-md text-dt-foreground text-sm"
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
