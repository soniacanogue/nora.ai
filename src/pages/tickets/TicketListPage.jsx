// src/pages/tickets/TicketListPage.jsx
import React, { useState } from 'react';
import AppLayout from '../../layouts/AppLayout';
import Button from '../../components/ui/Button';
import { mockTickets } from '../../data/mockTickets';
import TicketRow from '../../components/tickets/TicketRow';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import FileUpload from '../../components/ui/FileUpload'; // 1. IMPORTAR EL COMPONENTE

const TicketListPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [files, setFiles] = useState([]); // 2. AÑADIR ESTADO PARA ARCHIVOS

  const handleCreateTicket = (e) => {
    e.preventDefault();
    console.log('Creando ticket desde el modal...');
    console.log('Archivos adjuntos:', files); // 3. MOSTRAR ARCHIVOS EN CONSOLA
    setFiles([]); // Limpiar archivos después de enviar
    setIsModalOpen(false);
  };

  const openModal = () => {
    setFiles([]); // Asegurarse de que el modal esté limpio cada vez que se abre
    setIsModalOpen(true);
  }

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Bandeja de Entrada</h1>
        <Button variant="secondary" className="w-auto" onClick={openModal}>
          Crear Ticket
        </Button>
      </div>

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

          {/* 4. AÑADIR EL COMPONENTE DE CARGA DE ARCHIVOS */}
          <FileUpload 
            label="Adjuntar Archivos (Opcional)"
            onFilesSelect={(selectedFiles) => setFiles(selectedFiles)}
          />

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