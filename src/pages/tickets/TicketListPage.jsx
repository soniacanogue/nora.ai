// src/pages/tickets/TicketListPage.jsx
import React, { useState } from 'react';
import AppLayout from '../../layouts/AppLayout';
import Button from '../../components/ui/Button';
import { mockTickets } from '../../data/mockTickets';
import TicketRow from '../../components/tickets/TicketRow';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';

const TicketListPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateTicket = (e) => {
    e.preventDefault();
    console.log('Creando ticket desde el modal...');
    // Aquí, en el futuro, se añadiría el nuevo ticket a la lista
    setIsModalOpen(false);
  };

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Bandeja de Entrada</h1>
        <Button variant="secondary" className="w-auto" onClick={() => setIsModalOpen(true)}>
          Crear Ticket
        </Button>
      </div>

      {/* CÓDIGO DE LA TABLA RESTAURADO */}
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
      {/* FIN DEL CÓDIGO RESTAURADO */}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Crear Nuevo Ticket Manualmente"
      >
        <form onSubmit={handleCreateTicket} className="space-y-4">
          <Input id="clientEmail" label="Correo del Cliente" type="email" required />
          <Input id="subject" label="Asunto" required />
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-subtle mb-2">Mensaje Inicial</label>
            <textarea id="message" rows="4" className="w-full p-3 bg-background border border-secondary rounded-md" required />
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <Button type="button" variant="secondary" className="w-auto" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="primary" className="w-auto">Crear</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
};

export default TicketListPage;