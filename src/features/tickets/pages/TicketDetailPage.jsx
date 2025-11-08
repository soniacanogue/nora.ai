import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useTicket } from "../hooks/useTicket";
import ConversationBubble from "../components/ConversationBubble";
import SuggestionPanel from "../components/SuggestionPanel";
import Button from "src/shared/components/ui/Button";

// El componente Skeleton es una excelente práctica, lo mantenemos.
const TicketDetailSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-6 bg-secondary rounded w-1/4 mb-4"></div>
    <div className="h-10 bg-secondary rounded w-3/4 mb-2"></div>
    <div className="h-5 bg-secondary rounded w-1/2 mb-8"></div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-primary border border-secondary rounded-lg p-6 space-y-6">
        <div className="h-20 bg-secondary rounded"></div>
        <div className="h-20 bg-secondary rounded"></div>
      </div>
      <div className="lg:col-span-1 bg-primary border border-secondary rounded-lg p-6">
        <div className="h-40 bg-secondary rounded"></div>
      </div>
    </div>
  </div>
);

const TicketDetailPage = () => {
  const { ticketId } = useParams();
  // 1. La llamada al hook de datos se mantiene igual.
  const { ticket, isLoading, error } = useTicket(ticketId);

  // 2. REGLA DE ORO: Todos los hooks se declaran en el nivel superior.
  //    Esta es la única declaración de estas constantes.
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

    // 4. Usamos la lógica más robusta para encontrar la sugerencia.
    const latestCustomerMessage = [...ticket.mensajes]
      .reverse()
      .find((m) => !m.esNotaInterna && !m.usuarioId);

    return {
      reply_text: latestCustomerMessage?.respuestaSugeridaIA || "",
      confidence: latestCustomerMessage?.confianzaIA,
      suggested_tags: ticket.etiquetas?.map((tag) => tag.nombre) || [],
    };
  }, [ticket]);

  // 5. AHORA, después de que todos los hooks han sido declarados,
  //    podemos manejar los retornos condicionales de forma segura.
  if (isLoading) {
    return <TicketDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <h2 className="text-2xl font-bold mb-2">Error al cargar el ticket</h2>
        <p>{error}</p>
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

  // 6. El JSX final ahora consume las variables memoizadas.
  return (
    <div>
      <div className="mb-6">
        <Link
          to="/tickets"
          className="text-sm text-subtle hover:text-foreground ..."
        >
          {/* ... (ícono de flecha) ... */}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

        <div className="lg:col-span-1">
          <SuggestionPanel suggestion={aiSuggestion} />
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPage;
