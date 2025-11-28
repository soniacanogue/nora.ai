import React, { useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTicket } from "../hooks/useTicket"; // Hook ya refactorizado
import ConversationBubble from "../components/ConversationBubble";
import SuggestionPanel from "../components/SuggestionPanel";
import OrderInfoPanel from "../components/OrderInfoPanel";
import Button from "src/shared/components/ui/Button";
import { useTicketQueue } from "../hooks/useTicketQueue"; // NUEVO Hook para navegación

// El componente Skeleton es una excelente práctica, lo mantenemos.
const TicketDetailSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-6 bg-dt-secondary rounded w-1/4 mb-4"></div>
    <div className="h-10 bg-dt-secondary rounded w-3/4 mb-2"></div>
    <div className="h-5 bg-dt-secondary rounded w-1/2 mb-8"></div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-dt-primary border border-secondary rounded-lg p-6 space-y-6">
        <div className="h-20 bg-dt-secondary rounded"></div>
        <div className="h-20 bg-dt-secondary rounded"></div>
      </div>
      <div className="lg:col-span-1 bg-dt-primary border border-secondary rounded-lg p-6">
        <div className="h-40 bg-dt-secondary rounded"></div>
      </div>
    </div>
  </div>
);

const TicketDetailPage = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  // Obtenemos la cola de tickets actual y las funciones para navegar
  const { queue, getNextTicketId } = useTicketQueue();

  // Usamos el hook useTicket que ahora es useQuery
  const { data: ticket, isLoading, isError, error } = useTicket(ticketId);

  // Lógica para navegar al siguiente ticket al aprobar
  const handleApprovalSuccess = () => {
    const nextTicketId = getNextTicketId(ticketId);
    if (nextTicketId) {
      navigate(`/tickets/${nextTicketId}`);
    } else {
      // Si no hay más tickets, volvemos a la lista
      navigate("/tickets?status=ia_sugerido");
    }
  };

  // ... (lógica de `adaptedConversation` y `aiSuggestion` sin cambios)
  const adaptedConversation = useMemo(() => {
    // 3. Hacemos la lógica defensiva DENTRO del hook.
    //    Si `ticket` es null o undefined, devolvemos un array vacío.
    if (!ticket?.mensajes) return [];

    return ticket.mensajes.map((msg) => ({
      from: msg.usuarioId ? "agent" : "customer",
      // El hook ya nos enriquece con ticket.cliente, pero es bueno ser defensivo
      author: msg.usuarioId ? "Agente" : ticket.cliente?.nombre || "Cliente",
      text: msg.contenidoTexto,
      timestamp: msg.enviadoEn,
      isInternalNote: msg.esNotaInterna,
    }));
  }, [ticket]); // La dependencia es correcta: recalcular solo si `ticket` cambia.

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

  // 5. AHORA, después de que todos los hooks han sido declarados,
  //    podemos manejar los retornos condicionales de forma segura.
  if (isLoading) {
    return <TicketDetailSkeleton />;
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 p-8">
        <h2 className="text-2xl font-bold mb-2">Error al cargar el ticket</h2>
        <p>{error.message}</p>
        <Link to="/tickets" className="mt-4 inline-block">
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
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <Link
            to="/tickets"
            className="text-sm text-dt-subtle hover:text-dt-foreground"
          >
            &larr; Volver a la Bandeja de Entrada
          </Link>
          <h1 className="text-3xl font-bold text-dt-foreground mt-2">
            {ticket.asunto}
          </h1>
          <p className="text-dt-subtle">
            Cliente:{" "}
            <span className="text-dt-foreground font-medium">
              {ticket.cliente?.nombre || ""}
            </span>{" "}
            ({ticket.cliente?.correo || ""})
          </p>
        </div>
        {/* NAVEGACIÓN ENTRE TICKETS */}
        <div className="flex gap-2">
          {/* Lógica para botones "Anterior" y "Siguiente" usando useTicketQueue */}
        </div>
      </div>

      {/* Banner de sugerencia de fusión sin cambios */}

      {/* --- INICIO DE VISTA DIVIDIDA --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda (Conversación) */}
        <div className="lg:col-span-2 space-y-6">
          {ticket.orden && <OrderInfoPanel order={ticket.orden} />}

          <div className="bg-dt-primary border border-secondary rounded-lg p-6">
            <h2 className="text-xl font-bold text-dt-foreground mb-6">
              Historial de la Conversación
            </h2>
            <div className="space-y-6">
              {adaptedConversation.map((msg, index) => (
                <ConversationBubble key={index} message={msg} />
              ))}
            </div>
          </div>
        </div>

        {/* Columna Derecha (Panel de Acción Sticky) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <SuggestionPanel
              suggestion={aiSuggestion}
              ticketId={ticketId}
              onApprovalSuccess={handleApprovalSuccess} // Pasamos el callback
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPage;
