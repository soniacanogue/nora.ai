import React, { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTickets } from "../hooks/useTickets";
import { useClaimTicket } from "../hooks/useClaimTicket"; // Nuevo
import { useAuth } from "@/shared/hooks/useAuth"; // Para obtener el agente actual
import { useDynamicSearch } from "@/shared/hooks/useDynamicSearch";
import Button from "@/shared/components/ui/Button";
import DynamicFormModal from "@/shared/components/ui/DynamicFormModal";
import DynamicTable from "@/shared/components/ui/DynamicTable";
import DynamicSearch from "@/shared/components/ui/DynamicSearch";
import { createTicket } from "../api/ticketsApi";
import toast from "react-hot-toast";

const TicketListPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

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
    { status: statusFilter, assigneeId: assigneeFilter }
  );

  // Configuración de búsqueda
  const searchConfig = useMemo(() => ({
    searchKeys: [
      "id",
      "asunto",
      "cliente.nombre",
      "cliente.correo",
      "prioridad",
      "estado"
    ]
  }), []);

  // Hook de búsqueda dinámica
  const { 
    searchTerm, 
    setSearchTerm, 
    filteredData: searchedTickets, 
    suggestions: searchSuggestions 
  } = useDynamicSearch(tickets, searchConfig);

  const sortedTickets = useMemo(() => {
    if (!searchedTickets) return [];
    let result = [...searchedTickets];
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle nested properties or special cases
        if (sortConfig.key === 'cliente') {
             aValue = a.cliente?.nombre || '';
             bValue = b.cliente?.nombre || '';
        }

        if (aValue < bValue) {
          return sortConfig.order === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.order === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return result;
  }, [searchedTickets, sortConfig]);

  const { mutate: claim, isLoading: isClaiming } = useClaimTicket();

  const handleSort = (key) => {
    let order = "asc";
    if (sortConfig.key === key && sortConfig.order === "asc") {
      order = "desc";
    }
    setSortConfig({ key, order });
  };

  const handleTicketCreated = () => {
    queryClient.invalidateQueries(["tickets"]);
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const columns = useMemo(() => [
    {
      key: "prioridad",
      label: "Prioridad",
      sortable: true,
      className: "pl-6 font-mono text-xs relative",
      render: (ticket) => (
        <>
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-dt-accent opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_rgba(138,43,226,0.8)]" />
          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${
            ticket.prioridad === 'baja' ? 'bg-dt-error/10 text-dt-error border-transparent' :
            ticket.prioridad === 'urgente' ? 'bg-red-500/10 text-red-500 border-transparent' : 
            ticket.prioridad === 'alta' ? 'bg-yellow-500/10 text-yellow-500 border-transparent' : 
            ticket.prioridad === 'media' ? 'bg-green-500/10 text-green-500 border-transparent' :
            'bg-gray-500/10 text-gray-500 border-transparent'
          }`}>
            {ticket.prioridad}
          </span>
        </>
      )
    },
    {
      key: "asunto",
      label: "Asunto",
      sortable: true,
      className: "text-dt-foreground font-medium cursor-pointer group-hover:text-white transition-colors",
      render: (ticket) => (
        <div onClick={() => navigate(`/tickets/${ticket.id}`)}>
          {ticket.asunto}
          <div className="text-xs text-dt-subtle font-mono mt-0.5 opacity-50 group-hover:opacity-100 transition-opacity">ID: {ticket.id}</div>
        </div>
      )
    },
    {
      key: "cliente",
      label: "Cliente",
      sortable: true,
      className: "text-dt-subtle",
      render: (ticket) => ticket.cliente?.nombre || "Anónimo"
    },
    {
      key: "assigneeId",
      label: "Agente",
      sortable: true,
      className: "text-dt-subtle",
      render: (ticket) => {
        // Si el backend devuelve el objeto completo (futuro)
        if (ticket.assignee && typeof ticket.assignee === 'object') {
          return ticket.assignee.nombre || "Agente";
        }
        // Si el backend devuelve solo el ID (actual, pero se va a arreglar)
        // O si el campo se llama diferente, intentamos mostrar algo sensato
        return ticket.assigneeId || <span className="text-dt-subtle/50 italic">Sin Asignar</span>;
      }
    },
    {
      key: "creadoEn",
      label: "Actualización",
      sortable: true,
      className: "text-dt-subtle font-mono text-xs",
      render: (ticket) => new Date(ticket.creadoEn).toLocaleDateString()
    },
    {
      key: "actions",
      label: "Acción",
      render: (ticket) => !ticket.assigneeId && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="primary"
            size="sm"
            fullWidth={false}
            onClick={() =>
              claim({ ticketId: ticket.id, agentId: currentUser?.id })
            }
            disabled={isClaiming}
            className="text-xs py-1 px-3 h-8"
          >
            Tomar
          </Button>
        </div>
      )
    }
  ], [isClaiming, currentUser, navigate, claim]);

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

  if (isError) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-dt-foreground flex-shrink-0">
          Tickets de Nivel 2
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="w-full md:w-64 lg:w-80">
              <DynamicSearch
                id="search-tickets"
                placeholder="Buscar tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                suggestions={searchSuggestions}
              />
            </div>
            <Button
              variant="secondary"
              size="md"
              fullWidth={false}
              onClick={openModal}
              className="whitespace-nowrap"
            >
              Crear Ticket
            </Button>
        </div>
      </div>

      <DynamicTable
        columns={columns}
        data={sortedTickets}
        sortConfig={sortConfig}
        onSort={handleSort}
        isLoading={isLoading}
      />

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
