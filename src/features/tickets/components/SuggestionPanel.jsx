// tickets/components/SuggestionPanel.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import Button from "src/shared/components/ui/Button";
import Modal from "src/shared/components/ui/Modal";
import toast from "react-hot-toast";

// --- CORRECCIONES AÑADIDAS ---
import { useApproveTicket } from "../hooks/useApproveTicket";
import { useEscalateTicket } from "../hooks/useEscalateTicket";
import { useReassignTicket } from "../hooks/useReassignTicket";
import { useRetrySuggestion } from "../hooks/useRetrySuggestion";
import ReassignTicketModal from "./ReassignTicketModal"; // Importar el nuevo modal
// --- FIN DE LAS CORRECCIONES ---

const getConfidenceColor = (confidence) => {
  if (confidence === null || confidence === undefined) return "text-gray-500";
  if (confidence >= 0.9) return "text-green-400";
  if (confidence >= 0.75) return "text-yellow-400";
  return "text-orange-500";
};

const SuggestionPanel = ({
  suggestion,
  ticketId,
  onApprovalSuccess,
  approvalContext,
}) => {
  const [editedReply, setEditedReply] = useState(suggestion.reply_text || "");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [collisionDetected, setCollisionDetected] = useState(false);
  const [collisionAcknowledged, setCollisionAcknowledged] = useState(false);
  const [isPreparingReply, setIsPreparingReply] = useState(false);

  const fileInputRef = useRef(null);
  const baselineFingerprintRef = useRef(
    approvalContext?.latestMessageFingerprint || null,
  );

  const {
    replyChannel = "correo",
    nextState = "esperando_cliente",
    latestMessageFingerprint,
    latestMessageTimestamp,
  } = approvalContext || {};

  // Usamos los hooks de mutación
  const { mutate: approve, isPending: isApproving } = useApproveTicket({
    onSuccess: (...args) => {
      setSelectedFiles([]);
      setCollisionDetected(false);
      setCollisionAcknowledged(false);
      baselineFingerprintRef.current =
        approvalContext?.latestMessageFingerprint || null;
      if (onApprovalSuccess) {
        onApprovalSuccess(...args);
      }
    },
  });
  const { mutate: escalate, isPending: isEscalating } = useEscalateTicket();
  const { mutate: reassign, isPending: isReassigning } = useReassignTicket();
  const { mutate: retrySuggestion, isPending: isRetrying } =
    useRetrySuggestion();

  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const [escalationNote, setEscalationNote] = useState("");
  const [isEscalateModalOpen, setIsEscalateModalOpen] = useState(false);

  useEffect(() => {
    setEditedReply(suggestion.reply_text || "");
  }, [suggestion.reply_text]);

  useEffect(() => {
    setSelectedFiles([]);
    setCollisionDetected(false);
    setCollisionAcknowledged(false);
    baselineFingerprintRef.current = latestMessageFingerprint || null;
  }, [ticketId, latestMessageFingerprint]);

  const manualEdit = useMemo(() => {
    const original = (suggestion.reply_text || "").trim();
    const current = (editedReply || "").trim();
    return original !== current;
  }, [suggestion.reply_text, editedReply]);

  const hasLocalChanges = manualEdit || selectedFiles.length > 0;

  useEffect(() => {
    if (!latestMessageFingerprint) return;

    if (!baselineFingerprintRef.current) {
      baselineFingerprintRef.current = latestMessageFingerprint;
      return;
    }

    if (!hasLocalChanges) {
      baselineFingerprintRef.current = latestMessageFingerprint;
      setCollisionDetected(false);
      setCollisionAcknowledged(false);
      return;
    }

    if (baselineFingerprintRef.current !== latestMessageFingerprint) {
      setCollisionDetected(true);
      setCollisionAcknowledged(false);
    }
  }, [latestMessageFingerprint, hasLocalChanges]);

  const parseFilesToPayload = async (files = []) => {
    if (!files.length) return [];

    const convertFile = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result || "";
          const [, rawBase64] = result.split(",");
          resolve({
            fileName: file.name,
            mimeType: file.type || "application/octet-stream",
            size: file.size,
            encoding: "base64",
            content: rawBase64 || result,
          });
        };
        reader.onerror = () =>
          reject(reader.error || new Error("No se pudo leer el archivo"));
        reader.readAsDataURL(file);
      });

    return Promise.all(files.map(convertFile));
  };

  const handleApproveAndSend = async () => {
    if (collisionDetected && !collisionAcknowledged) {
      toast.error("Confirma el último mensaje antes de enviar.");
      return;
    }
    try {
      setIsPreparingReply(true);
      const attachmentsPayload = await parseFilesToPayload(selectedFiles);
      approve({
        ticketId,
        editedBody: editedReply,
        attachments: attachmentsPayload,
        manualEdit,
        nextState,
        replyChannel,
        conversationFingerprint: latestMessageFingerprint,
        collisionAcknowledged: collisionDetected
          ? collisionAcknowledged
          : false,
      });
    } catch (fileError) {
      toast.error(fileError.message || "No se pudieron preparar los adjuntos.");
    } finally {
      setIsPreparingReply(false);
    }
  };

  const handleAttachmentPick = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setSelectedFiles((prev) => {
      const MAX_ATTACHMENTS = 10;
      const availableSlots = Math.max(0, MAX_ATTACHMENTS - prev.length);
      if (!availableSlots) {
        toast.error("Límite de 10 adjuntos alcanzado.");
        return prev;
      }
      return [...prev, ...files.slice(0, availableSlots)];
    });
    event.target.value = "";
  };

  const handleRemoveAttachment = (index) => {
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleRefreshDraft = () => {
    setEditedReply(suggestion.reply_text || "");
    setSelectedFiles([]);
    setCollisionDetected(false);
    setCollisionAcknowledged(false);
    baselineFingerprintRef.current = latestMessageFingerprint || null;
  };

  const disableApproveAction =
    isApproving ||
    isPreparingReply ||
    isEscalating ||
    isReassigning ||
    isRetrying ||
    (collisionDetected && !collisionAcknowledged);

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
      },
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
      },
    );
  };

  // Estado de carga unificado
  const isLoading =
    isApproving ||
    isEscalating ||
    isReassigning ||
    isRetrying ||
    isPreparingReply;

  const confidencePercent = suggestion.confidence
    ? Math.round(suggestion.confidence * 100)
    : 0;
  const confidenceColorClass =
    confidencePercent >= 90
      ? "bg-dt-success shadow-glow-success"
      : confidencePercent >= 70
        ? "bg-yellow-500"
        : "bg-dt-error shadow-glow-error";
  const confidenceTextClass =
    confidencePercent >= 90
      ? "text-dt-success"
      : confidencePercent >= 70
        ? "text-yellow-500"
        : "text-dt-error";

  return (
    <>
      <div className="bg-dt-accent/5 border border-dt-accent/20 rounded-lg p-6 shadow-glow relative overflow-hidden">
        {/* Decorative AI header line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-dt-accent to-transparent opacity-50"></div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-dt-foreground flex items-center gap-2">
            <span className="material-symbols-outlined text-dt-accent animate-pulse">
              smart_toy
            </span>
            Sugerencia de Nora AI
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-dt-subtle uppercase tracking-wider">
              Confianza
            </span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${confidenceColorClass}`}
                  style={{ width: `${confidencePercent}%` }}
                ></div>
              </div>
              <span
                className={`text-sm font-bold font-mono ${confidenceTextClass}`}
              >
                {confidencePercent}%
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="suggested-reply"
              className="text-xs font-bold text-dt-subtle uppercase tracking-wider block"
            >
              Respuesta Generada
            </label>
            {/* {!suggestion.reply_text && ( */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => retrySuggestion(ticketId)}
              disabled={isRetrying}
              fullWidth={false}
              className="h-6 px-2 text-[10px] border border-dt-accent/20 hover:bg-dt-accent/10"
            >
              {isRetrying ? "Generando..." : "Retry ↻"}
            </Button>
            {/* )} */}
          </div>
          <textarea
            id="suggested-reply"
            value={editedReply}
            onChange={(e) => setEditedReply(e.target.value)}
            rows={8}
            className="w-full p-4 bg-black/20 border border-white/10 rounded-md text-dt-foreground text-sm font-mono leading-relaxed focus:outline-none focus:border-dt-accent focus:shadow-glow transition-all duration-200 resize-none"
          />
          <div className="flex items-center gap-3 mt-2 text-[11px] uppercase tracking-widest font-semibold text-dt-subtle">
            <span>
              {manualEdit ? "Modo: Editado manual" : "Modo: Aprobación directa"}
            </span>
            <span className="px-2 py-0.5 rounded-full border border-white/10 bg-white/5">
              Canal: {replyChannel?.toUpperCase?.() || replyChannel}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <label className="text-xs font-bold text-dt-subtle uppercase tracking-wider mb-2 block">
            Adjuntar archivos a la respuesta
          </label>
          <div
            className="border border-dt-accent/30 border-dashed rounded-md p-4 bg-black/20 cursor-pointer hover:bg-black/10 transition"
            onClick={() => fileInputRef.current?.click()}
          >
            <p className="text-sm text-dt-subtle">
              Arrastra y suelta o haz clic para seleccionar archivos (máx. 10)
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleAttachmentPick}
          />
          {selectedFiles.length > 0 && (
            <ul className="mt-3 space-y-2 text-sm text-dt-foreground">
              {selectedFiles.map((file, index) => (
                <li
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between gap-3 border border-white/10 rounded-md px-3 py-2 bg-black/30"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold">{file.name}</span>
                    <span className="text-xs text-dt-subtle">
                      {(file.size / 1024).toFixed(1)} KB •{" "}
                      {file.type || "sin tipo"}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="text-xs uppercase tracking-wider text-dt-error hover:underline"
                    onClick={() => handleRemoveAttachment(index)}
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {collisionDetected && (
          <div className="mb-6 rounded-lg border border-amber-400/30 bg-amber-500/10 p-4 text-amber-100">
            <p className="text-xs font-bold uppercase tracking-wider">
              Nuevo mensaje del cliente
            </p>
            <p className="text-sm mt-2 text-amber-50">
              Detectamos actividad en la conversación mientras editabas la
              respuesta.
              {latestMessageTimestamp && (
                <>
                  {" "}
                  Último mensaje recibido el{" "}
                  {new Date(latestMessageTimestamp).toLocaleString()}
                </>
              )}
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefreshDraft}
                disabled={isLoading}
                className="justify-center"
              >
                Actualizar redacción
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCollisionAcknowledged(true)}
                disabled={isLoading}
                className="justify-center"
              >
                Continuar igualmente
              </Button>
            </div>
          </div>
        )}

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
            disabled={disableApproveAction}
            className="w-full justify-center"
          >
            {isApproving || isPreparingReply
              ? "Procesando..."
              : collisionDetected && !collisionAcknowledged
                ? "Confirma la colisión"
                : "✅ Aprobar y Enviar"}
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
