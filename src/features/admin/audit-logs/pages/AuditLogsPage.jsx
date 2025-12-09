import React, { useState, useMemo } from "react";
import {
  FiFileText,
  FiSearch,
  FiDownload,
  FiFilter,
  FiUser,
  FiClock,
  FiCheckCircle,
  FiTrash2,
  FiEdit,
  FiLogIn,
  FiSettings,
  FiAlertTriangle,
} from "react-icons/fi";
import PageHeader from "@/shared/components/layout/PageHeader";
import toast from "react-hot-toast";
import { useAuditLogs, exportAuditLogs } from "../hooks";
import Button from "@/shared/components/ui/Button";
import FilterPanel from "@/shared/components/ui/FilterPanel";
import EmptyState from "@/shared/components/ui/EmptyState";
import ErrorState from "@/shared/components/ui/ErrorState";
import Badge from "@/shared/components/ui/Badge";
import { formatDistanceToNow } from "@/shared/utils/formatters";
import { useUsers } from "@/features/admin/users/hooks";

/**
 * UC-22: Audit Logs Page
 * Full implementation for viewing system audit logs with filtering and export
 */
export const AuditLogsPage = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: "",
    action: "",
    startDate: "",
    endDate: "",
    userId: "",
    resource: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, error } = useAuditLogs(filters);
  const { data: usersList = [] } = useUsers();
  const logs = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / filters.limit);
  const isCriticalEvent = (log) => {
    const haystack = `${log.accion || log.cud || log.tipoEvento || ""} ${
      log.detalles || JSON.stringify(log.payload) || ""
    } ${log.recurso || log.tabla || ""}`.toLowerCase();
    const criticalKeywords = [
      "delete",
      "permis",
      "security",
      "seguridad",
      "password",
      "token",
      "role",
      "permiso",
    ];
    return criticalKeywords.some((keyword) => haystack.includes(keyword));
  };

  const getTimestamp = (log) => {
    return log.timestamp || log.creadoEn || log.modificadoEn || null;
  };

  const getUserDisplay = (log) => {
    return log.usuarioNombre || "Sistema";
  };

  const getActionText = (log) => {
    return log.accion || log.cud || log.tipoEvento || "Evento";
  };

  const getResourceText = (log) => {
    return log.recurso || log.tabla || log.entidadId || "-";
  };

  const formatDetails = (log) => {
    if (log.detalles) return log.detalles;
    if (log.mensaje) return log.mensaje;
    if (log.payload) {
      try {
        if (typeof log.payload === "string") return log.payload;
        // Show a compact representation of payload (prefer nombre/correo/email)
        const preferredKeys = ["nombre", "name", "correo", "email", "id"];
        const entries = Object.entries(log.payload || {});
        // Try to pick preferred keys first
        const picked = [];
        for (const key of preferredKeys) {
          if (key in log.payload) {
            picked.push([key, log.payload[key]]);
          }
        }
        // Add other keys up to a small limit
        for (const [k, v] of entries) {
          if (picked.find((p) => p[0] === k)) continue;
          if (picked.length >= 4) break;
          picked.push([k, v]);
        }
        if (picked.length) {
          return picked
            .map(([k, v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v) : v}`)
            .join(" | ");
        }
        return JSON.stringify(log.payload);
      } catch (e) {
        return JSON.stringify(log.payload);
      }
    }
    const extras = [];
    if (log.ip) extras.push(`IP: ${log.ip}`);
    if (log.userAgent) extras.push(`UA: ${log.userAgent}`);
    return extras.join(" | ") || "-";
  };

  const timelineLogs = useMemo(() => {
    return [...logs]
      .filter((log) => getTimestamp(log))
      .sort((a, b) => new Date(getTimestamp(b)).getTime() - new Date(getTimestamp(a)).getTime())
      .slice(0, 8);
  }, [logs]);

  const filterConfig = useMemo(() => {
    return [
      {
        key: "action",
        type: "select",
        label: "Tipo de Acción",
        options: [
          { value: "", label: "Todas" },
          { value: "CREATE", label: "Crear" },
          { value: "UPDATE", label: "Actualizar" },
          { value: "DELETE", label: "Eliminar" },
          { value: "LOGIN", label: "Inicio de sesión" },
          { value: "LOGOUT", label: "Cierre de sesión" },
        ],
      },
      { key: "startDate", type: "date", label: "Fecha Desde" },
      { key: "endDate", type: "date", label: "Fecha Hasta" },
      {
        key: "userId",
        type: "select",
        label: "Usuario",
        options: [{ value: "", label: "Todos" }, ...(usersList || []).map((u) => ({ value: u.id, label: u.nombre }))],
      },
      { key: "resource", type: "text", label: "Recurso", placeholder: "tickets, usuarios, plantillas..." },
    ];
  }, [usersList]);

  const handleSearch = (e) => {
    setFilters({ ...filters, search: e.target.value, page: 1 });
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handleExport = async () => {
    toast.loading("Exportando logs...", { id: "export-logs" });
    try {
      await exportAuditLogs(filters);
      toast.success("Logs exportados exitosamente", { id: "export-logs" });
    } catch (err) {
      // Fallback to client-side export if backend endpoint doesn't exist
      if (err.message.includes("no disponible")) {
        exportLogsClientSide();
        toast.success("Logs exportados exitosamente", { id: "export-logs" });
      } else {
        toast.error("Error al exportar logs", { id: "export-logs" });
      }
    }
  };

  const exportLogsClientSide = () => {
    // Client-side CSV export fallback
    const headers = ["Timestamp", "Usuario", "Acción", "Recurso", "Detalles"];
    const rows = logs.map((log) => [
      new Date(getTimestamp(log) || Date.now()).toLocaleString(),
      getUserDisplay(log),
      getActionText(log),
      getResourceText(log),
      formatDetails(log),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const getActionIcon = (action) => {
    const actionLower = action?.toLowerCase() || "";
    if (actionLower.includes("create")) return FiCheckCircle;
    if (actionLower.includes("update") || actionLower.includes("edit"))
      return FiEdit;
    if (actionLower.includes("delete")) return FiTrash2;
    if (actionLower.includes("login")) return FiLogIn;
    return FiSettings;
  };

  const getActionColor = (action) => {
    const actionLower = action?.toLowerCase() || "";
    if (actionLower.includes("create")) return "success";
    if (actionLower.includes("update") || actionLower.includes("edit"))
      return "warning";
    if (actionLower.includes("delete")) return "error";
    if (actionLower.includes("login")) return "info";
    return "neutral";
  };

  if (error) {
    return (
      <div className="p-6">
        <ErrorState
          message="Error al cargar los logs de auditoría"
          details={error.message}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        icon={FiFileText}
        title="Auditoría del Sistema"
        description="Registro de eventos y acciones en el sistema"
      >
        <div className="flex gap-2">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="secondary"
            icon={FiFilter}
          >
            Filtros
          </Button>
          <Button onClick={handleExport} variant="primary" icon={FiDownload}>
            Exportar CSV
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
            placeholder="Buscar en logs..."
            value={filters.search}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 bg-dt-card border border-dt-border rounded-lg text-dt-foreground placeholder-dt-subtle focus:outline-none focus:ring-2 focus:ring-dt-accent"
          />
        </div>

        {/* Advanced Filters: replaced by reusable FilterPanel */}
        <FilterPanel
          open={showFilters}
          config={filterConfig}
          values={filters}
          onChange={handleFilterChange}
        />
      </div>

      {/* Logs List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-dt-card border border-dt-border rounded-lg p-4 animate-pulse"
            >
              <div className="h-4 bg-dt-border rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-dt-border rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : logs.length === 0 ? (
        <EmptyState
          icon={FiFileText}
          title="No hay logs de auditoría"
          description={
            filters.search || filters.action || filters.startDate
              ? "No se encontraron logs con los filtros aplicados"
              : "Aún no hay eventos registrados en el sistema"
          }
        />
      ) : (
        <>
          <div className="bg-dt-card border border-dt-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dt-background border-b border-dt-border">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-dt-subtle uppercase">
                      Timestamp
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-dt-subtle uppercase">
                      Usuario
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-dt-subtle uppercase">
                      Acción
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-dt-subtle uppercase">
                      Recurso
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-dt-subtle uppercase">
                      Detalles
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dt-border">
                  {logs.map((log, index) => {
                    const critical = isCriticalEvent(log);
                    const actionText = getActionText(log);
                    const ActionIcon = getActionIcon(actionText);
                    return (
                      <tr
                        key={log.id || index}
                        className={`transition-colors ${
                          critical
                            ? "bg-red-500/5 border-l-2 border-red-500"
                            : "hover:bg-dt-background/50"
                        }`}
                      >
                        <td className="px-4 py-3 text-sm text-dt-foreground">
                          <div className="flex items-center gap-2">
                            <FiClock className="text-dt-subtle" size={14} />
                            <span>
                              {getTimestamp(log)
                                ? formatDistanceToNow(new Date(getTimestamp(log)))
                                : "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-dt-foreground">
                          <div className="flex items-center gap-2">
                            <FiUser className="text-dt-subtle" size={14} />
                            <span>{getUserDisplay(log)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={critical ? "danger" : getActionColor(actionText)}
                            >
                              <span className="flex items-center gap-1">
                                <ActionIcon size={12} />
                                {actionText}
                              </span>
                            </Badge>
                            {critical && (
                              <span className="text-xs text-red-400 flex items-center gap-1">
                                <FiAlertTriangle size={12} /> Crítico
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-dt-subtle">
                          {getResourceText(log)}
                        </td>
                        <td className="px-4 py-3 text-sm text-dt-subtle max-w-md truncate">
                          {formatDetails(log)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-dt-card border border-dt-border rounded-lg p-5 mt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-dt-foreground">
                  Timeline de eventos recientes
                </h3>
                <p className="text-xs text-dt-subtle">
                  Últimos {timelineLogs.length} eventos registrados
                </p>
              </div>
            </div>
            {timelineLogs.length === 0 ? (
              <p className="text-sm text-dt-subtle">
                Aún no hay eventos con timestamp para mostrar en el timeline.
              </p>
            ) : (
              <div className="relative pl-6">
                <div className="absolute left-2 top-0 bottom-0 w-px bg-dt-border"></div>
                {timelineLogs.map((log, index) => {
                  const critical = isCriticalEvent(log);
                  const actionText = getActionText(log);
                  const ActionIcon = getActionIcon(actionText);
                  return (
                    <div key={log.id || index} className="mb-6 last:mb-0 relative">
                      <span
                        className={`absolute -left-[7px] w-3.5 h-3.5 rounded-full border-2 ${
                          critical
                            ? "border-red-500 bg-red-500/40"
                            : "border-dt-border bg-dt-background"
                        }`}
                      ></span>
                      <div className="flex items-center gap-2 text-xs text-dt-subtle">
                        <FiClock size={12} />
                        {getTimestamp(log)
                          ? formatDistanceToNow(new Date(getTimestamp(log)))
                          : "N/A"}
                        <span className="text-[10px] uppercase tracking-wide">
                          {getUserDisplay(log)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={critical ? "danger" : getActionColor(actionText)}>
                          <span className="flex items-center gap-1">
                            <ActionIcon size={12} />
                            {actionText}
                          </span>
                        </Badge>
                        <span className="text-sm text-dt-foreground">
                          {formatDetails(log) || getResourceText(log) || "Evento"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-dt-subtle">
                Mostrando{" "}
                {(filters.page - 1) * filters.limit + 1} a{" "}
                {Math.min(filters.page * filters.limit, total)} de {total} logs
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() =>
                    setFilters({ ...filters, page: filters.page - 1 })
                  }
                  disabled={filters.page === 1}
                  variant="secondary"
                  size="sm"
                >
                  Anterior
                </Button>
                <span className="px-4 py-2 text-sm text-dt-foreground">
                  Página {filters.page} de {totalPages}
                </span>
                <Button
                  onClick={() =>
                    setFilters({ ...filters, page: filters.page + 1 })
                  }
                  disabled={filters.page === totalPages}
                  variant="secondary"
                  size="sm"
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
