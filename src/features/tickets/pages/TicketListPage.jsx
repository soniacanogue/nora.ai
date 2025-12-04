import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTickets } from "../hooks/useTickets";
import { useClaimTicket } from "../hooks/useClaimTicket"; // Nuevo
import { useAuth } from "@/shared/hooks/useAuth"; // Para obtener el agente actual
import { FaArrowUp, FaArrowDown } from "react-icons/fa"; // Iconos para ordenamiento
import Button from "@/shared/components/ui/Button";
import DynamicFormModal from "@/shared/components/ui/DynamicFormModal";
import { getUsers } from "@/features/auth/api/authApi";
import { createTicket } from "../api/ticketsApi";
import toast from "react-hot-toast";

const TicketListPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

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
    sortConfig
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

  const handleTicketCreated = () => {
    queryClient.invalidateQueries(["tickets"]);
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const formConfig = {
    fields: {
      clientEmail: {
        label: "Correo del Cliente",
        type: "email",
        placeholder: "Ingresa el correo del cliente",
        required: true,
      },
      subject: {
        label: "Asunto",
        placeholder: "Ingresa el asunto",
        required: true,
      },
      message: {
        label: "Mensaje Inicial",
        type: "textarea",
        placeholder: "Escribe el mensaje...",
        required: true,
        rows: 4,
      },
      files: {
        label: "Adjuntar Archivos (Opcional)",
        type: "file",
      },
    },
    buttons: {
      cancel: {
        label: "Cancelar",
        variant: "secondary",
        onClick: () => setIsModalOpen(false),
      },
      submit: {
        label: "Crear",
        variant: "primary",
        onClick: async (data) => {
          try {
            const payload = {
              canal: "correo",
              prioridad: "media",
              asunto: data.subject,
              mensajeInicial: data.message,
              correoCliente: data.clientEmail,
              nombreCliente: "",
              ordenId: null,
              archivos: (data.files || []).map((f) => ({
                nombreArchivo: f.name,
                urlAlmacenamiento: "",
                tipoMime: f.type,
                tamano: f.size,
              })),
            };
            await createTicket(payload);
            toast.success("Ticket creado exitosamente");
            handleTicketCreated();
          } catch (error) {
            console.error("Error creating ticket:", error);
            toast.error("Error al crear el ticket");
          }
        },
      },
    },
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
        <h1 className="text-3xl font-bold text-dt-foreground">
          Tickets de Nivel 2
        </h1>
        <Button
          variant="secondary"
          size="md"
          fullWidth={false}
          onClick={openModal}
        >
          Crear Ticket
        </Button>
      </div>

      <div className="bg-dt-primary border border-secondary rounded-lg overflow-hidden">
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
                  className="p-4 text-dt-foreground hover:underline cursor-pointer"
                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                >
                  {ticket.asunto}
                </td>
                <td className="p-4 text-dt-subtle">
                  {ticket.cliente?.nombre || ""}
                </td>
                <td className="p-4 text-dt-subtle">
                  {ticket.assigneeId
                    ? users?.find((u) => u.id === ticket.assigneeId)
                        ?.nombre || "Usuario no encontrado"
                    : "Sin Asignar"}
                </td>
                <td className="p-4 text-dt-subtle">
                  {new Date(ticket.creadoEn).toLocaleDateString()}
                </td>
                <td className="p-4">
                  {!ticket.assigneeId && (
                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth={false}
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

      <DynamicFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crear Nuevo Ticket Manualmente"
        config={formConfig}
      />
    </div>
  );
};

export default TicketListPage;
