import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useTicket } from "../hooks/useTicket"; // Hook ya refactorizado
import ConversationBubble from "../components/ConversationBubble";
import SuggestionPanel from "../components/SuggestionPanel";
import Modal from "src/shared/components/ui/Modal";
import { useCreateMessage } from "../hooks/useCreateMessage";
import OrderInfoPanel from "../components/OrderInfoPanel";
import Button from "src/shared/components/ui/Button";
import toast from "react-hot-toast";
import { updateTicket } from "../api/ticketsApi";
import { useTicketQueue } from "../hooks/useTicketQueue"; // NUEVO Hook para navegación
import { formatChannel } from "@/shared/utils/formatters";

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
    const size =
      file.size ??
      file.tamano ??
      file["tamaño"] ??
      file.bytes ??
      file.peso ??
      null;

    const remoteFileId =
      file.storageId ||
      file.storage_id ||
      file.uploadId ||
      file.upload_id ||
      file.fileId ||
      file.file_id ||
      file.uuid ||
      file.attachmentId ||
      file.attachment_id ||
      file.id ||
      null;

    return {
      id:
        remoteFileId ||
        file.id ||
        `${message?.id || message?.mensajeId || "msg"}-${index}`,
      fileId: remoteFileId,
      name:
        file.nombre ||
        file.nombreArchivo ||
        file.fileName ||
        file.filename ||
        file.titulo ||
        `Archivo ${index + 1}`,
      url:
        file.url ||
        file.urlAlmacenamiento ||
        file.urlFirmado ||
        file.link ||
        file.enlace ||
        file.descarga ||
        "",
      mimeType:
        file.mimeType || file.tipoMime || file.tipoContenido || file.tipo || "",
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

// El componente Skeleton es una excelente práctica, lo mantenemos.
const TicketDetailSkeleton = () => (
  <div className="animate-pulse max-w-7xl mx-auto">
    <div className="h-4 bg-white/5 rounded w-32 mb-4"></div>
    <div className="flex justify-between items-start mb-8">
      <div className="w-2/3">
        <div className="h-10 bg-white/10 rounded w-3/4 mb-2"></div>
        <div className="h-5 bg-white/5 rounded w-1/2"></div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="h-32 bg-white/5 rounded-lg border border-white/5"></div>
        <div className="h-96 bg-white/5 rounded-lg border border-white/5"></div>
      </div>
      <div className="lg:col-span-1">
        <div className="h-80 bg-white/5 rounded-lg border border-white/5"></div>
      </div>
    </div>
  </div>
);

const TicketDetailPage = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const liveSubscriptionRef = useRef(null);

  // Obtenemos la cola de tickets actual y las funciones para navegar
  const { queue, getNextTicketId } = useTicketQueue();

  // Usamos el hook useTicket que ahora es useQuery
  const { data: ticket, isLoading, isError, error } = useTicket(ticketId);

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const { mutate: createMessage, isPending: isCreatingMessage } = useCreateMessage();

  useEffect(() => {
    if (typeof window === "undefined" || typeof EventSource === "undefined") {
      return undefined;
    }
    if (!ticketId) {
      return undefined;
    }

    let reconnectTimer;
    const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
    const streamUrl = new URL(`/tickets/${ticketId}/stream`, baseUrl);
    const token = localStorage.getItem("token");
    if (token) {
      streamUrl.searchParams.set("token", token);
    }
    const streamUrlString = streamUrl.toString();

    const connect = () => {
      const eventSource = new EventSource(streamUrlString, {
        withCredentials: true,
      });
      liveSubscriptionRef.current = eventSource;

      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data || "{}");
          if (!payload) return;

          queryClient.setQueryData(["ticket", ticketId], (previousTicket) => {
            if (!previousTicket) return previousTicket;
            const currentMessages = Array.isArray(previousTicket.mensajes)
              ? previousTicket.mensajes
              : [];
            const alreadyExists = currentMessages.some((msg) => {
              const messageIds = [msg.id, msg.mensajeId, msg.uuid];
              const payloadIds = [payload.id, payload.mensajeId, payload.uuid];
              return messageIds.some(
                (identifier) => identifier && payloadIds.includes(identifier),
              );
            });

            if (alreadyExists) {
              return previousTicket;
            }

            return {
              ...previousTicket,
              mensajes: [...currentMessages, payload],
            };
          });
        } catch (parseError) {
          console.error("Error al procesar evento SSE del ticket", parseError);
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        reconnectTimer = window.setTimeout(connect, 5000);
      };
    };

    connect();

    return () => {
      if (liveSubscriptionRef.current) {
        liveSubscriptionRef.current.close();
      }
      if (reconnectTimer) {
        window.clearTimeout(reconnectTimer);
      }
    };
  }, [ticketId, queryClient]);
  const ticketChannel =
    ticket?.canalOrigen || ticket?.canal || ticket?.channel || "web";
  const normalizedChannel = (ticketChannel || "").toLowerCase();
  const fallbackChannelLabel =
    typeof ticketChannel === "string" ? ticketChannel.toUpperCase() : "WEB";
  const ticketChannelLabel =
    formatChannel(normalizedChannel) || fallbackChannelLabel;
  const isEmailChannel = /mail|correo/i.test(normalizedChannel);
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

  // Lógica para navegar al siguiente ticket al aprobar
  const handleApprovalSuccess = () => {
    const nextTicketId = getNextTicketId(ticketId);
    if (nextTicketId) {
      navigate(`/tickets/${nextTicketId}`);
    } else {
      // Si no hay más tickets, volvemos a la lista
      navigate("/tickets?estado=ia_sugerido");
    }
  };

  // ... (lógica de `adaptedConversation` y `aiSuggestion` sin cambios)
  const adaptedConversation = useMemo(() => {
    // 3. Hacemos la lógica defensiva DENTRO del hook.
    //    Si `ticket` es null o undefined, devolvemos un array vacío.
    if (!ticket?.mensajes) return [];

    return ticket.mensajes.map((msg) => {
      const attachments = normalizeAttachments(msg);
      const resolvedChannel =
        msg?.canalOrigen || msg?.canal || msg?.channel || ticketChannel;

      return {
        id: msg.id || msg.mensajeId || msg.uuid || msg.conversacionId,
        from: msg.usuarioId ? "agent" : "customer",
        // El hook ya nos enriquece con ticket.cliente, pero es bueno ser defensivo
        author: msg.usuarioId
          ? msg.nombreAgente || "Agente"
          : msg.remitenteNombre || ticket.cliente?.nombre || "Cliente",
        text: resolveMessageBody(msg),
        timestamp: msg.enviadoEn || msg.creadoEn || msg.fecha,
        attachments,
        channel: resolvedChannel,
        isInternalNote: msg.esNotaInterna,
      };
    });
  }, [ticket, ticketChannel]); // La dependencia es correcta: recalcular solo si `ticket` cambia.

  const aiSuggestion = useMemo(() => {
    if (!ticket?.mensajes) return {};

    // 4. Buscamos primero un mensaje que tenga respuestaSugeridaIA (sugerencia de IA)
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

  // 5. AHORA, después de que todos los hooks han sido declarados,
  //    podemos manejar los retornos condicionales de forma segura.
  if (isLoading) {
    return <TicketDetailSkeleton />;
  }

  if (isError) {
    return (
      <div className="text-center text-dt-error p-8 bg-dt-error/5 rounded-lg border border-dt-error/20">
        <h2 className="text-2xl font-bold mb-2">Error al cargar el ticket</h2>
        <p className="mb-4">{error.message}</p>
        <Link to="/tickets" className="inline-block">
          <Button
            variant="secondary"
            size="md"
            fullWidth={false}
            onClick={() => {}}
          >
            Volver a la lista
          </Button>
        </Link>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        {/* ... (código del error 404 sin cambios) ... */}
      </div>
    );
  }

  // ---- NUEVO LAYOUT ----
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <Link
            to="/tickets"
            className="text-xs font-mono text-dt-subtle hover:text-dt-accent transition-colors mb-2 inline-block uppercase tracking-wider"
          >
            &larr; Volver a la Bandeja
          </Link>
          <h1 className="text-3xl font-bold text-dt-foreground mt-1 leading-tight">
            {ticket.asunto}
          </h1>
          <div className="flex items-center gap-2 mt-2 text-sm">
            <span className="text-dt-subtle">Cliente:</span>
            <span className="text-dt-foreground font-medium bg-white/5 px-2 py-0.5 rounded border border-white/10">
              {ticket.cliente?.nombre || "Anónimo"}
            </span>
            <span className="text-dt-subtle font-mono text-xs">
              &lt;{ticket.cliente?.correo || "sin-correo"}&gt;
            </span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] font-mono uppercase tracking-wider text-dt-subtle">
            <span className="opacity-60">Origen</span>
            <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-dt-foreground shadow-glow">
              {ticketChannelLabel}
            </span>
            {isEmailChannel && (
              <span className="px-2.5 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-100 font-semibold tracking-normal">
                Responderás vía Email
              </span>
            )}
          </div>
        </div>
        {/* NAVEGACIÓN ENTRE TICKETS */}
        <div className="flex gap-2">
          {/* Lógica para botones "Anterior" y "Siguiente" usando useTicketQueue */}
          {ticket && ticket.estado !== "resuelto" && (
            <Button
              variant="ghost"
              size="md"
              onClick={async () => {
                try {
                  // send only the state change as requested
                  await updateTicket(ticketId, { nuevoEstado: "resuelto" });
                  toast.success("Ticket marcado como resuelto");
                  // Refresh ticket data and lists
                  queryClient.invalidateQueries(["ticket", ticketId]);
                  queryClient.invalidateQueries(["tickets"]);
                } catch (err) {
                  console.error("Failed to mark ticket resolved:", err);
                  toast.error(err?.message || "No fue posible marcar como resuelto");
                }
              }}
            >
              Marcar como Resuelto
            </Button>
          )}
        </div>
      </div>

      {/* Banner de sugerencia de fusión sin cambios */}

      {/* --- INICIO DE VISTA DIVIDIDA --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda (Conversación) */}
        <div className="lg:col-span-2 space-y-6">
          {ticket.orden && <OrderInfoPanel order={ticket.orden} />}

          <div className="bg-transparent">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold text-dt-subtle uppercase tracking-wider">
                Historial de la Conversación
              </h2>
              <span className="text-xs text-dt-subtle font-mono opacity-50">
                ENCRIPTADO E2E
              </span>
            </div>

            <div className="space-y-2 relative">
              {/* Linea de tiempo vertical decorativa */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent z-0 hidden md:block"></div>

              {adaptedConversation.map((msg, index) => (
                <div key={index} className="relative z-10">
                  <ConversationBubble message={msg} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Columna Derecha (Panel de Acción Sticky) */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
              <SuggestionPanel
                suggestion={aiSuggestion}
                ticketId={ticketId}
                onApprovalSuccess={handleApprovalSuccess} // Pasamos el callback
                approvalContext={approvalContext}
              />

              {/* Botón para crear nota interna rápida */}
              <div className="mt-4">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsNoteModalOpen(true)}
                >
                  📝 Añadir nota interna
                </Button>
              </div>

              <Modal
                isOpen={isNoteModalOpen}
                onClose={() => setIsNoteModalOpen(false)}
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
                  <Button
                    variant="secondary"
                    size="md"
                    fullWidth={false}
                    onClick={() => setIsNoteModalOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    fullWidth={false}
                    onClick={() => {
                      createMessage({ ticketId, contenidoTexto: noteText, esNotaInterna: true });
                      setIsNoteModalOpen(false);
                      setNoteText("");
                    }}
                  >
                    Guardar Nota
                  </Button>
                </div>
              </Modal>

            {/* Metadata adicional del ticket podría ir aquí */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/5">
              <h3 className="text-xs font-bold text-dt-subtle uppercase tracking-wider mb-3">
                Detalles Técnicos
              </h3>
              <div className="space-y-2 text-xs font-mono text-dt-subtle">
                <div className="flex justify-between">
                  <span>ID:</span>
                  <span className="text-dt-foreground">{ticket.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Creado:</span>
                  <span>{new Date(ticket.creadoEn).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Canal:</span>
                  <span className="uppercase">{ticketChannelLabel}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPage;
