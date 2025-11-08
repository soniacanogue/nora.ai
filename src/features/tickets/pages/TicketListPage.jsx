// src/features/tickets/pages/TicketListPage.jsx

import React, { useState } from "react";
import AppLayout from "src/shared/components/layout/AppLayout";
import Button from "src/shared/components/ui/Button";
import TicketRow from "../components/TicketRow"; // Importamos el nuevo componente
import Modal from "src/shared/components/ui/Modal";
import Input from "src/shared/components/ui/Input";
import FileUpload from "src/shared/components/ui/FileUpload";
import { mockTickets } from "@/data/mockTickets";

const TicketListPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [files, setFiles] = useState([]);

  // ... (lógica del modal sin cambios)
  const handleCreateTicket = (e) => {
    e.preventDefault();
    console.log("Creando ticket desde el modal...");
    console.log("Archivos adjuntos:", files);
    setFiles([]);
    setIsModalOpen(false);
  };

  const openModal = () => {
    setFiles([]);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">
          Bandeja de Entrada
        </h1>
        <Button variant="secondary" className="w-auto" onClick={openModal}>
          Crear Ticket
        </Button>
      </div>

      <div className="bg-primary border border-secondary rounded-lg overflow-hidden">
        <table className="w-full">
          {/* ... (thead sin cambios) */}
          <tbody>
            {mockTickets.map((ticket) => {
              const latestMessage = ticket.mensajes?.[0];
              const aiConfidence = latestMessage?.confianzaIA;
              const suggestedTags = ticket.etiquetas.map(
                (etiqueta) => etiqueta.nombre
              );

              return (
                <TicketRow
                  key={ticket.id}
                  id={ticket.id} // <-- PASAMOS EL ID PARA LA NAVEGACIÓN
                  subject={ticket.asunto}
                  status={ticket.estado}
                  aiConfidence={aiConfidence}
                  tags={suggestedTags}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      {/* --- MODAL (sin cambios en su estructura interna) --- */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crear Nuevo Ticket Manualmente"
      >
        {/* ... (el formulario del modal permanece igual) */}
        <form onSubmit={handleCreateTicket} className="space-y-4">
          <Input
            id="clientEmail"
            label="Correo del Cliente"
            type="email"
            placeholder="Ingresa el correo del cliente"
            required
          />
          <Input
            id="subject"
            label="Asunto"
            placeholder="Ingresa el asunto"
            required
          />
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-subtle mb-2"
            >
              Mensaje Inicial
            </label>
            <textarea
              id="message"
              rows={4}
              className="w-full p-3 bg-background border border-secondary rounded-md"
              required
            />
          </div>
          <FileUpload
            label="Adjuntar Archivos (Opcional)"
            onFilesSelect={(selectedFiles) => setFiles(selectedFiles)}
          />
          <div className="flex justify-end gap-4 mt-6">
            <Button
              type="button"
              variant="secondary"
              className="w-auto"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" className="w-auto">
              Crear
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TicketListPage;
