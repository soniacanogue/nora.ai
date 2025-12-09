import React, { useState, useMemo, useEffect } from "react";
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
import Button from "@/shared/components/ui/Button";
import EmptyState from "@/shared/components/ui/EmptyState";
import ErrorState from "@/shared/components/ui/ErrorState";
import Badge from "@/shared/components/ui/Badge";
import Modal from "@/shared/components/ui/Modal";
import SearchInput from "@/shared/components/ui/SearchInput";
import PageHeader from "@/shared/components/layout/PageHeader";
import SkeletonList from "@/shared/components/ui/SkeletonList";
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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIntegrationForLogs, setSelectedIntegrationForLogs] =
    useState(null);
  const [integrationCapabilities, setIntegrationCapabilities] = useState({
    canTest: true,
    canViewLogs: true,
  });

  const { data: integrations = [], isLoading, error } = useIntegrations();
  const createIntegrationMutation = useCreateIntegration();
  const updateIntegrationMutation = useUpdateIntegration();
  const deleteIntegrationMutation = useDeleteIntegration();
  const testIntegrationMutation = useTestIntegration();

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
        action={{ label: "Nueva Integración", onClick: () => setIsCreateModalOpen(true), icon: FiPlus }}
      />

      {/* Info Banner */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <FiAlertCircle className="text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-dt-foreground font-semibold mb-1">
              Integraciones Clave del Sistema
            </p>
            <ul className="text-dt-subtle space-y-1 text-xs">
              <li>• Mailgun - Envío y recepción de correos electrónicos</li>
              <li>• OpenRouter - API de IA para generación de respuestas</li>
              <li>
                • Almacenamiento - S3/Azure/GCS para archivos adjuntos
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <SearchInput
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar integraciones..."
      />

      {/* Integrations List */}
      {isLoading ? (
        <SkeletonList count={3} className="space-y-4" />
      ) : filteredIntegrations.length === 0 ? (
        <EmptyState
          icon={FiLink}
          title="No hay integraciones"
          description={
            searchTerm
              ? "No se encontraron integraciones con ese criterio de búsqueda"
              : "Crea tu primera integración para comenzar"
          }
          action={
            !searchTerm && {
              label: "Crear Integración",
              onClick: () => setIsCreateModalOpen(true),
            }
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredIntegrations.map((integration) => {
            const health = getHealthSnapshot(integration);
            const healthVariant = getHealthVariant(health.status);
            const lastCheckLabel = health.lastCheck
              ? formatDistanceToNow(new Date(health.lastCheck))
              : "Sin verificación";

            return (
              <div
                key={integration.id}
                className="bg-dt-card border border-dt-border rounded-lg p-6 hover:border-dt-accent/50 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-dt-foreground">
                        {integration.nombre}
                      </h3>
                      <Badge variant={integration.activo ? "success" : "neutral"}>
                        {integration.activo ? "Activo" : "Inactivo"}
                      </Badge>
                      <Badge variant={healthVariant}>
                        <span className="flex items-center gap-1">
                          <FiActivity /> {getHealthLabel(health.status)}
                        </span>
                      </Badge>
                    </div>
                    {integration.endpoint && (
                      <p className="text-sm text-dt-subtle mb-1">
                        <span className="font-medium">Endpoint:</span>{" "}
                        {integration.endpoint}
                      </p>
                    )}
                    {integration.urlWebhook && (
                      <p className="text-sm text-dt-subtle">
                        <span className="font-medium">Webhook:</span>{" "}
                        {integration.urlWebhook}
                      </p>
                    )}
                    <p className="text-xs text-dt-subtle mt-2 flex items-center gap-1">
                      <FiClock /> Última verificación: {lastCheckLabel}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleToggleActive(integration)}
                      className="p-2 text-dt-subtle hover:text-dt-accent transition-colors"
                      title={
                        integration.activo ? "Desactivar" : "Activar"
                      }
                    >
                      {integration.activo ? (
                        <FiToggleRight size={20} className="text-green-500" />
                      ) : (
                        <FiToggleLeft size={20} />
                      )}
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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <div className="bg-dt-background border border-dt-border rounded-lg p-3">
                    <p className="text-xs text-dt-subtle uppercase tracking-wide">
                      Uptime
                    </p>
                    <p className="text-xl font-semibold text-dt-foreground">
                      {health.uptime != null ? `${health.uptime}%` : "N/D"}
                    </p>
                  </div>
                  <div className="bg-dt-background border border-dt-border rounded-lg p-3">
                    <p className="text-xs text-dt-subtle uppercase tracking-wide">
                      Latencia promedio
                    </p>
                    <p className="text-xl font-semibold text-dt-foreground">
                      {health.latencyMs != null
                        ? `${health.latencyMs} ms`
                        : "N/D"}
                    </p>
                  </div>
                  <div className="bg-dt-background border border-dt-border rounded-lg p-3">
                    <p className="text-xs text-dt-subtle uppercase tracking-wide">
                      Errores últimas 24h
                    </p>
                    <p className="text-xl font-semibold text-dt-foreground">
                      {health.errors24h}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    fullWidth={false}
                    onClick={() => handleTest(integration)}
                    isLoading={testIntegrationMutation.isPending}
                    disabled={!integrationCapabilities.canTest}
                  >
                    <span className="flex items-center gap-2">
                      <FiPlay /> Probar conexión
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth={false}
                    onClick={() => handleViewLogs(integration)}
                    disabled={!integrationCapabilities.canViewLogs}
                  >
                    <span className="flex items-center gap-2">
                      <FiList /> Ver logs
                    </span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
