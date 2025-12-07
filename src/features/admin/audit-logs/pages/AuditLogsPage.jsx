import React, { useState } from "react";
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
} from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuditLogs, exportAuditLogs } from "../hooks";
import Button from "@/shared/components/ui/Button";
import EmptyState from "@/shared/components/ui/EmptyState";
import ErrorState from "@/shared/components/ui/ErrorState";
import Badge from "@/shared/components/ui/Badge";
import { formatDistanceToNow } from "@/shared/utils/formatters";

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
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, error } = useAuditLogs(filters);
  const logs = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / filters.limit);

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
      new Date(log.timestamp).toLocaleString(),
      log.usuario?.nombre || "Sistema",
      log.accion,
      log.recurso || "-",
      log.detalles || "-",
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
    if (actionLower.includes("delete")) return "danger";
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
      </div>

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

        {/* Advanced Filters */}
        {showFilters && (
          <div className="bg-dt-card border border-dt-border rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-dt-foreground mb-2">
                  Tipo de Acción
                </label>
                <select
                  value={filters.action}
                  onChange={(e) => handleFilterChange("action", e.target.value)}
                  className="w-full px-3 py-2 bg-dt-background border border-dt-border rounded-lg text-dt-foreground focus:outline-none focus:ring-2 focus:ring-dt-accent"
                >
                  <option value="">Todas</option>
                  <option value="CREATE">Crear</option>
                  <option value="UPDATE">Actualizar</option>
                  <option value="DELETE">Eliminar</option>
                  <option value="LOGIN">Inicio de sesión</option>
                  <option value="LOGOUT">Cierre de sesión</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-dt-foreground mb-2">
                  Fecha Desde
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    handleFilterChange("startDate", e.target.value)
                  }
                  className="w-full px-3 py-2 bg-dt-background border border-dt-border rounded-lg text-dt-foreground focus:outline-none focus:ring-2 focus:ring-dt-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dt-foreground mb-2">
                  Fecha Hasta
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) =>
                    handleFilterChange("endDate", e.target.value)
                  }
                  className="w-full px-3 py-2 bg-dt-background border border-dt-border rounded-lg text-dt-foreground focus:outline-none focus:ring-2 focus:ring-dt-accent"
                />
              </div>
            </div>
          </div>
        )}
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
                  {logs.map((log, index) => (
                    <tr
                      key={log.id || index}
                      className="hover:bg-dt-background/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-dt-foreground">
                        <div className="flex items-center gap-2">
                          <FiClock className="text-dt-subtle" size={14} />
                          <span>
                            {log.timestamp
                              ? formatDistanceToNow(new Date(log.timestamp))
                              : "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-dt-foreground">
                        <div className="flex items-center gap-2">
                          <FiUser className="text-dt-subtle" size={14} />
                          <span>{log.usuario?.nombre || "Sistema"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={getActionColor(log.accion)}
                          icon={getActionIcon(log.accion)}
                        >
                          {log.accion}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-dt-subtle">
                        {log.recurso || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-dt-subtle max-w-md truncate">
                        {log.detalles || log.mensaje || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
