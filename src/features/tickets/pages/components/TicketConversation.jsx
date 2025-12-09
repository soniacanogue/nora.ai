import React from "react";
import ConversationBubble from "../../components/ConversationBubble";
import OrderInfoPanel from "../../components/OrderInfoPanel";

// Helper para normalizar mensajes y attachments
const normalizeAttachments = (message) => {
  const attachmentSources = [
    message?.adjuntos,
    message?.attachments,
    message?.archivos,
    message?.archivosAdjuntos,
    message?.files,
  ];
  const attachments = attachmentSources.find(Array.isArray) || [];
  if (!attachments.length) return [];
  return attachments.map((file = {}, index) => {
    const size = file.size ?? file.tamano ?? file["tamaño"] ?? file.bytes ?? file.peso ?? null;
    const remoteFileId = file.storageId || file.storage_id || file.uploadId || file.upload_id || file.fileId || file.file_id || file.uuid || file.attachmentId || file.attachment_id || file.id || null;
    return {
      id: remoteFileId || file.id || `${message?.id || message?.mensajeId || "msg"}-${index}`,
      fileId: remoteFileId,
      name: file.nombre || file.nombreArchivo || file.fileName || file.filename || file.titulo || `Archivo ${index + 1}`,
      url: file.url || file.urlAlmacenamiento || file.urlFirmado || file.link || file.enlace || file.descarga || "",
      mimeType: file.mimeType || file.tipoMime || file.tipoContenido || file.tipo || "",
      size,
      metadata: file.metadata,
    };
  });
};

const resolveMessageBody = (message) =>
  message?.contenidoHtml ||
  message?.bodyHtml ||
  message?.html ||
  message?.contenidoTexto ||
  message?.textoPlano ||
  message?.texto ||
  message?.body ||
  "";

export const TicketConversation = ({ ticket }) => {
  if (!ticket) return null;
  const adaptedConversation = Array.isArray(ticket.mensajes)
    ? ticket.mensajes.map((msg) => {
        const attachments = normalizeAttachments(msg);
        const resolvedChannel = msg?.canalOrigen || msg?.canal || msg?.channel || ticket.canal;
        return {
          id: msg.id || msg.mensajeId || msg.uuid || msg.conversacionId,
          from: msg.usuarioId ? "agent" : "customer",
          author: msg.usuarioId
            ? msg.nombreAgente || "Agente"
            : msg.remitenteNombre || ticket.cliente?.nombre || "Cliente",
          text: resolveMessageBody(msg),
          timestamp: msg.enviadoEn || msg.creadoEn || msg.fecha,
          attachments,
          channel: resolvedChannel,
          isInternalNote: msg.esNotaInterna,
        };
      })
    : [];
  return (
    <div className="space-y-6">
      {ticket.orden && <OrderInfoPanel order={ticket.orden} />}
      <div className="bg-transparent">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs font-bold text-dt-subtle uppercase tracking-wider">Historial de la Conversación</h2>
          <span className="text-xs text-dt-subtle font-mono opacity-50">ENCRIPTADO E2E</span>
        </div>
        <div className="space-y-2 relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent z-0 hidden md:block"></div>
          {adaptedConversation.map((msg, index) => (
            <div key={index} className="relative z-10">
              <ConversationBubble message={msg} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TicketConversation;
