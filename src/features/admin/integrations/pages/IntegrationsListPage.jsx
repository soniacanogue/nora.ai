import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FiLink,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiToggleLeft,
  FiToggleRight,
  FiCheckCircle,
  FiAlertCircle,
  FiSearch,
  FiPlay,
  FiList,
  FiActivity,
  FiClock,
  FiFilter,
} from "react-icons/fi";
import toast from "react-hot-toast";
import {
  useIntegrations,
  useCreateIntegration,
  useUpdateIntegration,
  useDeleteIntegration,
  useTestIntegration,
  useIntegrationLogs,
} from "../hooks";
import DynamicFormModal from "@/shared/components/ui/DynamicFormModal";
import DynamicTable from "@/shared/components/ui/DynamicTable";
import Button from "@/shared/components/ui/Button";
import EmptyState from "@/shared/components/ui/EmptyState";
import ErrorState from "@/shared/components/ui/ErrorState";
import Badge from "@/shared/components/ui/Badge";
import Modal from "@/shared/components/ui/Modal";
import PageHeader from "@/shared/components/layout/PageHeader";
import FilterPanel from "@/shared/components/ui/FilterPanel";
import { formatDistanceToNow } from "@/shared/utils/formatters";

const LOGS_PAGE_SIZE = 25;

const IntegrationLogsModal = ({ integration, onClose }) => {
  const [page, setPage] = useState(1);
  const queryParams = useMemo(
    () => ({ page, limit: LOGS_PAGE_SIZE }),
    [page]
  );

  useEffect(() => {
    if (integration?.id) {
      setPage(1);
    }
  }, [integration?.id]);

  const {
    data,
    isLoading,
    error,
    isFetching,
  } = useIntegrationLogs(integration?.id, queryParams);

  if (!integration) return null;

  const logs = data?.data || data?.logs || [];
  const pagination = data?.pagination || {};
  const total = pagination.total ?? logs.length;
  const currentPage = pagination.page ?? page;
  const pageSize = pagination.limit ?? LOGS_PAGE_SIZE;
  const totalPages = total
    ? Math.max(1, Math.ceil(total / Math.max(pageSize, 1)))
    : 1;
  const rangeStart = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = total === 0 ? 0 : Math.min(total, rangeStart + logs.length - 1);

  const handlePrev = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <Modal
      isOpen={!!integration}
      onClose={onClose}
      title={`Logs de ${integration.nombre}`}
    >
      {isLoading && <p className="text-sm text-dt-subtle">Cargando logs...</p>}
      {error && (
        <p className="text-sm text-red-400">
          {error.message || "No fue posible obtener los logs"}
        </p>
      )}
      {!isLoading && !error && logs.length === 0 && (
        <p className="text-sm text-dt-subtle">
          No hay registros disponibles para esta integración.
        </p>
      )}
      {!isLoading && !error && logs.length > 0 && (
        <>
          <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
            {logs.map((log, index) => (
              <div
                key={log.id || index}
                className="bg-dt-card border border-dt-border rounded-lg p-3"
              >
                <div className="flex items-center justify-between text-xs text-dt-subtle mb-2">
                  <span className="flex items-center gap-1">
                    <FiClock />
                    {log.timestamp
                      ? formatDistanceToNow(new Date(log.timestamp))
                      : "Sin marca"}
                  </span>
                  <Badge variant={log.level === "error" ? "danger" : "info"}>
                    {log.level?.toUpperCase() || "INFO"}
                  </Badge>
                </div>
                <p className="text-sm text-dt-foreground font-medium">
                  {log.message || log.descripcion || "Evento registrado"}
                </p>
                {log.meta && (
                  <pre className="mt-2 text-[11px] text-dt-subtle bg-black/30 rounded p-2 overflow-x-auto">
                    {JSON.stringify(log.meta, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 text-xs text-dt-subtle">
            <span>
              Mostrando {rangeStart}-{rangeEnd} de {total || logs.length} eventos
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                fullWidth={false}
                onClick={handlePrev}
                disabled={currentPage <= 1 || isLoading || isFetching}
              >
                Anterior
              </Button>
              <Button
                variant="ghost"
                size="sm"
                fullWidth={false}
                onClick={handleNext}
                disabled={currentPage >= totalPages || isLoading || isFetching}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};

/**
 * UC-18: Integrations Management Page
 * Full CRUD implementation for managing external service integrations
 */
export const IntegrationsListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIntegrationForLogs, setSelectedIntegrationForLogs] =
    useState(null);
  const [integrationCapabilities, setIntegrationCapabilities] = useState({
    canTest: true,
    canViewLogs: true,
  });

  const pageParam = Number(searchParams.get("page") || 1);
  const limitParam = Number(searchParams.get("limit") || 25);
  const sortBy = searchParams.get("sortBy") || "nombre";
  const sortOrder = searchParams.get("sortOrder") || "asc";

  const sortConfig = { key: sortBy, order: sortOrder };

  const { data: integrations = [], isLoading, error } = useIntegrations({
    page: pageParam,
    limit: limitParam,
    sortBy,
    sortOrder,
  });
  const createIntegrationMutation = useCreateIntegration();
  const updateIntegrationMutation = useUpdateIntegration();
  const deleteIntegrationMutation = useDeleteIntegration();
  const testIntegrationMutation = useTestIntegration();

  const handleSort = (key) => {
    const newOrder = sortBy === key && sortOrder === "asc" ? "desc" : "asc";
    const params = new URLSearchParams(searchParams);
    params.set("sortBy", key);
    params.set("sortOrder", newOrder);
    setSearchParams(params);
  };

  const filterConfig = useMemo(() => [], []);

  const handleFilterChange = (key, value) => {
    // Ready for future filters
  };

  const handleCapabilityUnavailable = (capabilityKey, message) => {
    let shouldAnnounce = false;
    setIntegrationCapabilities((prev) => {
      if (!prev[capabilityKey]) return prev;
      shouldAnnounce = true;
      return { ...prev, [capabilityKey]: false };
    });
    if (shouldAnnounce) {
      toast.error(message);
    }
  };

  const getHealthSnapshot = (integration) => ({
    status:
      integration.health?.status ||
      (integration.activo ? "HEALTHY" : "INACTIVE"),
    lastCheck:
      integration.health?.lastCheck || integration.updatedAt || integration.createdAt,
    uptime: integration.health?.uptime ?? integration.uptime ?? null,
    latencyMs:
      integration.health?.latencyMs ?? integration.latencyMs ?? null,
    errors24h:
      integration.health?.errors24h ?? integration.errores24h ?? 0,
  });

  const getHealthVariant = (status) => {
    switch (status) {
      case "HEALTHY":
        return "success";
      case "DEGRADED":
        return "warning";
      case "DOWN":
        return "danger";
      default:
        return "neutral";
    }
  };

  const getHealthLabel = (status) => {
    switch (status) {
      case "HEALTHY":
        return "Operativa";
      case "DEGRADED":
        return "Degradada";
      case "DOWN":
        return "Caída";
      case "INACTIVE":
        return "Inactiva";
      default:
        return status || "Sin estado";
    }
  };

  // Filter integrations by search term
  const filteredIntegrations = useMemo(() => {
    if (!searchTerm) return integrations;
    const search = searchTerm.toLowerCase();
    return integrations.filter(
      (integration) =>
        integration.nombre.toLowerCase().includes(search) ||
        (integration.endpoint &&
          integration.endpoint.toLowerCase().includes(search))
    );
  }, [integrations, searchTerm]);

  const handleCreate = (formData) => {
    createIntegrationMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Integración creada exitosamente");
        setIsCreateModalOpen(false);
      },
      onError: (err) => {
        toast.error(err.message || "Error al crear integración");
      },
    });
  };

  const handleUpdate = (formData) => {
    updateIntegrationMutation.mutate(
      { id: editingIntegration.id, data: formData },
      {
        onSuccess: () => {
          toast.success("Integración actualizada exitosamente");
          setEditingIntegration(null);
        },
        onError: (err) => {
          toast.error(err.message || "Error al actualizar integración");
        },
      }
    );
  };

  const handleDelete = (integration) => {
    if (
      window.confirm(
        `¿Estás seguro de que quieres eliminar la integración "${integration.nombre}"?`
      )
    ) {
      deleteIntegrationMutation.mutate(integration.id, {
        onSuccess: () => {
          toast.success("Integración eliminada");
        },
        onError: (err) => {
          toast.error(err.message || "Error al eliminar integración");
        },
      });
    }
  };

  const handleToggleActive = (integration) => {
    updateIntegrationMutation.mutate(
      {
        id: integration.id,
        data: { activo: !integration.activo },
      },
      {
        onSuccess: () => {
          toast.success(
            integration.activo
              ? "Integración desactivada"
              : "Integración activada"
          );
        },
        onError: (err) => {
          toast.error(err.message || "Error al cambiar estado");
        },
      }
    );
  };

  const handleTest = (integration) => {
    if (!integrationCapabilities.canTest) {
      toast.error("El backend aún no habilita la prueba de integraciones.");
      return;
    }
    const toastId = `test-integration-${integration.id}`;
    toast.loading("Probando conexión...", { id: toastId });
    testIntegrationMutation.mutate(integration.id, {
      onSuccess: () => {
        toast.success("Conexión exitosa", { id: toastId });
      },
      onError: (err) => {
        const message = err.message || "Error en la conexión";
        toast.error(message, { id: toastId });
        if (message.toLowerCase().includes("no disponible")) {
          handleCapabilityUnavailable(
            "canTest",
            "El backend aún no habilita la prueba de integraciones."
          );
        }
      },
    });
  };

  const handleViewLogs = (integration) => {
    if (!integrationCapabilities.canViewLogs) {
      toast.error("Los logs de integraciones aún no están disponibles.");
      return;
    }
    setSelectedIntegrationForLogs(integration);
  };

  const columns = useMemo(() => [
    {
      key: "nombre",
      label: "Nombre",
      sortable: true,
      className: "text-dt-foreground font-medium",
      render: (integration) => integration.nombre || "—",
    },
    {
      key: "endpoint",
      label: "Endpoint",
      sortable: true,
      className: "text-dt-subtle text-sm",
      render: (integration) => (
        <div className="truncate max-w-xs" title={integration.endpoint}>
          {integration.endpoint || "—"}
        </div>
      ),
    },
    {
      key: "activo",
      label: "Estado",
      sortable: true,
      render: (integration) => (
        <Badge variant={integration.activo ? "success" : "neutral"} icon={integration.activo ? FiCheckCircle : FiAlertCircle}>
          {integration.activo ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
    {
      key: "health",
      label: "Salud",
      render: (integration) => {
        const health = getHealthSnapshot(integration);
        return (
          <Badge variant={getHealthVariant(health.status)} icon={FiActivity}>
            {getHealthLabel(health.status)}
          </Badge>
        );
      },
    },
    {
      key: "creadoEn",
      label: "Creado",
      sortable: true,
      className: "text-dt-subtle font-mono text-xs",
      render: (integration) => new Date(integration?.creadoEn || integration?.createdAt || 0).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Acciones",
      headerClassName: "text-right",
      className: "text-right",
      render: (integration) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => handleToggleActive(integration)}
            className="p-2 text-dt-subtle hover:text-dt-accent transition-colors"
            title={integration.activo ? "Desactivar" : "Activar"}
          >
            {integration.activo ? <FiToggleRight size={20} className="text-green-500" /> : <FiToggleLeft size={20} />}
          </button>
          <button
            onClick={() => setEditingIntegration(integration)}
            className="p-2 text-dt-subtle hover:text-dt-accent transition-colors"
            title="Editar"
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={() => handleDelete(integration)}
            className="p-2 text-dt-subtle hover:text-red-500 transition-colors"
            title="Eliminar"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      ),
    },
  ], [getHealthSnapshot, getHealthVariant, getHealthLabel, handleToggleActive, handleDelete]);

  const integrationFormConfig = {
    fields: {
      nombre: {
        label: "Nombre de la Integración",
        placeholder: "Ej: Mailgun, OpenRouter, AWS S3",
        required: true,
      },
      claveApiEnc: {
        label: "API Key / Credencial",
        type: "password",
        placeholder: "sk_live_xxxxxxxxxxxx",
        required: true,
      },
      endpoint: {
        label: "Endpoint URL (opcional)",
        placeholder: "https://api.example.com/v1",
      },
      urlWebhook: {
        label: "Webhook URL (opcional)",
        placeholder: "https://tu-app.com/webhook",
      },
      activo: {
        label: "Activo",
        type: "checkbox",
      },
    },
    buttons: {
      cancel: {
        label: "Cancelar",
        variant: "secondary",
        onClick: () => {
          setIsCreateModalOpen(false);
          setEditingIntegration(null);
        },
      },
      submit: {
        label: editingIntegration
          ? "Actualizar Integración"
          : "Crear Integración",
        variant: "primary",
        onClick: editingIntegration ? handleUpdate : handleCreate,
      },
    },
  };

  if (error) {
    return (
      <div className="p-6">
        <ErrorState
          message="Error al cargar las integraciones"
          details={error.message}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <PageHeader
        icon={FiLink}
        title="Gestión de Integraciones"
        description="Configura conexiones con servicios externos"
      >
        <div className="flex gap-2">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="secondary"
            icon={FiFilter}
          >
            Filtros
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)} variant="primary" icon={FiPlus}>
            Nueva Integración
          </Button>
        </div>
      </PageHeader>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dt-subtle" />
          <input
            type="text"
            placeholder="Buscar integraciones por nombre o endpoint..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Advanced Filters */}
        <FilterPanel
          open={showFilters}
          config={filterConfig}
          values={{}}
          onChange={handleFilterChange}
        />
      </div>

      {/* Integrations Table */}
      <DynamicTable
        columns={columns}
        data={filteredIntegrations}
        sortConfig={sortConfig}
        onSort={handleSort}
        isLoading={isLoading}
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
          params.set("page", "1");
          setSearchParams(params);
        }}
        emptyState={
          <EmptyState
            icon={FiLink}
            title="No hay integraciones"
            description={
              searchTerm
                ? "No se encontraron integraciones con los filtros aplicados"
                : "Crea tu primera integración para comenzar"
            }
            action={!searchTerm ? { label: "Nueva Integración", onClick: () => setIsCreateModalOpen(true) } : undefined}
          />
        }
      />

      {/* Create Modal */}
      {isCreateModalOpen && (
        <DynamicFormModal
          title="Crear Nueva Integración"
          description="Configura una nueva conexión con un servicio externo"
          config={integrationFormConfig}
          onClose={() => setIsCreateModalOpen(false)}
          isLoading={createIntegrationMutation.isPending}
        />
      )}

      {/* Edit Modal */}
      {editingIntegration && (
        <DynamicFormModal
          title="Editar Integración"
          description="Modifica la configuración de la integración"
          config={integrationFormConfig}
          defaultValues={{
            ...editingIntegration,
            claveApiEnc: "", // Don't show existing API key for security
          }}
          onClose={() => setEditingIntegration(null)}
          isLoading={updateIntegrationMutation.isPending}
        />
      )}

      {selectedIntegrationForLogs && (
        <IntegrationLogsModal
          integration={selectedIntegrationForLogs}
          onClose={() => setSelectedIntegrationForLogs(null)}
        />
      )}
    </div>
  );
};
