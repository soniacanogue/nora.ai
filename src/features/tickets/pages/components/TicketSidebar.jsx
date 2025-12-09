import React, { useMemo } from "react";
import SuggestionPanel from "../../components/SuggestionPanel";

export const TicketSidebar = ({ ticket, onOpenMerge, onOpenNote }) => {
  // Calcular aiSuggestion
  const aiSuggestion = useMemo(() => {
    if (!ticket?.mensajes) return {};

    // Buscamos primero un mensaje que tenga respuestaSugeridaIA (sugerencia de IA)
    // Si no lo encontramos, buscamos el último mensaje del cliente
    let messageWithSuggestion = [...ticket.mensajes]
      .reverse()
      .find((m) => !m.esNotaInterna && !m.usuarioId && m.respuestaSugeridaIA);

    // Si no hay mensaje con sugerencia, buscamos el último mensaje del cliente
    if (!messageWithSuggestion) {
      messageWithSuggestion = [...ticket.mensajes]
        .reverse()
        .find((m) => !m.esNotaInterna && !m.usuarioId);
    }

    return {
      reply_text: messageWithSuggestion?.respuestaSugeridaIA || "",
      confidence: messageWithSuggestion?.confianzaIA,
      suggested_tags: ticket.etiquetas?.map((tag) => tag.nombre) || [],
    };
  }, [ticket]);

  // Calcular approvalContext
  const latestCustomerMessage = useMemo(() => {
    if (!ticket?.mensajes?.length) return null;
    const customerMessages = ticket.mensajes.filter(
      (msg) => !msg.usuarioId && !msg.esNotaInterna,
    );
    if (customerMessages.length) {
      return customerMessages[customerMessages.length - 1];
    }
    return ticket.mensajes[ticket.mensajes.length - 1];
  }, [ticket]);

  const latestCustomerFingerprint =
    latestCustomerMessage?.id ||
    latestCustomerMessage?.mensajeId ||
    latestCustomerMessage?.uuid ||
    latestCustomerMessage?.enviadoEn ||
    null;

  const latestCustomerTimestamp =
    latestCustomerMessage?.enviadoEn ||
    latestCustomerMessage?.creadoEn ||
    latestCustomerMessage?.fecha ||
    null;

  const ticketChannel =
    ticket?.canalOrigen || ticket?.canal || ticket?.channel || "web";
  const normalizedChannel = (ticketChannel || "").toLowerCase();
  const shouldAutoCloseOnReply = Boolean(
    ticket?.autoCloseOnReply ??
    ticket?.cerrarAlResponder ??
    ticket?.cierraAlEnviar ??
    ticket?.closeOnReply ??
    false,
  );
  const nextStateAfterApproval = shouldAutoCloseOnReply
    ? "cerrado"
    : "esperando_cliente";

  const approvalContext = useMemo(
    () => ({
      replyChannel: normalizedChannel || "web",
      nextState: nextStateAfterApproval,
      latestMessageFingerprint: latestCustomerFingerprint,
      latestMessageTimestamp: latestCustomerTimestamp,
    }),
    [
      normalizedChannel,
      nextStateAfterApproval,
      latestCustomerFingerprint,
      latestCustomerTimestamp,
    ],
  );

  return (
    <div className="flex flex-col h-full">
      {/* SECCIÓN 1: Acciones Principales (IA) */}
      <div className="p-5 border-b border-white/5 space-y-4">
        <div className="bg-purple-900/10 border border-purple-500/20 rounded-xl p-1 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 opacity-50" />
          <SuggestionPanel
            suggestion={aiSuggestion}
            ticketId={ticket.id}
            ticket={ticket}
            onApprovalSuccess={() => {}} // TODO: implementar navegación
            approvalContext={approvalContext}
          />
        </div>
      </div>
      {/* SECCIÓN 2: Acciones Rápidas */}
      <div className="p-5 grid grid-cols-2 gap-3 border-b border-white/5">
        <button 
          onClick={onOpenNote}
          className="flex flex-col items-center justify-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition border border-white/5 hover:border-white/20"
        >
          <span className="text-xl mb-1">📝</span>
          <span className="text-xs font-medium text-dt-subtle">Nota Interna</span>
        </button>
        <button 
          onClick={onOpenMerge}
          className="flex flex-col items-center justify-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition border border-white/5 hover:border-white/20"
        >
          <span className="text-xl mb-1">🔀</span>
          <span className="text-xs font-medium text-dt-subtle">Fusionar</span>
        </button>
      </div>
      {/* SECCIÓN 3: Datos del Cliente (CRM Mini) */}
      <div className="p-5 flex-1">
        <h3 className="text-xs font-bold text-dt-subtle uppercase mb-4">Contexto Cliente</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-dt-subtle">Nombre</span>
            <span className="text-white font-medium">{ticket.cliente?.nombre}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-dt-subtle">Email</span>
            <span className="text-white font-medium truncate max-w-[150px]" title={ticket.cliente?.correo}>
              {ticket.cliente?.correo}
            </span>
          </div>
        </div>
      </div>
      {/* FOOTER: Detalles Técnicos (Discretos) */}
      <div className="p-4 bg-black/20 text-[10px] font-mono text-dt-subtle space-y-1">
        <div className="flex justify-between">
          <span>CANAL</span> 
          <span className="text-dt-accent">{ticket.canal}</span>
        </div>
        <div className="flex justify-between">
          <span>UUID</span> 
          <span className="opacity-50 truncate w-24">{ticket.uuid}</span>
        </div>
      </div>
    </div>
  );
};

export default TicketSidebar;
