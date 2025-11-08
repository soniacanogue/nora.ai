// src/features/tickets/pages/TicketListPage.jsx

import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();

  // Extract filter parameters from URL
  const statusFilter = searchParams.get("status");
  const assigneeFilter = searchParams.get("assignee");

  // Filter and sort tickets based on URL parameters
  const filteredAndSortedTickets = useMemo(() => {
    let tickets = [...mockTickets];

    // Filter by status
    if (statusFilter) {
      const statuses = statusFilter.split(",");
      tickets = tickets.filter((ticket) => statuses.includes(ticket.estado));
    }

    // Filter by assignee (if "me", would need current user context)
    if (assigneeFilter && assigneeFilter !== "me") {
      tickets = tickets.filter((ticket) => ticket.assigneeId === assigneeFilter);
    }

    // Sort by AI confidence if viewing triage queue
    if (statusFilter && statusFilter.includes("ia_sugerido")) {
      tickets.sort((a, b) => {
        const aConfidence = a.mensajes?.[0]?.confianzaIA || 0;
        const bConfidence = b.mensajes?.[0]?.confianzaIA || 0;
        return bConfidence - aConfidence; // Sort descending by confidence
      });
    }

    return tickets;
  }, [statusFilter, assigneeFilter]);

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

  // Determine page title based on filters
  const getPageTitle = () => {
    if (statusFilter === "ia_sugerido,nuevo") {
      return "Tickets para Triaje";
    } else if (statusFilter === "reabierto") {
      return "Tickets Reabiertos";
    } else if (statusFilter === "respuesta_cliente") {
      return "Respuestas de Clientes";
    } else if (statusFilter?.includes("escalado_nivel_2")) {
      return "Tickets Escalados (Nivel 2)";
    }
    return "Bandeja de Entrada";
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">
          {getPageTitle()}
        </h1>
        <Button variant="secondary" className="w-auto" onClick={openModal}>
          Crear Ticket
        </Button>
      </div>

      {filteredAndSortedTickets.length === 0 ? (
        <div className="bg-primary border border-secondary rounded-lg p-8 text-center">
          <p className="text-subtle">No hay tickets que coincidan con los filtros seleccionados.</p>
        </div>
      ) : (
        <div className="bg-primary border border-secondary rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-secondary">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-subtle">
                  Asunto
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-subtle">
                  Estado
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-subtle">
                  Confianza IA
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-subtle">
                  Etiquetas
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedTickets.map((ticket) => {
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
      )}

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
