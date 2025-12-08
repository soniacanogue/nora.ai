import React, { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTickets } from "../hooks/useTickets";
import { useClaimTicket } from "../hooks/useClaimTicket"; // Nuevo
import { useAuth } from "@/shared/hooks/useAuth"; // Para obtener el agente actual
import { useDynamicSearch } from "@/shared/hooks/useDynamicSearch";
import Button from "@/shared/components/ui/Button";
import DynamicFormModal from "@/shared/components/ui/DynamicFormModal";
import ExportModal from "../components/ExportModal";
import DynamicTable from "@/shared/components/ui/DynamicTable";
import DynamicSearch from "@/shared/components/ui/DynamicSearch";
import { createTicket } from "../api/ticketsApi";
import toast from "react-hot-toast";

const TicketListPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
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
  const estadoFilter = searchParams.get("estado");
  const assigneeFilter = searchParams.get("assignee");
  const pageParam = Number(searchParams.get("page") || 1);
  const limitParam = Number(searchParams.get("limit") || 25);

  // -- Hook de datos con filtros y ordenamiento --
  const {
    data: tickets,
    isLoading,
    isError,
    error,
  } = useTickets({
    estado: estadoFilter,
    assigneeId: assigneeFilter,
    page: pageParam,
    limit: limitParam,
  });

  // Note: previously we reset `page=1` when filters changed. That behavior
  // caused the page query param to be overwritten on page load (e.g. when
  // pasting a URL with `?page=2`). To avoid surprising navigation, the
  // automatic reset was removed. If you want to re-enable it, consider
  // triggering the reset from explicit filter UI interactions instead.

  // Configuración de búsqueda
  const searchConfig = useMemo(
    () => ({
      searchKeys: [
        "id",
        "asunto",
        "cliente.nombre",
        "cliente.correo",
        "prioridad",
        "estado",
      ],
    }),
    [],
  );

  // Hook de búsqueda dinámica
  const {
    searchTerm,
    setSearchTerm,
    filteredData: searchedTickets,
    suggestions: searchSuggestions,
  } = useDynamicSearch(tickets, searchConfig);

  const sortedTickets = useMemo(() => {
    if (!searchedTickets) return [];
    let result = [...searchedTickets];
    if (sortConfig.key) {
      result.sort((a, b) => {
        // Special case: prioridad needs a domain-specific order
        if (sortConfig.key === "prioridad") {
          const orderMap = {
            urgente: 4,
            alta: 3,
            mediana: 2,
            media: 2, // legacy value
            baja: 1,
          };
          const aRank = orderMap[(a.prioridad || "").toString().toLowerCase()] || 0;
          const bRank = orderMap[(b.prioridad || "").toString().toLowerCase()] || 0;
          if (aRank === bRank) {
            // fallback to string compare
            const aStr = (a.prioridad || "").toString();
            const bStr = (b.prioridad || "").toString();
            if (aStr < bStr) return sortConfig.order === "asc" ? -1 : 1;
            if (aStr > bStr) return sortConfig.order === "asc" ? 1 : -1;
            return 0;
          }
          return sortConfig.order === "asc" ? aRank - bRank : bRank - aRank;
        }

        // Special case: sort by agent name when ordering by assignee
        if (sortConfig.key === "assigneeId" || sortConfig.key === "assignee" || sortConfig.key === "usuarioAsignado") {
          const getAgentName = (t) => {
            return (
              (t.usuarioAsignado && t.usuarioAsignado.nombre) ||
              (t.assignee && t.assignee.nombre) ||
              t.assigneeId ||
              ""
            ).toString();
          };

          const aStr = getAgentName(a).toLowerCase();
          const bStr = getAgentName(b).toLowerCase();
          if (aStr === bStr) return 0;
          return sortConfig.order === "asc" ? (aStr < bStr ? -1 : 1) : (aStr > bStr ? -1 : 1);
        }

        // Special case: the 'Actualización' column uses 'modificadoEn' for display
        // but key is 'creadoEn' for historical reasons. Sort by modificadoEn when
        // the user sorts that column.
        if (sortConfig.key === "creadoEn") {
          const aTime = new Date(a.modificadoEn || a.creadoEn || 0).getTime();
          const bTime = new Date(b.modificadoEn || b.creadoEn || 0).getTime();
          if (aTime === bTime) return 0;
          return sortConfig.order === "asc" ? aTime - bTime : bTime - aTime;
        }

        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle nested properties or special cases
        if (sortConfig.key === "cliente") {
          aValue = a.cliente?.nombre || "";
          bValue = b.cliente?.nombre || "";
        }

        if (aValue < bValue) {
          return sortConfig.order === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.order === "asc" ? 1 : -1;
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

  const columns = useMemo(
    () => [
      {
        key: "prioridad",
        label: "Prioridad",
        sortable: true,
        className: "pl-6 font-mono text-xs relative",
        render: (ticket) => (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-dt-accent opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_rgba(138,43,226,0.8)]" />
            <span
              className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${
                // Mapeo de colores:
                // 'baja'    -> verde
                // 'mediana' -> amarillo
                // 'alta'    -> naranja
                // 'urgente' -> rojo
                ticket.prioridad === "baja"
                  ? "bg-green-500/10 text-green-500 border-transparent"
                  : (ticket.prioridad === "media")
                    ? "bg-yellow-500/10 text-yellow-500 border-transparent"
                    : ticket.prioridad === "alta"
                      ? "bg-orange-500/10 text-orange-500 border-transparent"
                      : ticket.prioridad === "urgente"
                        ? "bg-red-500/10 text-red-500 border-transparent"
                        : "bg-gray-500/10 text-gray-500 border-transparent"
              }`}
            >
              {ticket?.prioridad || "media"}
            </span>
          </>
        ),
      },
      {
        key: "asunto",
        label: "Asunto",
        sortable: true,
        className:
          "text-dt-foreground font-medium cursor-pointer group-hover:text-white transition-colors",
        render: (ticket) => (
          <div onClick={() => navigate(`/tickets/${ticket.id}`)}>
            {ticket?.asunto || "Sin asunto"}
            <div className="text-xs text-dt-subtle font-mono mt-0.5 opacity-50 group-hover:opacity-100 transition-opacity">
              ID: {ticket.id}
            </div>
          </div>
        ),
      },
      {
        key: "cliente",
        label: "Cliente",
        sortable: true,
        className: "text-dt-subtle",
        render: (ticket) => ticket?.cliente?.nombre || "Anónimo",
      },
      {
        key: "assigneeId",
        label: "Agente",
        sortable: true,
        className: "text-dt-subtle",
        render: (ticket) => {
          // Si el backend devuelve el objeto completo (futuro)
          if (ticket.usuarioAsignado && typeof ticket.usuarioAsignado === "object") {
            return ticket.usuarioAsignado?.nombre || "Agente";
          }
          // Si el backend devuelve solo el ID (actual, pero se va a arreglar)
          // O si el campo se llama diferente, intentamos mostrar algo sensato
          return (
            ticket.assigneeId || (
              <span className="text-dt-subtle/50 italic">Sin Asignar</span>
            )
          );
        },
      },
      {
        key: "creadoEn",
        label: "Actualización",
        sortable: true,
        className: "text-dt-subtle font-mono text-xs",
        render: (ticket) => new Date(ticket?.modificadoEn || ticket?.creadoEn || 0).toLocaleDateString(),
      },
      {
        key: "actions",
        label: "Acción",
        render: (ticket) =>
          !ticket.assigneeId && (
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
          ),
      },
    ],
    [isClaiming, currentUser, navigate, claim],
  );

  const formConfig = {
    fields: {
      emailCliente: {
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
            // Upload files if any were provided in the modal
            let archivosPayload = [];
            if (data.files && data.files.length > 0) {
              const uploads = await Promise.all(
                Array.from(data.files).map(async (f) => {
                  // Lazy import to avoid circular dependency in some bundlers
                  const { uploadAttachment } = await import("../api/ticketsApi");
                  const meta = await uploadAttachment(f);
                  const url = meta?.url || meta?.publicUrl || meta?.public_url || meta?.path || meta?.fileUrl || null;
                  const id = meta?.id || meta?.fileId || meta?.uploadId || null;
                  return {
                    nombreArchivo: f.name,
                    urlAlmacenamiento: url || null,
                    storageId: id,
                    tipoMime: f.type,
                    tamano: f.size,
                  };
                }),
              );
              archivosPayload = uploads;
            }

            const payload = {
              canal: "correo",
              prioridad: "media",
              asunto: data.subject,
              mensajeInicial: data.message,
              emailCliente: data.emailCliente,
              nombreCliente: "",
              ordenId: null,
              archivos: archivosPayload,
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
    if (estadoFilter === "ia_sugerido,nuevo") {
      return "Tickets para Triaje";
    } else if (estadoFilter === "reabierto") {
      return "Tickets Reabiertos";
    } else if (estadoFilter === "respuesta_cliente") {
      return "Respuestas de Clientes";
    } else if (estadoFilter?.includes("escalado_nivel_2")) {
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
            {/* Pagination controls removed here — using DynamicTable's built-in pagination */}
          <div className="flex gap-2">
            {currentUser?.rol === "ADMINISTRADOR" && (
              <Button variant="outline" size="md" onClick={() => setIsExportOpen(true)} className="whitespace-nowrap">
                Exportar CSV
              </Button>
            )}

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
      </div>

      <DynamicTable
        columns={columns}
        data={sortedTickets}
        sortConfig={sortConfig}
        onSort={handleSort}
        isLoading={isLoading}
        // Controlled pagination so table changes trigger server fetch via URL
        page={pageParam}
        itemsPerPage={limitParam}
        onPageChange={(newPage) => {
          const params = new URLSearchParams(searchParams);
          params.set("page", String(newPage));
          setSearchParams(params);
        }}
        onItemsPerPageChange={(newLimit) => {
          const params = new URLSearchParams(searchParams);
          params.set("limit", String(newLimit));
          // reset to page 1 when changing page size
          params.set("page", "1");
          setSearchParams(params);
        }}
        totalItems={tickets?.pagination?.total || tickets?.pagination?.totalItems || tickets?.pagination?.totalCount}
        totalPages={tickets?.pagination?.totalPages}
      />

      {/* List-level pagination removed — DynamicTable handles pagination UI now */}

      <DynamicFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crear Nuevo Ticket Manualmente"
        config={formConfig}
      />
      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  );
};

export default TicketListPage;
