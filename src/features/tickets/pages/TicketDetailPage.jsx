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

          <div className="bg-transparent">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xs font-bold text-dt-subtle uppercase tracking-wider">
                Historial de la Conversación
                </h2>
                <span className="text-xs text-dt-subtle font-mono opacity-50">ENCRIPTADO E2E</span>
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
            />
            
            {/* Metadata adicional del ticket podría ir aquí */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                <h3 className="text-xs font-bold text-dt-subtle uppercase tracking-wider mb-3">Detalles Técnicos</h3>
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
                        <span className="uppercase">{ticket.canal || "WEB"}</span>
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
