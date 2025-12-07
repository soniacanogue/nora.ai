import React, { useState, useMemo } from "react";
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
} from "react-icons/fi";
import toast from "react-hot-toast";
import {
  useIntegrations,
  useCreateIntegration,
  useUpdateIntegration,
  useDeleteIntegration,
  useTestIntegration,
} from "../hooks";
import DynamicFormModal from "@/shared/components/ui/DynamicFormModal";
import Button from "@/shared/components/ui/Button";
import EmptyState from "@/shared/components/ui/EmptyState";
import ErrorState from "@/shared/components/ui/ErrorState";
import Badge from "@/shared/components/ui/Badge";

/**
 * UC-18: Integrations Management Page
 * Full CRUD implementation for managing external service integrations
 */
export const IntegrationsListPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: integrations = [], isLoading, error } = useIntegrations();
  const createIntegrationMutation = useCreateIntegration();
  const updateIntegrationMutation = useUpdateIntegration();
  const deleteIntegrationMutation = useDeleteIntegration();
  const testIntegrationMutation = useTestIntegration();

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

  const handleTest = async (integration) => {
    toast.loading("Probando conexión...", { id: "test-integration" });
    testIntegrationMutation.mutate(integration.id, {
      onSuccess: () => {
        toast.success("Conexión exitosa", { id: "test-integration" });
      },
      onError: (err) => {
        toast.error(err.message || "Error en la conexión", {
          id: "test-integration",
        });
      },
    });
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FiLink className="text-2xl text-dt-accent" />
          <div>
            <h1 className="text-2xl font-bold text-dt-foreground">
              Gestión de Integraciones
            </h1>
            <p className="text-sm text-dt-subtle">
              Configura conexiones con servicios externos
            </p>
          </div>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          variant="primary"
          icon={FiPlus}
        >
          Nueva Integración
        </Button>
      </div>

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
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dt-subtle" />
        <input
          type="text"
          placeholder="Buscar integraciones..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-dt-card border border-dt-border rounded-lg text-dt-foreground placeholder-dt-subtle focus:outline-none focus:ring-2 focus:ring-dt-accent"
        />
      </div>

      {/* Integrations List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-dt-card border border-dt-border rounded-lg p-6 animate-pulse"
            >
              <div className="h-5 bg-dt-border rounded w-1/4 mb-3"></div>
              <div className="h-4 bg-dt-border rounded w-1/2"></div>
            </div>
          ))}
        </div>
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
          {filteredIntegrations.map((integration) => (
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
                    <Badge
                      variant={integration.activo ? "success" : "neutral"}
                      icon={
                        integration.activo ? FiCheckCircle : FiAlertCircle
                      }
                    >
                      {integration.activo ? "Activo" : "Inactivo"}
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
            </div>
          ))}
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
    </div>
  );
};
