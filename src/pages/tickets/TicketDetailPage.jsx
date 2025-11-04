// src/pages/tickets/TicketDetailPage.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';
import { mockTickets } from '../../data/mockTickets'; // Reutilizamos nuestros datos falsos

const TicketDetailPage = () => {
  const { ticketId } = useParams(); // Lee el ':ticketId' de la URL. Ej: "TKT-001"
  const ticket = mockTickets.find(t => t.id === ticketId);

  // Manejo de caso donde el ticket no se encuentra
  if (!ticket) {
    return (
      <AppLayout>
        <h1 className="text-2xl text-red-500">Error: Ticket no encontrado</h1>
        <Link to="/tickets" className="text-accent hover:underline mt-4 inline-block">
          Volver a la Bandeja de Entrada
        </Link>
      </AppLayout>
    );
  }

  // Si encontramos el ticket, mostramos sus detalles
  return (
    <AppLayout>
      <div className="mb-6">
        <Link to="/tickets" className="text-subtle hover:text-foreground transition-colors">
          &larr; Volver a la Bandeja de Entrada
        </Link>
        <h1 className="text-3xl font-bold text-foreground mt-2">{ticket.subject}</h1>
        <p className="text-subtle">
          Cliente: <span className="text-foreground">{ticket.client.name}</span> ({ticket.client.email})
        </p>
      </div>
      <div className="bg-primary border border-secondary rounded-lg p-6">
        <h3 className="text-xl text-foreground">Próximamente...</h3>
        <p className="text-subtle mt-2">
          Aquí irá la vista de dos paneles con el historial de la conversación, 
          el panel de sugerencias de Nora AI y las acciones para el agente.
        </p>
      </div>
    </AppLayout>
  );
};

export default TicketDetailPage;