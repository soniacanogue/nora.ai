import React, { useState } from "react";
import Modal from "src/shared/components/ui/Modal";
import Button from "src/shared/components/ui/Button";
import toast from "react-hot-toast";
import { updateTicket, findMergeCandidates, mergeTicket } from "../../api/ticketsApi";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateMessage } from "../../hooks/useCreateMessage";

export const TicketModals = ({ ticket, state, onClose }) => {
  const queryClient = useQueryClient();
  const { mutate: createMessage } = useCreateMessage();
  const [noteText, setNoteText] = useState("");
  const [mergeCandidates, setMergeCandidates] = useState([]);
  const [isLoadingCandidates, setIsLoadingCandidates] = useState(false);
  const [selectedMergeTarget, setSelectedMergeTarget] = useState(null);
  const [isMerging, setIsMerging] = useState(false);

  // Modal de Nota Interna
  const handleSaveNote = () => {
    if (!noteText.trim()) {
      toast.error("La nota no puede estar vacía");
      return;
    }
    createMessage({ ticketId: ticket.id, contenidoTexto: noteText, esNotaInterna: true });
    setNoteText("");
    onClose("note");
  };

  // Modal de Fusionar
  const openMergeModal = async () => {
    setIsLoadingCandidates(true);
    try {
      const data = await findMergeCandidates(ticket.id);
      const list = Array.isArray(data) ? data : data?.data || [];
      setMergeCandidates(list);
    } catch (err) {
      toast.error("No fue posible cargar candidatos de fusión");
      setMergeCandidates([]);
    } finally {
      setIsLoadingCandidates(false);
    }
  };

  React.useEffect(() => {
    if (state.merge) openMergeModal();
    // eslint-disable-next-line
  }, [state.merge]);

  const handleConfirmMerge = async () => {
    if (!selectedMergeTarget) {
      toast.error("Selecciona un ticket destino para fusionar");
      return;
    }
    setIsMerging(true);
    try {
      await mergeTicket(ticket.id, selectedMergeTarget);
      toast.success("Tickets fusionados correctamente");
      queryClient.invalidateQueries(["tickets"]);
      queryClient.invalidateQueries(["ticket", ticket.id]);
      queryClient.invalidateQueries(["ticket", selectedMergeTarget]);
      onClose("merge");
    } catch (err) {
      toast.error(err?.message || "No fue posible fusionar los tickets");
    } finally {
      setIsMerging(false);
    }
  };

  // Modal de Resolver
  const handleResolveTicket = async () => {
    try {
      await updateTicket(ticket.id, { estado: "cerrado" });
      toast.success("Ticket marcado como resuelto");
      queryClient.invalidateQueries(["ticket", ticket.id]);
      queryClient.invalidateQueries(["tickets"]);
      onClose("resolve");
    } catch (err) {
      toast.error(err?.message || "No fue posible marcar como resuelto");
    }
  };

  return (
    <>
      {/* Nota Interna */}
      <Modal
        isOpen={state.note}
        onClose={() => onClose("note")}
        title="Nueva Nota Interna"
      >
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          rows={6}
          className="w-full mt-1 p-3 bg-dt-background border border-secondary rounded-md text-dt-foreground text-sm"
          placeholder="Escribe una nota interna visible solo para agentes..."
        />
        <div className="flex justify-end gap-4 mt-4">
          <Button variant="secondary" size="md" fullWidth={false} onClick={() => onClose("note")}>Cancelar</Button>
          <Button variant="primary" size="md" fullWidth={false} disabled={!noteText.trim()} onClick={handleSaveNote}>Guardar Nota</Button>
        </div>
      </Modal>
      {/* Fusionar Tickets */}
      <Modal
        isOpen={state.merge}
        onClose={() => onClose("merge")}
        title="Fusionar Ticket"
      >
        <div className="space-y-4">
          <p className="text-dt-foreground">Selecciona el ticket destino para fusionar este ticket.</p>
          {isLoadingCandidates ? (
            <div className="text-sm text-dt-subtle">Cargando candidatos...</div>
          ) : mergeCandidates.length === 0 ? (
            <div className="text-sm text-dt-subtle">No se encontraron candidatos para fusionar.</div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-auto">
              {mergeCandidates.map((c) => (
                <label key={c.id} className="flex items-center gap-3 p-2 rounded hover:bg-white/3">
                  <input
                    type="radio"
                    name="mergeTarget"
                    value={c.id}
                    checked={String(selectedMergeTarget) === String(c.id)}
                    onChange={() => setSelectedMergeTarget(c.id)}
                  />
                  <div className="flex-1 text-sm">
                    <div className="font-medium text-dt-foreground">{c.asunto || c.subject || `Ticket ${c.id}`}</div>
                    <div className="text-dt-subtle text-xs">{c.cliente?.nombre || c.customerName || "Cliente Desconocido"} • {new Date(c.creadoEn || c.createdAt || Date.now()).toLocaleString()}</div>
                  </div>
                </label>
              ))}
            </div>
          )}
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="secondary" size="md" fullWidth={false} onClick={() => onClose("merge")}>Cancelar</Button>
            <Button variant="primary" size="md" fullWidth={false} disabled={!selectedMergeTarget || isMerging} onClick={handleConfirmMerge}>{isMerging ? "Fusionando..." : "Fusionar"}</Button>
          </div>
        </div>
      </Modal>
      {/* Resolver Ticket */}
      <Modal
        isOpen={state.resolve}
        onClose={() => onClose("resolve")}
        title="Confirmar Resolución del Ticket"
      >
        <div className="space-y-4">
          <p className="text-dt-foreground">¿Estás seguro de que deseas marcar este ticket como resuelto?</p>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-md p-3">
            <p className="text-sm text-amber-100"><strong>Nota:</strong> Una vez resuelto, el ticket se moverá a la cola de resueltos y el cliente será notificado.</p>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <Button variant="secondary" size="md" fullWidth={false} onClick={() => onClose("resolve")}>Cancelar</Button>
            <Button variant="primary" size="md" fullWidth={false} onClick={handleResolveTicket}>Sí, Resolver Ticket</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TicketModals;
