import React from "react";
import { FiFileText, FiSearch } from "react-icons/fi";

// TODO: UC-22 - Audit Logs UI
// Backend endpoint is implemented:
// GET /audit - List audit log events
//
// Required implementation:
// 1. List all audit log events with pagination
// 2. Filter by date range, user, action type, resource
// 3. Search in log messages
// 4. Export logs to CSV
// 5. Show event details (user, timestamp, action, resource, changes)
// 6. Color-code by event type (create, update, delete, login, etc.)

export const AuditLogsPage = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FiFileText className="text-2xl text-dt-accent" />
          <div>
            <h1 className="text-2xl font-bold text-dt-foreground">
              Auditoría del Sistema
            </h1>
            <p className="text-sm text-dt-subtle">
              Registro de eventos y acciones en el sistema
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-dt-accent/10 text-dt-accent border border-dt-accent/20 rounded-lg hover:bg-dt-accent/20 transition-colors">
          <FiSearch />
          Filtros Avanzados
        </button>
      </div>

      {/* Placeholder Content */}
      <div className="bg-dt-card border border-dt-border rounded-lg p-12 text-center">
        <FiFileText className="text-6xl text-dt-subtle mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-dt-foreground mb-2">
          Página de Auditoría
        </h3>
        <p className="text-dt-subtle mb-4">
          Esta página mostrará el log completo de eventos del sistema para
          auditoría y seguridad.
        </p>
        <div className="bg-dt-background border border-dt-border rounded-lg p-4 text-left max-w-2xl mx-auto">
          <p className="text-sm text-dt-foreground font-semibold mb-2">
            TODO: Implementar
          </p>
          <ul className="text-xs text-dt-subtle space-y-1 list-disc list-inside">
            <li>Listar todos los eventos de auditoría con paginación</li>
            <li>Filtrar por fecha, usuario, tipo de acción, recurso</li>
            <li>Buscar en mensajes de log</li>
            <li>
              Mostrar detalles de cada evento (usuario, timestamp, cambios)
            </li>
            <li>Exportar logs a CSV para análisis externo</li>
            <li>
              Color-code por tipo de evento (create, update, delete, login)
            </li>
            <li>Timeline visual de eventos</li>
            <li>Resaltar eventos críticos o de seguridad</li>
          </ul>
          <div className="mt-3 pt-3 border-t border-dt-border">
            <p className="text-xs text-dt-foreground font-semibold mb-1">
              Eventos típicos a auditar:
            </p>
            <ul className="text-xs text-dt-subtle list-disc list-inside">
              <li>Inicio y cierre de sesión de usuarios</li>
              <li>Creación, modificación y eliminación de tickets</li>
              <li>Cambios en configuración de agentes IA</li>
              <li>Modificaciones de usuarios y permisos</li>
              <li>Escalamiento y reasignación de tickets</li>
              <li>Acceso a datos sensibles</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
