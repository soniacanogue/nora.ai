import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

export const useTicketRealtime = (ticketId) => {
  const queryClient = useQueryClient();
  const eventSourceRef = useRef(null);

  useEffect(() => {
    if (!ticketId || typeof window === "undefined" || typeof EventSource === "undefined") return;
    let reconnectTimer;
    const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
    const streamUrl = new URL(`/tickets/${ticketId}/stream`, baseUrl);
    const token = localStorage.getItem("token");
    if (token) streamUrl.searchParams.set("token", token);
    const streamUrlString = streamUrl.toString();

    const connect = () => {
      const eventSource = new EventSource(streamUrlString, { withCredentials: true });
      eventSourceRef.current = eventSource;
      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data || "{}");
          if (!payload) return;
          queryClient.setQueryData(["ticket", ticketId], (previousTicket) => {
            if (!previousTicket) return previousTicket;
            const currentMessages = Array.isArray(previousTicket.mensajes) ? previousTicket.mensajes : [];
            const alreadyExists = currentMessages.some((msg) => {
              const messageIds = [msg.id, msg.mensajeId, msg.uuid];
              const payloadIds = [payload.id, payload.mensajeId, payload.uuid];
              return messageIds.some((identifier) => identifier && payloadIds.includes(identifier));
            });
            if (alreadyExists) return previousTicket;
            return { ...previousTicket, mensajes: [...currentMessages, payload] };
          });
        } catch (parseError) {
          // Silenciar error de parseo
        }
      };
      eventSource.onerror = () => {
        eventSource.close();
        reconnectTimer = window.setTimeout(connect, 5000);
      };
    };
    connect();
    return () => {
      eventSourceRef.current?.close();
      if (reconnectTimer) window.clearTimeout(reconnectTimer);
    };
  }, [ticketId, queryClient]);
};
