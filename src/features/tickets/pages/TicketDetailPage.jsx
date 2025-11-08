// src/features/tickets/pages/TicketDetailPage.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import AppLayout from "../../../shared/components/layout/AppLayout";
import { mockTickets } from "../../../data/mockTickets";
import ConversationBubble from "../components/ConversationBubble";
import SuggestionPanel from "../components/SuggestionPanel";
import Button from "src/shared/components/ui/Button";

const TicketDetailPage = () => {
  const { ticketId } = useParams();
  const ticket = mockTickets.find((t) => t.id === ticketId);

  // Manejo robusto si el ticket no se encuentra
  if (!ticket) {
    return (
      <div>
        <div className="flex flex-col items-center justify-center h-full text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-4">Error 404</h1>
          <p className="text-lg text-foreground mb-1">Ticket no encontrado</p>
          <p className="text-subtle mb-6">
            El ticket con ID "{ticketId}" no existe o ha sido movido.
          </p>
          <Link to="/tickets">
            <Button variant="primary" className="w-auto">
              Volver a la Bandeja de Entrada
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // --- INICIO DE LA LÓGICA DE ADAPTACIÓN ---
  // Transformamos los datos del `ticket` para pasarlos a los componentes hijos.

  // 1. Adaptar el historial de mensajes
  const adaptedConversation = ticket.mensajes.map((msg) => ({
    from: msg.usuarioId ? "agent" : "customer", // Si hay usuarioId, es un agente
    author: msg.usuarioId ? "Agente (Brenda)" : ticket.cliente.nombre, // Placeholder para el nombre del agente
    text: msg.contenidoTexto,
    timestamp: msg.creadoEn || new Date().toISOString(),
  }));

  // 2. Adaptar la sugerencia de la IA (tomada del primer mensaje)
  const latestMessage = ticket.mensajes?.[0];
  const aiSuggestion = {
    reply_text: latestMessage?.respuestaSugeridaIA || "",
    confidence: latestMessage?.confianzaIA,
    suggested_tags: ticket.etiquetas.map((tag) => tag.nombre),
  };
  // --- FIN DE LA LÓGICA DE ADAPTACIÓN ---

  return (
    <div>
      {/* Encabezado de la página */}
      <div className="mb-6">
        <Link
          to="/tickets"
          className="text-sm text-subtle hover:text-foreground transition-colors flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Volver a la Bandeja de Entrada
        </Link>
        <h1 className="text-3xl font-bold text-foreground mt-4">
          {ticket.asunto}
        </h1>
        <p className="text-subtle">
          Cliente:{" "}
          <span className="text-foreground font-medium">
            {ticket.cliente.nombre}
          </span>{" "}
          ({ticket.cliente.correo})
        </p>
      </div>

      {/* Contenedor principal de dos columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda: Conversación */}
        <div className="lg:col-span-2 bg-primary border border-secondary rounded-lg p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">
            Historial de la Conversación
          </h2>
          <div className="space-y-6">
            {adaptedConversation.map((msg, index) => (
              <ConversationBubble key={index} message={msg} />
            ))}
          </div>
        </div>

        {/* Columna Derecha: Panel de Acción */}
        <div className="lg:col-span-1">
          <SuggestionPanel suggestion={aiSuggestion} />
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPage;
