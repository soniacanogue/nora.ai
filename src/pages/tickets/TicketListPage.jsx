// src/pages/tickets/TicketListPage.jsx
import React from 'react';
import AppLayout from '../../layouts/AppLayout';
import Button from '../../components/ui/Button';
import { mockTickets } from '../../data/mockTickets'; // 1. Importar datos
import TicketRow from '../../components/tickets/TicketRow'; // 2. Importar componente de fila

const TicketListPage = () => {
  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Bandeja de Entrada</h1>
        <Button variant="secondary" className="w-auto">Crear Ticket</Button>
      </div>

      {/* Tabla de Tickets */}
      <div className="bg-primary border border-secondary rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary text-left text-subtle text-sm">
            <tr>
              <th className="p-4">Asunto</th>
              <th className="p-4 text-center">Estado</th>
              <th className="p-4 text-center">Confianza IA</th>
              <th className="p-4">Etiquetas Sugeridas</th>
            </tr>
          </thead>
          <tbody>
            {mockTickets.map(ticket => (
              <TicketRow key={ticket.id} ticket={ticket} />
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
};

export default TicketListPage;