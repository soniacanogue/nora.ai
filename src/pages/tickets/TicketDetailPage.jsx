// src/pages/tickets/TicketDetailPage.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';
import { mockTickets } from '../../data/mockTickets';
import ConversationBubble from '../../components/tickets/ConversationBubble';
import SuggestionPanel from '../../components/tickets/SuggestionPanel';

// Datos falsos adicionales para esta vista
const mockConversation = [
  {
    from: 'customer',
    author: 'Ana Pérez',
    text: 'Hola, ¿dónde está mi pedido GUP-00123?',
    timestamp: '2025-10-28T10:00:00Z',
  },
];

const mockSuggestion = {
  reply_text: "Hola Ana,\n\nTu pedido GUP-00123 está en tránsito con el transportista FastShip. El número de seguimiento es XYZ12345.\n\nEstimamos que la entrega será mañana, 29 de Octubre.\n\n¿Necesitas algo más?",
  confidence: 0.92,
  suggested_tags: ['WISMO'],
};

const TicketDetailPage = () => {
  const { ticketId } = useParams();
  const ticket = mockTickets.find(t => t.id === ticketId);

  if (!ticket) {
    // ... (código de error sin cambios)
  }

  return (
    <AppLayout>
      {/* Encabezado de la página */}
      <div className="mb-6">
        <Link to="/tickets" className="text-subtle hover:text-foreground transition-colors">
          &larr; Volver a la Bande-ja de Entrada
        </Link>
        <h1 className="text-3xl font-bold text-foreground mt-2">{ticket.subject}</h1>
        <p className="text-subtle">
          Cliente: <span className="text-foreground">{ticket.client.name}</span> ({ticket.client.email})
        </p>
      </div>

      {/* Contenedor principal de dos columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Conversación (ocupa 2 de 3 columnas en pantallas grandes) */}
        <div className="lg:col-span-2 bg-primary border border-secondary rounded-lg p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Historial de la Conversación</h2>
          {mockConversation.map((msg, index) => (
            <ConversationBubble key={index} message={msg} />
          ))}
        </div>

        {/* Columna Derecha: Panel de Acción (ocupa 1 de 3 columnas) */}
        <div className="lg:col-span-1">
          <SuggestionPanel suggestion={mockSuggestion} />
        </div>
        
      </div>
    </AppLayout>
  );
};

export default TicketDetailPage;