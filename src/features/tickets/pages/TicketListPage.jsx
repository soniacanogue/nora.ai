import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTickets } from "../hooks/useTickets";
import { useClaimTicket } from "../hooks/useClaimTicket"; // Nuevo
import { useAuth } from "@/shared/hooks/useAuth"; // Para obtener el agente actual
import { FaArrowUp, FaArrowDown } from "react-icons/fa"; // Iconos para ordenamiento
import Button from "@/shared/components/ui/Button";
import Modal from "@/shared/components/ui/Modal";
import Input from "@/shared/components/ui/Input";
import FileUpload from "@/shared/components/ui/FileUpload";
import { mockUsuarios } from "@/data/mockUsuarios";

const TicketListPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    clientEmail: "",
    subject: "",
    message: "",
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // -- State para ordenamiento --
  const [sortConfig, setSortConfig] = useState({
    key: "prioridad",
    order: "desc",
  });

  // -- Filtros desde la URL --
  const statusFilter = searchParams.get("status");
  const assigneeFilter = searchParams.get("assignee");

  // -- Hook de datos con filtros y ordenamiento --
  const {
    data: tickets,
    isLoading,
    isError,
    error,
  } = useTickets(
    { status: statusFilter, assigneeId: assigneeFilter },
    sortConfig,
  );

  const { mutate: claim, isLoading: isClaiming } = useClaimTicket();

  const handleSort = (key) => {
    let order = "asc";
    if (sortConfig.key === key && sortConfig.order === "asc") {
      order = "desc";
    }
    setSortConfig({ key, order });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.order === "asc" ? (
      <FaArrowUp className="inline ml-1" />
    ) : (
      <FaArrowDown className="inline ml-1" />
    );
  };

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

  if (isLoading) {
    return <div>Cargando tickets...</div>; // Usar un Skeleton aquí
  }

  if (isError) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">
          Tickets de Nivel 2
        </h1>
        <Button variant="secondary" className="w-auto" onClick={openModal}>
          Crear Ticket
        </Button>
      </div>

      <div className="bg-primary border border-secondary rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-secondary">
            <tr>
              <th
                className="p-4 text-left cursor-pointer"
                onClick={() => handleSort("prioridad")}
              >
                Prioridad {getSortIcon("prioridad")}
              </th>
              <th className="p-4 text-left">Asunto</th>
              <th className="p-4 text-left">Cliente</th>
              <th
                className="p-4 text-left cursor-pointer"
                onClick={() => handleSort("assigneeId")}
              >
                Agente Asignado {getSortIcon("assigneeId")}
              </th>
              <th
                className="p-4 text-left cursor-pointer"
                onClick={() => handleSort("creadoEn")}
              >
                Última Actualización {getSortIcon("creadoEn")}
              </th>
              <th className="p-4 text-left">Acción</th>
            </tr>
          </thead>
          <tbody>
            {tickets?.map((ticket) => (
              <tr
                key={ticket.id}
                className="border-b border-secondary hover:bg-white/5 transition-colors"
              >
                <td className="p-4">
                  {/* Icono de prioridad */} {ticket.prioridad}
                </td>
                <td
                  className="p-4 text-foreground hover:underline cursor-pointer"
                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                >
                  {ticket.asunto}
                </td>
                <td className="p-4 text-subtle">{ticket.cliente?.nombre || ""}</td>
                <td className="p-4 text-subtle">
                  {ticket.assigneeId
                    ? mockUsuarios.find((u) => u.id === ticket.assigneeId)
                        ?.nombre || "Usuario no encontrado"
                    : "Sin Asignar"}
                </td>
                <td className="p-4 text-subtle">
                  {new Date(ticket.creadoEn).toLocaleDateString()}
                </td>
                <td className="p-4">
                  {!ticket.assigneeId && (
                    <Button
                      variant="primary"
                      className="w-auto text-xs py-1 px-2"
                      onClick={() =>
                        claim({ ticketId: ticket.id, agentId: currentUser?.id })
                      }
                      disabled={isClaiming}
                    >
                      Tomar
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
            value={formData.clientEmail}
            onChange={(e) =>
              setFormData({ ...formData, clientEmail: e.target.value })
            }
            required
          />
          <Input
            id="subject"
            label="Asunto"
            placeholder="Ingresa el asunto"
            value={formData.subject}
            onChange={(e) =>
              setFormData({ ...formData, subject: e.target.value })
            }
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
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
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
            <Button
              type="submit"
              variant="primary"
              className="w-auto"
              onClick={handleCreateTicket}
            >
              Crear
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TicketListPage;
