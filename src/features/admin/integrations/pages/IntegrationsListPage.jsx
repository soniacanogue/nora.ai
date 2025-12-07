import React from 'react';
import { FiLink, FiPlus } from 'react-icons/fi';

// TODO: UC-18 - Integrations Management UI
// Backend endpoints are implemented:
// GET /integrations - List all integrations
// POST /integrations - Create new integration
// GET /integrations/:id - Get integration by ID
// PATCH /integrations/:id - Update integration
// DELETE /integrations/:id - Delete integration
//
// Missing backend endpoints (noted in analysis):
// - POST /integrations/:id/test - Test integration connection
// - GET /integrations/:id/logs - Get integration logs
//
// Required implementation:
// 1. List all integrations (Mailgun, OpenRouter, etc.)
// 2. Create/Edit integration form with encrypted API keys
// 3. Test integration connection before saving
// 4. Activate/Deactivate integrations
// 5. Delete integrations with confirmation
// 6. View integration logs and error history
// 7. Configure webhooks and endpoints

export const IntegrationsListPage = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FiLink className="text-2xl text-dt-accent" />
          <div>
            <h1 className="text-2xl font-bold text-dt-foreground">Gestión de Integraciones</h1>
            <p className="text-sm text-dt-subtle">
              Configura conexiones con servicios externos
            </p>
          </div>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-dt-accent text-white rounded-lg hover:bg-dt-accent-hover transition-colors"
        >
          <FiPlus />
          Nueva Integración
        </button>
      </div>

      {/* Placeholder Content */}
      <div className="bg-dt-card border border-dt-border rounded-lg p-12 text-center">
        <FiLink className="text-6xl text-dt-subtle mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-dt-foreground mb-2">
          Página de Gestión de Integraciones
        </h3>
        <p className="text-dt-subtle mb-4">
          Esta página permitirá configurar integraciones con servicios externos como Mailgun, OpenRouter, etc.
        </p>
        <div className="bg-dt-background border border-dt-border rounded-lg p-4 text-left max-w-2xl mx-auto">
          <p className="text-sm text-dt-foreground font-semibold mb-2">TODO: Implementar</p>
          <ul className="text-xs text-dt-subtle space-y-1 list-disc list-inside">
            <li>Listar todas las integraciones con estado activo/inactivo</li>
            <li>Crear nueva integración con configuración de API keys</li>
            <li>Editar configuración de integraciones existentes</li>
            <li>Probar conexión antes de guardar</li>
            <li>Activar/Desactivar integraciones</li>
            <li>Ver logs de llamadas a servicios externos</li>
            <li>Configurar webhooks y endpoints</li>
            <li>Mostrar estado de salud de cada integración</li>
          </ul>
          <p className="text-xs text-yellow-400 mt-3 font-mono">
            ⚠️ Nota: Faltan endpoints de backend para test y logs de integraciones
          </p>
          <div className="mt-3 pt-3 border-t border-dt-border">
            <p className="text-xs text-dt-foreground font-semibold mb-1">Integraciones clave:</p>
            <ul className="text-xs text-dt-subtle list-disc list-inside">
              <li>Mailgun - Envío y recepción de correos</li>
              <li>OpenRouter - API de IA para generación de respuestas</li>
              <li>Almacenamiento de archivos (S3/Azure/GCS)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
