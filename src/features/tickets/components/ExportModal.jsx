import React, { useState } from "react";
import Modal from "src/shared/components/ui/Modal";
import Button from "src/shared/components/ui/Button";
import toast from "react-hot-toast";
import { exportTicketsToCsv } from "../api/ticketsApi";

const ExportModal = ({ isOpen, onClose, initialFilters = {} }) => {
  const [estado, setEstado] = useState(initialFilters.estado || "");
  const [fechaDesde, setFechaDesde] = useState(initialFilters.fechaDesde || "");
  const [fechaHasta, setFechaHasta] = useState(initialFilters.fechaHasta || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const filters = {
        estado: estado || undefined,
        fechaDesde: fechaDesde || undefined,
        fechaHasta: fechaHasta || undefined,
      };

      const result = await exportTicketsToCsv(filters);

      // Flexible handling: backend may return { url } or raw csv text or { csv } or { filename, content }
      if (!result) {
        toast.error("Exportación falló: respuesta vacía del servidor");
        return;
      }

      // If backend returns an object with `url`, open it
      if (result.url) {
        window.open(result.url, "_blank");
        toast.success("Exportación iniciada en nueva pestaña");
        onClose();
        return;
      }

      // If backend returned a CSV string under `csv`, `data`, `content`, or directly a string
      const csvText = result.csv || result.data || result.content || (typeof result === "string" ? result : null);
      if (csvText) {
        const filename = result.filename || `tickets_export_${new Date().toISOString().slice(0,10)}.csv`;
        // Add BOM for UTF-8 encoding to prevent character issues in Excel
        const blob = new Blob(['\ufeff' + csvText], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        toast.success("CSV descargado");
        onClose();
        return;
      }

      toast.error("Formato de respuesta de exportación no soportado");
    } catch (err) {
      console.error("Export failed:", err);
      toast.error(err?.message || "Error al exportar tickets");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Exportar Tickets a CSV">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-dt-subtle mb-1">Estado</label>
          <select value={estado} onChange={(e) => setEstado(e.target.value)} className="w-full p-2 rounded bg-white/5">
            <option value="">-- Todos --</option>
            <option value="nuevo">Nuevo</option>
            <option value="ia_sugerido">IA Sugerido</option>
            <option value="esperando_cliente">Esperando Cliente</option>
            <option value="cerrado">Cerrado</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-dt-subtle mb-1">Desde</label>
            <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} className="w-full p-2 rounded bg-white/5" />
          </div>
          <div>
            <label className="block text-sm text-dt-subtle mb-1">Hasta</label>
            <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} className="w-full p-2 rounded bg-white/5" />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>Cancelar</Button>
          <Button variant="primary" onClick={handleExport} disabled={isLoading}>{isLoading ? "Exportando..." : "Exportar CSV"}</Button>
        </div>
      </div>
    </Modal>
  );
};

export default ExportModal;
